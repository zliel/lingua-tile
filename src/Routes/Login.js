import React from 'react';
import {useNavigate} from "react-router-dom";
import {Box, Grid, Typography, TextField, Button} from "@mui/material";
import axios from "axios";
import {useAuth} from "../Contexts/AuthContext";
import {useSnackbar} from "../Contexts/SnackbarContext";


function Login() {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const {login} = useAuth();
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();

    const handleLogin = () => {
        if (username === "" || password === "") {
            showSnackbar("Please enter a username and password", "error");
            return
        }

        axios.post("http://127.0.0.1:8000/api/auth/login", {username: username, password: password})
            .then(response => {

                const token = response.data.token;
                showSnackbar("Login successful", "success");
                login(token, () => navigate('/home'));

            }).catch(error => {

            if (error.response.status === 401 || error.response.status === 404) {
                showSnackbar("Invalid username or password", "error");
            } else {
                showSnackbar(`Error: ${error.response.data.detail}`, "error");
            }

        })
    }
    return (
        <Box sx={{height: "50vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Grid container direction={"column"} spacing={2} alignItems={"center"}>
                <Grid item>
                    <Typography variant={"h4"}>Login</Typography>
                </Grid>
                <Grid item>
                    <TextField label={"Username"}
                               variant={"outlined"}
                               fullWidth
                               onChange={(e) => setUsername(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <TextField label={"Password"}
                               type={"password"}
                               variant={"outlined"}
                               color={"secondary"}
                               fullWidth
                               onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <Button variant={"contained"} color={"primary"} onClick={handleLogin}>Login</Button>
                </Grid>
            </Grid>
        </Box>
    );
}


export default Login;