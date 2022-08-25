import React from 'react';
import {Grid, List, ListItem, ListItemText, Typography} from "@mui/material";

function About() {
    return (
        <Grid container alignSelf={"center"} justify={"center"} gap={2} direction={"column"} width={"80%"}>
            <Grid item sm>
                <Typography variant={"h4"} color={"primary"}>
                    About LinguaTile
                </Typography>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={"primary"}>What is this?</Typography>
                <Typography variant={"h6"} color={"secondary"}>This is a language learning platform I'm developing, aimed at English learners learning Japanese</Typography>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={"primary"}>Why am I making this?</Typography>
                <Typography variant={"h6"} color={"secondary"}>I wanted to recreate and combine aspects of the various learning platforms I've used while learning Japanese.
                    I also really wanted to practice building full-stack applications, and I figured that since I love education and learning, I may as well practice by making something related to it.
                </Typography>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={"primary"}>What's the stack?</Typography>
                <Typography variant={"h6"} color={"secondary"}>Front End</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary={"ReactJS"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={"React-Router"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={"Material-UI"}/>
                    </ListItem>
                </List>

                <Typography variant={"h6"} color={"secondary"}>Back End</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary={"Spring Boot"} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={"Redis"} secondary={"To store translations for optimization"}/>
                    </ListItem>
                </List>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={"primary"}>Why the green and pink color scheme?</Typography>
                <Typography variant={"h6"} color={"secondary"}>I used a color palette generator and liked the two colors together.
                    It's only temporary, until I find another palette that I like more.
                </Typography>
            </Grid>

            <Grid item sm>
                <Typography variant={"h5"} color={"primary"}>What do I have planned for the future?</Typography>
                <Typography variant={"h6"} color={"secondary"}>I want to add a spaced repetition system, vocabulary
                    flashcards, and a guided sequence of Japanese grammar and vocabulary, mirroring what I've learned
                    and being updated as I learn more.
                </Typography>
            </Grid>
        </Grid>
    );
}

export default About;