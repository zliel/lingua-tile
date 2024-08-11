import React from 'react';
import {AppBar, Box, Button, Icon, Stack, Switch, Toolbar, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {DarkMode, LightMode} from "@mui/icons-material";
import {Link} from "react-router-dom"

function NavBar(props) {
    const pages = [{name: "Home", endpoint: "/home"}, {name: "About Us", endpoint: "/about"}, {name: "Login", endpoint: "/login"}, {name: "Translate", endpoint: "/translate"}]
    const theme = useTheme();
    return (
        <AppBar position={"static"}>
            <Toolbar>
                <Typography variant={"h6"} sx={{paddingRight: "10px"}}>
                    <Link to={"/home"} style={{textDecoration: "none", color: theme.palette.primary.contrastText}}>LinguaTile</Link>
                </Typography>
                <Box sx={{flexGrow: 1}}>
                    {pages.map((page) =>
                        <Button variant={"text"} key={page.name} color={"inherit"} size={"small"}>
                            <Link to={page.endpoint} style={{textDecoration: "none", color: theme.palette.primary.contrastText}} key={page.endpoint}>{page.name}</Link>
                        </Button>
                    )}
                </Box>
                <Stack direction={"row"}>
                    <Icon>
                        <LightMode/>
                    </Icon>
                    <Switch onChange={props.onThemeSwitch} color={"default"} checked={localStorage.getItem("theme") === "dark"} />
                    <Icon>
                        <DarkMode />
                    </Icon>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;