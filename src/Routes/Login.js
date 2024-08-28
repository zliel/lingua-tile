import React from 'react';
import {useNavigate} from "react-router-dom";
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import axios from "axios";
import {useMutation} from "@tanstack/react-query";
import {useAuth} from "../Contexts/AuthContext";
import {useSnackbar} from "../Contexts/SnackbarContext";


function Login() {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const {login} = useAuth();
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();

    const loginMutation = useMutation({
        mutationFn: (credentials) => axios.post("http://127.0.0.1:8000/api/auth/login", credentials),
        onSuccess: (response) => {
            showSnackbar("Login successful", "success");
            login(response.data, () => navigate("/"));
        },
        onError: (error) => {
            if (error.response.status === 401) {
                showSnackbar("Invalid credentials", "error");
            } else {
                showSnackbar(`Error: ${error.response.data.detail}`, "error");
            }
        }
    });

    const handleLogin = () => {
        if (username === "" || password === "") {
            showSnackbar("Please enter a username and password", "error");
            return
        }

        loginMutation.mutate({username: username, password: password});


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