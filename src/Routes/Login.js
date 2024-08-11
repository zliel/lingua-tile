import React from 'react';
import {Box, Grid, Typography, TextField, Button} from "@mui/material";


function Login() {

    return (
        <Box sx={{height: "50vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Grid container direction={"column"} spacing={2} alignItems={"center"}>
                <Grid item>
                    <Typography variant={"h4"}>Login</Typography>
                </Grid>
                <Grid item>
                    <TextField label={"Username"} variant={"outlined"} fullWidth />
                </Grid>
                <Grid item>
                    <TextField label={"Password"} type={"password"} variant={"outlined"} fullWidth />
                </Grid>
                <Grid item>
                    <Button variant={"contained"} color={"primary"}>Login</Button>
                </Grid>
            </Grid>
        </Box>
    );
}


export default Login;