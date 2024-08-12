import React, {useContext, useState, useEffect} from 'react';
import {Box, Typography, Button, Grid, TextField} from '@mui/material';
import AuthContext from '../AuthContext';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function UpdateProfile() {
    const {auth, logout} = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/users`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                });
                setUsername(response.data.username);
                setUser(response.data)
            } catch (error) {
                console.error('Error fetching user data', error);
                logout(() => navigate('/home'));
            }
        };

        if (auth.isLoggedIn) {
            fetchUserData();
        }
    }, [auth, logout, navigate]);

    const handleSave = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/users/update/${user._id}`, user, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            // Invalidate the token
            logout(() => navigate('/login'));
        } catch (error) {
            console.error('Error updating user', error);
        }
    }



    if (!auth.isLoggedIn) {
        return <Typography variant="h6" textAlign="center">Please log in to update your profile.</Typography>;
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, justifyContent: 'center'}}>
            <Typography variant="h4" gutterBottom>Update Profile</Typography>
            <Typography variant="h6" gutterBottom>Current Username: {username}</Typography>
            <Grid container spacing={2} justifyContent="center" alignItems={"center"} direction={"column"}>
                <Grid item>
                    <TextField variant={"outlined"} label="New Username" value={user.username || ''} onChange={(e) => setUser({...user, username: e.target.value})}/>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleSave} size={"small"}>Save Changes</Button>
                </Grid>
            </Grid>
            <Typography variant={"body1"} color={"error"} gutterBottom>Note that after saving changes, you will need to log back in.</Typography>
        </Box>
    );
}

export default UpdateProfile;