import React, {useState} from 'react';
import {Box, Button, Grid, Skeleton, TextField, Typography} from '@mui/material';
import axios from 'axios';
import {useMutation, useQuery} from '@tanstack/react-query'
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from '../Contexts/SnackbarContext';
import {useAuth} from '../Contexts/AuthContext';

function UpdateProfile() {
    const {auth, logout} = useAuth();
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const {showSnackbar} = useSnackbar();


    const {data: user, isError, isLoading} = useQuery({
        queryKey: ['user', auth.token],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:8000/api/users`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            setUsername(response.data.username);
            return response.data;
        },
        onError: (error) => {
            if (error.response.status === 401) {
                showSnackbar("Session expired. Please log in again.", "error");
                logout(() => navigate('/home'));
            } else {
                showSnackbar(`Error: ${error.response.data.detail}`, "error");
            }
        }

    });

    const updateMutation = useMutation({
        mutationFn: async (updatedUser) => {
            await axios.put(`http://127.0.0.1:8000/api/users/update/${user._id}`, updatedUser, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
        },
        onSuccess: () => {
            showSnackbar("Profile updated successfully", "success");
            logout(() => navigate('/login'));
        },
        onError: (error) => {
            if (error.response.status === 401) {
                showSnackbar("Invalid token. Please log in again.", "error");
                logout(() => navigate('/login'));
            } else if (error.response.status === 403) {
                showSnackbar("Unauthorized to update user", "error");
            } else if (error.response.status === 404) {
                showSnackbar("User not found", "error");
            } else {
                showSnackbar(`Error: ${error.response.data.detail}`, "error");
            }
        }
    })

    const isValidPassword = () => {
        const conditions = {
            length: password.length >= 8 && password.length <= 64,
            validChars: /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]*$/.test(password),
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
            match: password === confirmPassword,
        };

        const messages = {
            length: "Password must be between 8 and 64 characters long",
            validChars: "Password must only include letters, numbers, special characters, and spaces",
            lowercase: "Password must include at least one lowercase letter",
            uppercase: "Password must include at least one uppercase letter",
            number: "Password must include at least one number",
            specialChar: "Password must include at least one special character",
            match: "Passwords do not match",
        };

        for (const [key, isValid] of Object.entries(conditions)) {
            if (!isValid) {
                showSnackbar(messages[key], 'error');
                return false;
            }
        }

        return true;
    }

    const handleSave = async () => {
        if (password !== '') {
            if (!isValidPassword()) {
                return;
            }

            user.password = password;
        }


        const updatedUser = {...user, username, password: password || undefined};
        updateMutation.mutate(updatedUser);
    }


    if (!auth.isLoggedIn) {
        return <Typography variant="h6" textAlign="center">Please log in to update your profile.</Typography>;
    }

    if (isLoading) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
                <Typography variant="h4" gutterBottom>Loading...</Typography>
                <Skeleton variant="rectangular" animation={"wave"} width="90%" height={40} sx={{mb: 2}}/>
                <Skeleton variant="rectangular" animation={"wave"} width="90%" height={20} sx={{mb: 2}}/>
                <Skeleton variant="rectangular" animation={"wave"} width="90%" height={10} sx={{mb: 2}}/>
            </Box>
        )
    }

    if (isError) {
        return <Typography variant="h6" textAlign="center">Failed to load profile data.</Typography>;
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, justifyContent: 'center'}}>
            <Typography variant="h4" gutterBottom>Update Profile</Typography>
            <Typography variant="h6" gutterBottom>Current Username: {user.username}</Typography>
            <Grid container spacing={2} justifyContent="center" alignItems={"center"} direction={"column"}>
                <Grid item>
                    <TextField variant={"outlined"} label="New Username" value={username}
                               onChange={(e) => setUsername(e.target.value)}/>
                </Grid>
                <Grid item>
                    <TextField variant={"outlined"} label="New Password" value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                </Grid>
                <Grid item>
                    <TextField variant={"outlined"} label="Confirm New Password" value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}/>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleSave} size={"small"}>Save
                        Changes</Button>
                </Grid>
            </Grid>
            <Typography variant={"body1"} color={"error"} gutterBottom>Note that after saving changes, you will need to
                log back in.</Typography>
        </Box>
    );
}

export default UpdateProfile;