import React, {useState} from 'react';
import {Autocomplete, Box, Button, TextField, Typography} from '@mui/material';

const NewLessonForm = ({cards, sections, onSubmit}) => {
    const [newLesson, setNewLesson] = useState({title: '', section_id: '', card_ids: []});

    const handleAddLesson = () => {
        onSubmit(newLesson);
        setNewLesson({title: '', section_id: '', card_ids: []});
    };


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4}}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
                p: 2,
                border: '1px solid #ccc',
                borderRadius: 2
            }}>
                <Typography variant="h6" gutterBottom>Add a New Lesson</Typography>
                <TextField
                    label="Title"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    sx={{mb: 2, width: '300px'}}
                    required
                />
                <Autocomplete
                    options={sections}
                    getOptionLabel={(option) => option.name}
                    value={sections.find(section => section._id === newLesson.section_id) || null}
                    onChange={(event, newValue) => {
                        setNewLesson({...newLesson, section_id: newValue ? newValue._id : ''});
                    }}
                    renderInput={(params) => <TextField {...params} label="Section" variant="outlined"/>}
                    sx={{mb: 2, width: '300px'}}
                />

                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={cards}
                    getOptionLabel={(option) => option.front_text}
                    value={cards.filter(card => newLesson.card_ids?.includes(card._id))}
                    onChange={(event, newValue) => {
                        setNewLesson({
                            ...newLesson,
                            card_ids: newValue.map(card => card._id)
                        });
                    }}
                    renderInput={(params) => <TextField {...params} label="Cards"
                                                        variant="outlined"/>}
                    sx={{mb: 2, width: '300px'}}
                />
                <Button variant="contained" color="primary" onClick={handleAddLesson}>Add Card</Button>
            </Box>
        </Box>
    );
};

export default NewLessonForm;