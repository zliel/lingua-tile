import React, {useEffect, useState} from 'react';
import {useAuth} from '../Contexts/AuthContext';
import {useSnackbar} from '../Contexts/SnackbarContext';
import axios from 'axios';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';

const AdminCardTable = () => {
    const {auth} = useAuth();
    const {showSnackbar} = useSnackbar();
    const [cards, setCards] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [editingCardId, setEditingCardId] = useState(null);
    const [editedCard, setEditedCard] = useState({});

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/cards/all', {
                    headers: {Authorization: `Bearer ${auth.token}`}
                });
                setCards(response.data);
            } catch (error) {
                showSnackbar('Failed to fetch cards', 'error');
            }
        };

        fetchCards();
    }, [auth.token, showSnackbar]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/lessons/all');
                setLessons(response.data);
            } catch (error) {
                showSnackbar('Failed to fetch lessons', 'error');
            }
        };

        fetchLessons();
    }, [showSnackbar]);

    const handleEdit = (card) => {
        setEditingCardId(card._id);
        setEditedCard(card);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/cards/update/${editingCardId}`, editedCard, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
            setCards(cards.map(card => card._id === editingCardId ? editedCard : card));
            setEditingCardId(null);

            showSnackbar('Card updated successfully', 'success');
        } catch (error) {
            showSnackbar('Failed to update card', 'error');
        }
    }

    const handleDelete = async (cardId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/cards/delete/${cardId}`, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
            setCards(cards.filter(card => card._id !== cardId));
            showSnackbar('Card deleted successfully', 'success');
        } catch (error) {
            showSnackbar('Failed to delete card', 'error');
        }
    }


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
            <Typography variant="h4" gutterBottom>Cards Table</Typography>
            <TableContainer sx={{maxWidth: "80%", borderRadius: 2, border: `1px solid`}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Front</TableCell>
                            <TableCell>Back</TableCell>
                            <TableCell>Lessons</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cards.map(card => (
                            <TableRow key={card._id} onDoubleClick={(e) => handleEdit(card)}>
                                <TableCell>{card._id}</TableCell>
                                <TableCell>
                                    {editingCardId === card._id ? (
                                        <TextField
                                            value={editedCard.front_text}
                                            onChange={(e) => setEditedCard({...editedCard, front_text: e.target.value})}
                                        />
                                    ) : (
                                        card.front_text
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingCardId === card._id ? (
                                        <TextField
                                            value={editedCard.back_text}
                                            onChange={(e) => setEditedCard({...editedCard, back_text: e.target.value})}
                                        />
                                    ) : (
                                        card.back_text
                                    )}
                                </TableCell>
                                <TableCell>
                                    {(editingCardId === card._id) ? (
                                        <TextField
                                            value={editedCard.lesson_id}
                                            onChange={(e) => setEditedCard({...editedCard, lesson: e.target.value})}
                                        />
                                    ) : (
                                        lessons.find(lesson => lesson._id === card.lesson_id)?.name || 'No Associated Lesson'
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingCardId === card._id ? (
                                        <>
                                            <Button variant={"contained"} color={"primary"}
                                                    onClick={handleUpdate}>Save</Button>
                                            <Button sx={{ml: 1}} variant={"contained"} color={"warning"}
                                                    onClick={() => setEditingCardId(null)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <Button variant={"contained"} color={"primary"}
                                                onClick={() => handleEdit(card)}>Edit</Button>
                                    )}
                                    <Button sx={{ml: 1}} variant={"contained"} color={"error"} onClick={() => handleDelete(card._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminCardTable;