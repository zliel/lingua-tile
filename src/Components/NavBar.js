import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Icon,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Switch,
    Toolbar,
    Typography
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {DarkMode, LightMode, Menu as MenuIcon} from "@mui/icons-material";
import {useAuth} from "../Contexts/AuthContext";

function NavBar(props) {
    const {auth, logout} = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const pages = [
        {name: "Home", endpoint: "/home"},
        {name: "About", endpoint: "/about"},
        {name: "Translate", endpoint: "/translate"}
    ];

    const adminPages = [
        {name: "User Table", endpoint: "/admin-users"},
        {name: "Card Table", endpoint: "/admin-cards"},
        {name: "Lesson Table", endpoint: "/admin-lessons"},
        {name: "Section Table", endpoint: "/admin-sections"}
    ];

    if (auth.isAdmin) {
        pages.push(...adminPages);
    }


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
                    <MenuIcon/>
                </IconButton>
                <Menu anchorEl={anchorElMenu} open={Boolean(anchorElMenu)} onClose={handleMenuClose}>
                    {pages.map((page) => (
                        <MenuItem key={page.name} component={Link} to={page.endpoint}
                                  onClick={page.action ? page.action : handleMenuClose}>
                            {page.name}
                        </MenuItem>
                    ))}
                </Menu>
                <Typography variant={"h6"} sx={{paddingRight: "10px"}}>
                    <Link to={"/home"}
                          style={{textDecoration: "none", color: theme.palette.primary.contrastText}}>LinguaTile</Link>
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                <Stack direction={"row"} alignItems={"center"}>
                    <Icon>
                        <LightMode/>
                    </Icon>
                    <Switch onChange={props.onThemeSwitch} color={"default"}
                            checked={localStorage.getItem("theme") === "dark"}
                            sx={{mt: 0.7}}
                    />
                    <Icon sx={{mr: 1.5}}>
                        <DarkMode/>
                    </Icon>
                    {auth.isLoggedIn ? (
                        <>
                            <IconButton onClick={handleProfileMenuOpen} sx={{mt: 0.5}}>
                                <Avatar sx={{
                                    backgroundColor: theme.palette.secondary.dark,
                                    color: theme.palette.primary.contrastText
                                }}>{auth.username ? auth.username[0].toUpperCase() : "?"}</Avatar>
                            </IconButton>
                            <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleProfileMenuClose}>
                                <MenuItem onClick={handleProfileMenuClose} component={Link} to="/profile">My
                                    Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button component={Link} to="/login" color={"inherit"}>Login</Button>
                            <Button component={Link} to="/signup" color={"inherit"}>Sign Up</Button>
                        </>
                    )

                    }

                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;