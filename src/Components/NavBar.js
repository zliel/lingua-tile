import React from 'react';
import {useNavigate} from "react-router-dom";
import {AppBar, Box, Button, Icon, Stack, Switch, Toolbar, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {DarkMode, LightMode} from "@mui/icons-material";
import {Link} from "react-router-dom"
import AuthContext from '../AuthContext';

function NavBar(props) {
    const {auth, logout} = React.useContext(AuthContext);
    const pages = [{name: "Home", endpoint: "/home"}, {name: "About", endpoint: "/about"},
        {name: "Translate", endpoint: "/translate"}
    ];
    const navigate = useNavigate();

    if (auth.isLoggedIn) {
        pages.push({name: "Profile", endpoint: "/profile"});
        pages.push({name: "Logout", endpoint: "/logout", action: () => logout(() => navigate("/"))});
    } else {
        pages.push({name: "Login", endpoint: "/login"});
        pages.push({name: "Signup", endpoint: "/signup"});
    }
    const theme = useTheme();
    return (
        <AppBar position={"static"} enableColorOnDark>
            <Toolbar>
                <Typography variant={"h6"} sx={{paddingRight: "10px"}}>
                    <Link to={"/home"}
                          style={{textDecoration: "none", color: theme.palette.primary.contrastText}}>LinguaTile</Link>
                </Typography>
                <Box sx={{flexGrow: 1}}>
                    {pages.map((page) =>
                        <Button variant={"text"} key={page.name} color={"inherit"} size={"small"}
                                onClick={page.action ? page.action : null}>
                            <Link to={page.endpoint}
                                  style={{textDecoration: "none", color: theme.palette.primary.contrastText}}
                                  key={page.endpoint}>{page.name}</Link>
                        </Button>
                    )}
                </Box>
                <Stack direction={"row"}>
                    <Icon>
                        <LightMode/>
                    </Icon>
                    <Switch onChange={props.onThemeSwitch} color={"default"}
                            checked={localStorage.getItem("theme") === "dark"}/>
                    <Icon>
                        <DarkMode/>
                    </Icon>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;