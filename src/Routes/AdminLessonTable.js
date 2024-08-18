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

const AdminLessonTable = () => {
    const {auth} = useAuth();
    const {showSnackbar} = useSnackbar();
    const [cards, setCards] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [editedLesson, setEditedLesson] = useState({});
    const [sections, setSections] = useState([])

    useEffect(() => {
        const fetchCards = async () => {
            try {
                console.log(`Sending token: ${auth.token}`);
                const response = await axios.get('http://127.0.0.1:8000/api/cards/all', {
                    headers: {Authorization: `Bearer ${auth.token}`}
                })

                setCards(response.data);
            } catch (error) {
                showSnackbar('Failed to fetch cards', 'error');
            }
        }

        if (auth.token) fetchCards();
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

            } catch (error) {
                showSnackbar('Failed to fetch lessons or sections', 'error');
            }
        };

        fetchLessonsAndSections();
    }, [showSnackbar]);


    const handleEdit = (card) => {
        setEditingLessonId(card._id);
        setEditedLesson(card);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/lessons/update/${editedLesson._id}`, editedLesson, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });

            setLessons(lessons.map(lesson => lesson._id === editedLesson._id ? editedLesson : lesson));
            setEditingLessonId(null);
        } catch (error) {
            showSnackbar('Failed to update lesson', 'error');
        }
    }

    const handleDelete = async (lessonId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/lessons/delete/${lessonId}`, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
            setLessons(lessons.filter(lesson => lesson._id !== lessonId));
            showSnackbar('Lesson deleted successfully', 'success');
        } catch (error) {
            showSnackbar('Failed to delete lesson', 'error');
        }
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>

            <Typography variant="h4" gutterBottom>Lesson Table</Typography>

            <TableContainer sx={{maxWidth: "90%", borderRadius: 2, border: `1px solid`}}>
                <Table sx={{minWidth: 700}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Section Name</TableCell>
                            <TableCell>Cards</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lessons.map(lesson => (
                            <TableRow key={lesson._id} onDoubleClick={() => handleEdit(lesson)}>
                                <TableCell sx={{
                                    maxWidth: 100,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {lesson._id}
                                </TableCell>
                                <TableCell>{lesson.title}</TableCell>
                                <TableCell sx={{width: 300}}>
                                    {editingLessonId === lesson._id ? (
                                        <Autocomplete
                                            options={sections}
                                            getOptionLabel={(option) => option.name}
                                            value={sections.find(section => section._id === lesson.section_id)}
                                            onChange={(event, newValue) => {
                                                setEditedLesson({...editedLesson, section_id: newValue._id});
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Section"
                                                                                variant="outlined"/>}
                                        />
                                    ) : (
                                        sections.find(section => section._id === lesson.section_id)?.name
                                    )}
                                </TableCell>
                                <TableCell sx={{width: 300}}>
                                    {editingLessonId === lesson._id ? (
                                        <Autocomplete
                                            multiple
                                            disableCloseOnSelect
                                            options={cards}
                                            getOptionLabel={(option) => option.front_text}
                                            value={cards.filter(card => editedLesson.card_ids?.includes(card._id))}
                                            onChange={(event, newValue) => {
                                                setEditedLesson({
                                                    ...editedLesson,
                                                    card_ids: newValue.map(card => card._id)
                                                });
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Cards"
                                                                                variant="outlined"/>}
                                        />
                                    ) : (
                                        <Typography sx={{minWidth: 150}}>
                                            {lesson.card_ids?.map(cardId => cards.find(card => card._id === cardId)?.front_text).join(', \n')}
                                        </Typography>
                                    )
                                    }
                                </TableCell>
                                <TableCell sx={{whiteSpace: 'noWrap'}}>
                                    {editingLessonId === lesson._id ? (
                                        <>
                                            <Button variant={"contained"} color={"primary"}
                                                    onClick={handleUpdate}>Save</Button>
                                            <Button sx={{ml: 1}} variant={"contained"} color={"warning"}
                                                    onClick={() => setEditingLessonId(null)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <Button variant={"contained"} color={"primary"}
                                                onClick={() => handleEdit(lesson)}>Edit</Button>
                                    )}
                                    <Button sx={{ml: 1}} variant={"contained"} color={"error"}
                                            onClick={() => handleDelete(lesson._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminLessonTable;