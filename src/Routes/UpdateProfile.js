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
        if (password.length < 8) {
            setOpen(true)
            setMessage("Password must be at least 8 characters long")
            return false
        } else if (password.length > 64) {
            setOpen(true)
            setMessage("Password must be less than or equal to 64 characters long")
            return false
        } else if (password !== confirmPassword) {
            setOpen(true)
            setMessage("Passwords do not match")
            return false
        } else if (!password.match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
            setOpen(true)
            setMessage("Password must only include letters, numbers, special characters, and spaces")
            return false
        } else if (!password.match(/[a-z]/)) {
            setOpen(true)
            setMessage("Password must include at least one lowercase letter")
            return false
        } else if (!password.match(/[A-Z]/)) {
            setOpen(true)
            setMessage("Password must include at least one uppercase letter")
            return false
        } else if (!password.match(/[0-9]/)) {
            setOpen(true)
            setMessage("Password must include at least one number")
            return false
        } else if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
            setOpen(true)
            setMessage("Password must include at least one special character")
            return false
        }

        return true
    }

    const handleSave = async () => {
        try {
            if (password !== '') {
                if (!isValidPassword()) {
                    return;
                }

                user.password = password;
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