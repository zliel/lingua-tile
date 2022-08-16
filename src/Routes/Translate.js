import React from 'react';
import {Box, Grid} from "@mui/material";
import TranslationForm from "../Components/TranslationForm"

function Translate() {
    return (
        <Box>
            <Grid container justifyContent={"center"}>
                <Grid item>
                    <TranslationForm />
                </Grid>
            </Grid>
        </Box>
    );
}


export default Translate;