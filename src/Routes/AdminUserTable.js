import React, {useEffect, useState} from 'react';
import {useAuth} from '../Contexts/AuthContext';
import {useSnackbar} from '../Contexts/SnackbarContext';
import axios from 'axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
    Box,
    Button,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';

const AdminUserTable = () => {
    const {auth} = useAuth();
    const {showSnackbar} = useSnackbar();
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const queryClient = useQueryClient();

    const {data: users = [], isLoading, isError} = useQuery({
        queryKey: ['users', auth.token],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/users/admin/all', {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
            return response.data
        }
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (editingUserId) {
                if (event.key === 'Escape') {
                    setEditingUserId(null);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [editingUserId]);

    const handleEdit = (user) => {
        setEditingUserId(user._id);
        setEditedUser(user);
    };

    const updateMutation = useMutation({
        mutationFn: async (userId) => {
            await axios.put(`http://127.0.0.1:8000/api/users/update/${userId}`, editedUser, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
        },
        onSuccess: () => {
            showSnackbar('User updated successfully', 'success');
            queryClient.invalidateQueries(['users', auth.token]);
        },
        onError: () => {
            showSnackbar('Failed to update user', 'error')
        }
    })

    const handleUpdate = (userId) => {
        updateMutation.mutate(userId);
        setEditingUserId(null);
    }

    const deleteMutation = useMutation({
        mutationFn: async (userId) => {
            await axios.delete(`http://127.0.0.1:8000/api/users/delete/${userId}`, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
        },
        onSuccess: () => {
            showSnackbar('User deleted successfully', 'success');
            queryClient.invalidateQueries(['users', auth.token]);
        },
        onError: () => {
            showSnackbar('Failed to delete user', 'error')
        }
    })


    const handleDelete = async (userId) => {
        // In this situation I think that use the built-in window.confirm is a better option than the ConfirmationDialog component, as it
        // avoids overcomplicating the delete method.
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        deleteMutation.mutate(userId);
        setEditingUserId(null);
    };

    if (isLoading) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
                <Typography variant="h4" gutterBottom>Loading...</Typography>
                <Skeleton variant="rectangular" animation={"wave"} width="90%" height={40} sx={{mb: 2}}/>
                <Skeleton variant="rectangular" animation={"wave"} width="90%" height={30} sx={{mb: 2}}/>
                <Skeleton variant="rectangular" animation={"wave"} width="90%" height={20} sx={{mb: 2}}/>
            </Box>
        )
    }

    if (isError) {
        return <Typography variant="h6" textAlign="center">Error loading users.</Typography>
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
            <Typography variant="h4" gutterBottom>Users Table</Typography>
            <TableContainer sx={{maxWidth: "80%", borderRadius: 2, border: `1px solid`}}>
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
                            <TableRow key={user._id} onDoubleClick={() => handleEdit(user)}>
                                <TableCell>{user._id}</TableCell>
                                <TableCell>
                                    {editingUserId === user._id ? (
                                        <TextField
                                            value={editedUser.username}
                                            onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                                        />
                                    ) : (
                                        user.username
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingUserId === user._id ? (
                                        <TextField
                                            value={editedUser.completedLessons}
                                            onChange={(e) => setEditedUser({
                                                ...editedUser,
                                                completedLessons: e.target.value
                                            })}
                                        />
                                    ) : (
                                        user.completedLessons
                                    )}
                                </TableCell>
                                <TableCell sx={{whiteSpace: 'noWrap'}}>
                                    {editingUserId === user._id ? (
                                        <>
                                            <Button variant="contained" color="primary"
                                                    onClick={() => handleUpdate(user._id)}>Save</Button>
                                            <Button sx={{ml: 1}} variant="contained" color="warning"
                                                    onClick={() => setEditingUserId(null)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <Button variant="contained" color="primary"
                                                onClick={() => handleEdit(user)}>Update</Button>
                                    )}
                                    <Button sx={{ml: 1}} variant="contained" color="error"
                                            onClick={() => handleDelete(user._id)}>Delete</Button>
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