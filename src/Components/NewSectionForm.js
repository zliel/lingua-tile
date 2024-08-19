import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Autocomplete } from '@mui/material';
import axios from 'axios';

const NewSectionForm = ({ lessons, onSubmit }) => {
    const [newSection, setNewSection] = useState({name: '', lesson_ids: []})

    const handleAddSection = () => {
        onSubmit(newSection);
        setNewSection({});
    }

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
                <Typography variant="h6" gutterBottom>Add a New Section</Typography>
                <TextField
                    label="Section Name"
                    value={newSection.name || ''}
                    onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                    sx={{ mb: 2, width: '300px' }}
                    required
                />
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={lessons}
                    getOptionLabel={(option) => option.title}
                    value={lessons.filter(lesson => newSection.lesson_ids?.includes(lesson._id))}
                    onChange={(event, newValue) => {
                        setNewSection({ ...newSection, lesson_ids: newValue.map(lesson => lesson._id) })}
                    }
                    renderInput={(params) => <TextField {...params} label="Lessons" variant="standard" />}
                    sx={{ mb: 2, width: '300px'}}
                />
                <Button variant="contained" color="primary" onClick={handleAddSection}>Add Section</Button>
            </Box>
        </Box>
    );
};

export default NewSectionForm;