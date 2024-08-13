import React, {useContext, useState, useEffect} from 'react';
import {Box, Typography, Button, Grid, TextField, Alert, Snackbar} from '@mui/material';
import AuthContext from '../AuthContext';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function UpdateProfile() {
    const {auth, logout} = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const [message, setMessage] = React.useState("")


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

    const isValidPassword = () => {
        const conditions = {
            length: password.length >= 8 && password.length <= 64,
            match: password === confirmPassword,
            validChars: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(password),
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };

        const messages = {
            length: "Password must be between 8 and 64 characters long",
            match: "Passwords do not match",
            validChars: "Password must only include letters, numbers, special characters, and spaces",
            lowercase: "Password must include at least one lowercase letter",
            uppercase: "Password must include at least one uppercase letter",
            number: "Password must include at least one number",
            specialChar: "Password must include at least one special character"
        };

        for (const [key, isValid] of Object.entries(conditions)) {
            if (!isValid) {
                setOpen(true);
                setMessage(messages[key]);
                return false;
            }
        }

        return true;
    }

    const handleSave = async () => {
        try {
            if (password !== '') {
                if (!isValidPassword()) {
                    return;
                }

                user.password = password;
            }

            if (user.username === '') {
                user.username = username;
            }

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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>
        </>
    );


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
                    <TextField variant={"outlined"} label="New Password" value={password || ''} onChange={(e) => setPassword(e.target.value)}/>
                </Grid>
                <Grid item>
                    <TextField variant={"outlined"} label="Confirm New Password" value={confirmPassword || ''} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleSave} size={"small"}>Save Changes</Button>
                </Grid>
            </Grid>
            <Typography variant={"body1"} color={"error"} gutterBottom>Note that after saving changes, you will need to log back in.</Typography>
            <Snackbar
                open={open}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                autoHideDuration={3000}
                message={message}
                action={action}>
                <Alert onClose={handleClose} severity="error" variant={"filled"} sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default UpdateProfile;