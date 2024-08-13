import React, {useContext, useState, useEffect} from 'react';
import {Box, Typography, Button, Grid} from '@mui/material';
import AuthContext from '../AuthContext';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Profile() {
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

    const handleUpdate = () => {
        // Redirect to update profile page
        navigate('/update-profile');
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/delete/${user._id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            logout(() => navigate('/home'));
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    if (!auth.isLoggedIn) {
        return <Typography variant="h6" textAlign="center">Please log in to view your profile.</Typography>;
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
            <Typography variant="h4" gutterBottom>Profile</Typography>
            <Typography variant="h6" gutterBottom>Username: {username}</Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>Update Profile</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleDelete}>Delete Profile</Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Profile;