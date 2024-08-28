import React, {useState} from 'react';
import {useAuth} from '../Contexts/AuthContext';
import {useSnackbar} from '../Contexts/SnackbarContext';
import NewLessonForm from '../Components/NewLessonForm';
import axios from 'axios';
import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import {
    Autocomplete,
    Box,
    Button, Skeleton,
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
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [editedLesson, setEditedLesson] = useState({});
    const queryClient = useQueryClient();

    const { data: lessons = [], isLoadingLessons, isErrorLessons } = useQuery({
        queryKey: ['lessons', auth.token],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/lessons/all');

            return response.data;
        }
    });

    const { data: sections = [], isLoadingSections, isErrorSections } = useQuery({
        queryKey: ['sections', auth.token],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/sections/all');

            return response.data;
        }
    })

    const { data: cards = [], isLoadingCards, isErrorCards } = useQuery({
        queryKey: ['cards', auth.token],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/cards/all', {
                headers: {Authorization: `Bearer ${auth.token}`}
            });

            return response.data;
        }
    });

    const handleEdit = (card) => {
        setEditingLessonId(card._id);
        setEditedLesson(card);
    };

    const updateMutation = useMutation({
        mutationFn: async () => {
            await axios.put(`http://127.0.0.1:8000/api/lessons/update/${editedLesson._id}`, editedLesson, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
        },
        onSuccess: () => {
            setEditingLessonId(null);
            queryClient.invalidateQueries('lessons');
            showSnackbar('Lesson updated successfully', 'success');
        },
        onError: () => {
            showSnackbar('Failed to update lesson', 'error');
        }
    })

    const handleUpdate = async () => {
        updateMutation.mutate();
    }

    const deleteMutation = useMutation({
        mutationFn: async (lessonId) => {
            await axios.delete(`http://127.0.0.1:8000/api/lessons/delete/${lessonId}`, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
        },
        onSuccess: () => {
            setEditingLessonId(null);
            queryClient.invalidateQueries('lessons');
            showSnackbar('Lesson deleted successfully', 'success');
        },
        onError: () => {
            showSnackbar('Failed to delete lesson', 'error');
        }
    })

    const handleDelete = async (lessonId) => {
        deleteMutation.mutate(lessonId);
    }

    const addMutation = useMutation({
        mutationFn: async (lesson) => {
            await axios.post('http://127.0.0.1:8000/api/lessons/create', lesson, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries('lessons');
            showSnackbar('Lesson added successfully', 'success');
        },
        onError: () => {
            showSnackbar('Failed to add lesson', 'error');
        }
    })

    const handleAddLesson = async (lesson) => {
        addMutation.mutate(lesson)
    }

    if (isLoadingLessons || isLoadingSections || isLoadingCards) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
                <Typography variant="h4" gutterBottom>Loading...</Typography>
                <Skeleton variant="rectangular" animation={"wave"} width="90%" height={40} sx={{mb: 2}} />
                <Skeleton variant="rectangular" animation={"wave"} width="90%" height={30} sx={{mb: 2}} />
                <Skeleton variant="rectangular" animation={"wave"} width="90%" height={20} sx={{mb: 2}} />
            </Box>
        )
    }

    if (isErrorLessons || isErrorSections || isErrorCards) {
        return <Typography variant="h6" textAlign="center">Failed to fetch data</Typography>
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>

            <Typography variant="h4" gutterBottom>Lesson Table</Typography>
            <NewLessonForm cards={cards} sections={sections} onSubmit={handleAddLesson}/>
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
                                                setEditedLesson({...editedLesson, section_id: newValue?._id ? newValue._id : ''});
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