import React from 'react';
import {Box, Typography} from "@mui/material";

function Home() {
    return (
        <Box sx={{height: "100%", width: "100%", margin: "auto"}}>
            <Typography variant={"h6"} sx={{textAlign: "center"}}>Hello! Welcome to LinguaTile, a learning platform focused on the Japanese language. </Typography>
        </Box>
    );
}

export default Home;