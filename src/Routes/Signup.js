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

    const handleLogin = () => {
        if (password !== confirmPassword) {
            setOpen(true)
            setMessage("Passwords do not match")
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