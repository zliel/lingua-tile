import React from 'react';
import {Box, Grid, Typography, TextField, Button} from "@mui/material";
import axios from "axios";
import CryptoJS from "crypto-js";


function Login() {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const handleLogin = () => {
        const encryptedPassword = CryptoJS.AES.encrypt(password, "linguaTileAes-secret_key").toString()
        axios.post("http://127.0.0.1:8000/api/auth/login", {username : username, password : encryptedPassword})
            .then(response => {
                console.log(` Response: ${response.data}`)
            }).catch(error => {
                console.error(error)
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