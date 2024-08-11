import React from 'react';
import {Box, Grid, Typography, TextField, Button} from "@mui/material";


function Login() {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

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
                    <Button variant={"contained"} color={"primary"}>Login</Button>
                </Grid>
            </Grid>
        </Box>
    );
}


export default Login;