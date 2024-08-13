import React from 'react';
import {Alert, Box, Grid, Typography, TextField, Button, Snackbar} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";


function Signup() {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const [message, setMessage] = React.useState("")


    const isValidPassword = () => {
        const conditions = {
            length: password.length >= 8 && password.length <= 64,
            validChars: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(password),
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            match: password === confirmPassword
        };

        const messages = {
            length: "Password must be between 8 and 64 characters long",
            validChars: "Password must only include letters, numbers, special characters, and spaces",
            lowercase: "Password must include at least one lowercase letter",
            uppercase: "Password must include at least one uppercase letter",
            number: "Password must include at least one number",
            specialChar: "Password must include at least one special character",
            match: "Passwords do not match"
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

    const handleLogin = () => {
        if (!isValidPassword()) {
            return
        }
        axios.post("http://127.0.0.1:8000/api/users/signup", {username: username, password: password})
            .then(response => {
                console.log(` Response: ${response.data}`)
            }).catch(error => {
            console.error(error)
        })
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

    return (
        <Box sx={{height: "50vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Grid container direction={"column"} spacing={2} alignItems={"center"}>
                <Grid item>
                    <Typography variant={"h4"}>Sign Up</Typography>
                </Grid>
                <Grid item>
                    <TextField label={"Username"}
                               variant={"outlined"}
                               fullWidth
                               onChange={(e) => setUsername(e.target.value)}
                               required
                    />
                </Grid>
                <Grid item>
                    <TextField label={"Password"}
                               type={"password"}
                               variant={"outlined"}
                               color={"secondary"}
                               fullWidth
                               onChange={(e) => setPassword(e.target.value)}
                               required
                    />
                </Grid>
                <Grid item>
                    <TextField label={"Confirm Password"}
                               type={"password"}
                               variant={"outlined"}
                               color={"secondary"}
                               fullWidth
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               required
                    />
                </Grid>
                <Grid item>
                    <Button variant={"contained"} color={"primary"} onClick={handleLogin}>Login</Button>
                </Grid>
            </Grid>
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


export default Signup;