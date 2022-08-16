import React from 'react';
import {AppBar, Box, Button, Icon, Stack, Switch, Toolbar, Typography} from "@mui/material";
import {DarkMode, LightMode} from "@mui/icons-material";
import {Link} from "react-router-dom"

function NavBar(props) {
    const pages = [{name: "Home", endpoint: "/home"}, {name: "About Us", endpoint: "/about"}, {name: "Login", endpoint: "/login"}, {name: "Translate", endpoint: "/translate"}]

    return (
        <AppBar position={"static"}>
            <Toolbar>
                <Typography variant={"h6"} sx={{paddingRight: "10px"}}>
                    LinguaTile
                </Typography>
                <Box sx={{flexGrow: 1}}>
                    {pages.map((page) =>
                        <Button variant={"text"} key={page.name} color={"inherit"} size={"small"}>
                            <Link to={page.endpoint} style={{textDecoration: "none", color: "#F4ABC4"}} key={page.endpoint}>{page.name}</Link>
                        </Button>
                    )}
                </Box>
                <Stack direction={"row"}>
                    <Icon>
                        <LightMode />
                    </Icon>
                    <Switch onChange={props.onThemeSwitch} color={"default"}/>
                    <Icon>
                        <DarkMode />
                    </Icon>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;