import React, { useEffect, useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { useSnackbar } from '../Contexts/SnackbarContext';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

const AdminUserTable = () => {
    const { auth } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users/admin/all', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                console.dir(response.data)
                setUsers(response.data);
            } catch (error) {
                showSnackbar('Failed to fetch users', 'error');
            }
        };

        fetchUsers();
    }, [auth.token, showSnackbar]);

    const handleEdit = (user) => {
        setEditingUserId(user._id);
        setEditedUser(user);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/users/update/${editingUserId}`, editedUser, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setUsers(users.map(user => (user.id === editingUserId ? editedUser : user)));
            setEditingUserId(null);
            showSnackbar('User updated successfully', 'success');
        } catch (error) {
            showSnackbar('Failed to update user', 'error');
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/delete/${userId}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setUsers(users.filter(user => user.id !== userId));
            showSnackbar('User deleted successfully', 'success');
        } catch (error) {
            showSnackbar('Failed to delete user', 'error');
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Users Table</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Completed Lessons</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user._id} onDoubleClick={(e) => handleEdit(user)}>
                                <TableCell>{user._id}</TableCell>
                                <TableCell>
                                    {editingUserId === user._id ? (
                                        <TextField
                                            value={editedUser.username}
                                            onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                                        />
                                    ) : (
                                        user.username
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingUserId === user._id ? (
                                        <TextField
                                            value={editedUser.completedLessons}
                                            onChange={(e) => setEditedUser({ ...editedUser, completedLessons: e.target.value })}
                                        />
                                    ) : (
                                        user.completedLessons
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingUserId === user._id ? (
                                        <Button variant="contained" color="primary"  onClick={handleUpdate}>Save</Button>
                                    ) : (
                                        <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>Update</Button>
                                    )}
                                    <Box sx={{ display: 'inline-block', ml: 1 }}>
                                        <Button variant="contained" color="warning" onClick={() => handleDelete(user._id)}>Delete</Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminUserTable;