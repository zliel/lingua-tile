import React from 'react';
import {Grid, List, ListItem, ListItemText, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";

function About() {
    const theme = useTheme();
    const primaryHeaderColor = theme.palette.mode === "light" ? theme.palette.primary.main : theme.palette.primary.dark
    const secondaryHeaderColor = theme.palette.mode === "light" ? theme.palette.secondary.main : theme.palette.secondary.dark
    return (
        <Grid container alignSelf={"center"} justify={"center"} align={"center"} gap={2} direction={"column"}
              width={"80%"}>
            <Grid item sm>
                <Typography variant={"h4"} color={primaryHeaderColor}>
                    About LinguaTile
                </Typography>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={secondaryHeaderColor}>What is this?</Typography>
                <Typography variant={"h6"}>This is a language learning platform I'm developing,
                    aimed at English learners learning Japanese</Typography>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={primaryHeaderColor}>Why am I making this?</Typography>
                <Typography variant={"h6"}>I wanted to recreate and combine aspects of the various
                    learning platforms I've used while learning Japanese.
                    I also really wanted to practice building full-stack applications, and I figured that since I love
                    education and learning, I may as well practice by making something related to it.
                </Typography>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={secondaryHeaderColor}>What's the stack?</Typography>
                <Typography variant={"h6"} color={primaryHeaderColor}>Front End</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary={"ReactJS"} sx={{textAlign: "center"}}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={"React-Router"} sx={{textAlign: "center"}}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={"Material-UI"} sx={{textAlign: "center"}}/>
                    </ListItem>
                </List>

                <Typography variant={"h6"} color={primaryHeaderColor}>Back End</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary={"FastAPI"} sx={{textAlign: "center"}}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={"Redis"} secondary={"To store translations for optimization"}
                                      sx={{textAlign: "center"}}/>
                    </ListItem>
                </List>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={primaryHeaderColor}>Why the green and purple color scheme?</Typography>
                <Typography variant={"h6"}>My two favorite colors are green and purple, and I
                    thought they looked nice together. I also wanted to practice using Material-UI's theming system.
                </Typography>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={secondaryHeaderColor}>What do I have planned for the future?</Typography>
                <Typography variant={"h6"}>I want to add a spaced repetition system, vocabulary
                    flashcards, and a guided sequence of Japanese grammar and vocabulary, mirroring what I've learned
                    and being updated as I learn more.
                </Typography>
            </Grid>
        </Grid>
    );
}

export default About;