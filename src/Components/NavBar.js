import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AppBar, Box, Button, Icon, Stack, Switch, Toolbar, Typography} from "@mui/material";
import {
    Box, Button,
    Icon,
    IconButton,
    Menu, MenuItem,
import {useTheme} from "@mui/material/styles";
import {DarkMode, LightMode, Menu as MenuIcon} from "@mui/icons-material";
import {Link} from "react-router-dom"
import {useAuth} from "../Contexts/AuthContext";

function NavBar(props) {
    const {auth, logout} = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const pages = [{name: "Home", endpoint: "/home"}, {name: "About", endpoint: "/about"},
        {name: "Translate", endpoint: "/translate"}
    ];


    const handleMenuOpen = (event) => {
        setAnchorElMenu(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorElMenu(null);
    }


    const handleProfileMenuOpen = (event) => {
        setAnchorElUser(event.currentTarget);
    }

    const handleProfileMenuClose = () => {
        setAnchorElUser(null);
    }

    const handleLogout = () => {
        logout(() => navigate("/"));
        handleProfileMenuClose()
    }

    return (
        <AppBar position={"sticky"} enableColorOnDark>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                    <MenuIcon />
                </IconButton>
                <Menu anchorEl={anchorElMenu} open={Boolean(anchorElMenu)} onClose={handleMenuClose}>
                    {pages.map((page) => (
                        <MenuItem key={page.name} component={Link} to={page.endpoint} onClick={page.action ? page.action : handleMenuClose}>
                            {page.name}
                        </MenuItem>
                    ))}
                </Menu>
                <Typography variant={"h6"} sx={{paddingRight: "10px"}}>
                    <Link to={"/home"}
                          style={{textDecoration: "none", color: theme.palette.primary.contrastText}}>LinguaTile</Link>
                </Typography>
                <Box sx={{flexGrow: 1}}/>
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