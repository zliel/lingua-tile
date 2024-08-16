import React, {useEffect, useState} from 'react';
import {useAuth} from '../Contexts/AuthContext';
import {useSnackbar} from '../Contexts/SnackbarContext';
import axios from 'axios';
import {
    Autocomplete,
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
import NewCardForm from '../Components/NewCardForm';

const AdminCardTable = () => {
    const {auth} = useAuth();
    const {showSnackbar} = useSnackbar();
    const [cards, setCards] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [editingCardId, setEditingCardId] = useState(null);
    const [editedCard, setEditedCard] = useState({});
    const [sections, setSections] = useState([])
    const [lessonGroups, setLessonGroups] = useState([])

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
        const fetchLessonsAndSections = async () => {
            try {
                const [lessonsResponse, sectionsResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/lessons/all'),
                    axios.get('http://127.0.0.1:8000/api/sections/all')
                ]);

                const lessons = lessonsResponse.data;
                const sections = sectionsResponse.data;

                setLessons(lessons);
                setSections(sections);

                const groupedLessons = sections.reduce((acc, section) => {
                    acc[section.name] = lessons.filter(lesson => lesson.section_id === section._id);
                    return acc;
                }, {});

                groupedLessons['Ungrouped'] = lessons.filter(lesson => !lesson.section_id);

                setLessonGroups(groupedLessons);
            } catch (error) {
                showSnackbar('Failed to fetch lessons or sections', 'error');
            }
        };

        fetchLessonsAndSections();
    }, [showSnackbar]);

    const handleEdit = (card) => {
        setEditingCardId(card._id);
        setEditedCard(card);
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/cards/update/${editingCardId}`, editedCard, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
            console.dir(response.data)
            setCards(cards.map(card => card._id === editingCardId ? {...editedCard, lesson_ids: editedCard.lesson_ids} : card));
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

    const handleAddCard = async (newCard) => {
        if (!newCard.front_text || !newCard.back_text) {
            showSnackbar('Front and back text are required', 'error');
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/cards/create', newCard, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setCards([...cards, response.data]);
            showSnackbar('Card added successfully', 'success');
        } catch (error) {
            showSnackbar('Failed to add card', 'error');
        }
    }


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>

            <Typography variant="h4" gutterBottom>Cards Table</Typography>
            <NewCardForm lessons={lessons} lessonGroups={lessonGroups} sections={sections} onSubmit={handleAddCard} />
            <TableContainer sx={{maxWidth: "90%", borderRadius: 2, border: `1px solid`}}>
                <Table sx={{ minWidth: 700 }}>
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
                                <TableCell sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {card._id}
                                </TableCell>
                                <TableCell>
                                    {editingCardId === card._id ? (
                                        <TextField
                                            value={editedCard.front_text}
                                            onChange={(e) => setEditedCard({...editedCard, front_text: e.target.value})}
                                        />
                                    ) : (
                                        <Typography  sx={{ minWidth: 100, whiteSpace: 'nowrap' }}>
                                            {card.front_text}
                                        </Typography>

                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingCardId === card._id ? (
                                        <TextField
                                            value={editedCard.back_text}
                                            onChange={(e) => setEditedCard({...editedCard, back_text: e.target.value})}
                                        />
                                    ) : (
                                        <Typography  sx={{ minWidth: 100, whiteSpace: 'nowrap' }}>
                                            {card.back_text}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell sx={{width: 300}}>
                                    {editingCardId === card._id ? (
                                        <Autocomplete
                                            multiple
                                            options={Object.keys(lessonGroups).flatMap(section => lessonGroups[section])}
                                            groupBy={(option) => sections.find(section => section._id === option.section_id)?.name || 'Ungrouped'}
                                            getOptionLabel={(option) => option.title}
                                            value={lessons.filter(lesson => editedCard.lesson_ids?.includes(lesson._id))}
                                            onChange={(event, newValue) => {
                                                setEditedCard({...editedCard, lesson_ids: newValue.map(lesson => lesson._id)});
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} variant="standard" label="Lessons" placeholder="Select lessons" />
                                            )}

                                        />
                                    ) : (
                                        <Typography  sx={{ minWidth: 150}}>
                                            {card.lesson_ids?.map(lessonId => lessons.find(lesson => lesson._id === lessonId)?.title).join(', \n')}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell sx={{whiteSpace: 'noWrap'}}>
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