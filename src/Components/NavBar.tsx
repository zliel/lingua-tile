import { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useColorScheme, useTheme } from "@mui/material/styles";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CloudOff from "@mui/icons-material/CloudOff";
import { useAuth } from "@/Contexts/AuthContext";
import { useOffline } from "@/Contexts/OfflineContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import StreakCounter from "./StreakCounter";

type Page = {
  name: string;
  endpoint?: string;
  action?: () => void;
};

const adminPages = [
  { name: "User Table", endpoint: "/admin-users" },
  { name: "Card Table", endpoint: "/admin-cards" },
  { name: "Lesson Table", endpoint: "/admin-lessons" },
  { name: "Section Table", endpoint: "/admin-sections" },
];

function NavBar() {
  const { logout, authIsLoading, authData } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mode, setMode } = useColorScheme();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { isOnline } = useOffline();

  const { data: user } = useQuery({
    queryKey: ["user", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/`,
        { headers: { Authorization: `Bearer ${authData?.token}` } },
      );
      return response.data;
    },
    enabled: !!authData?.isLoggedIn && !!authData?.token,
  });

  const handleMenuOpen = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const handleMenuClose = () => {
    setMenuIsOpen(false);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleLogout = useCallback(() => {
    logout(() => navigate("/"));
    handleProfileMenuClose();
  }, [logout, navigate]);

  const menuItems = useMemo(() => {
    const links: Page[] = [];

    // Base pages
    links.push(
      { name: "Home", endpoint: "/home" },
      { name: "About", endpoint: "/about" },
      { name: "Lessons", endpoint: "/learn" },
      { name: "Translate", endpoint: "/translate" },
    );

    // Admin pages
    if (authData?.isAdmin) {
      links.push(...adminPages);
    }

    // Mobile specific pages
    if (isMobile) {
      if (authData?.isLoggedIn) {
        links.push(
          { name: "Profile", endpoint: "/profile" },
          { name: "Settings", endpoint: "/settings" },
          { name: "Logout", action: handleLogout },
        );
      } else {
        links.push(
          { name: "Login", endpoint: "/login" },
          { name: "Sign Up", endpoint: "/signup" },
        );
      }
    }

    return links;
  }, [authData, isMobile, handleLogout]);

  return (
    <AppBar
      position={"sticky"}
      enableColorOnDark
      sx={{
        height: "56px",
        zIndex: theme.zIndex.drawer + 1,
        justifyContent: "center",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
        >
          {Boolean(menuIsOpen) ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Drawer
          anchor={isMobile ? "top" : "left"}
          open={menuIsOpen}
          onClose={handleMenuClose}
          variant="temporary"
          slotProps={{
            paper: {
              sx: {
                width: isMobile ? "100%" : "180px",
                top: isMobile ? "0" : "56px",
                pt: isMobile ? "56px" : "0",
                height: isMobile ? "fit-content" : "calc(100% - 56px)",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
                backdropFilter: isMobile ? "blur(5px)" : "none",
                color: theme.palette.primary.contrastText,
              },
            },
          }}
          ModalProps={{
            keepMounted: true,
            hideBackdrop: false,
          }}
        >
          <Box
            sx={{
              width: isMobile ? "150px" : "180px",
            }}
            role="presentation"
            onClick={handleMenuClose}
            onKeyDown={handleMenuClose}
          >
            {menuItems.map((page) =>
              page.endpoint ? (
                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.endpoint}
                  onClick={handleMenuClose}
                >
                  {page.name}
                </MenuItem>
              ) : (
                <MenuItem key={page.name} onClick={page.action}>
                  {page.name}
                </MenuItem>
              ),
            )}
          </Box>
        </Drawer>
        {/* </Menu> */}
        <Typography variant={"h6"} sx={{ paddingRight: "10px" }}>
          <Link
            to={authData?.isLoggedIn ? "/dashboard" : "/"}
            style={{
              textDecoration: "none",
              color: theme.palette.primary.contrastText,
            }}
          >
            LinguaTile
          </Link>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {!isOnline && (
            <Tooltip title="You are offline">
              <Icon sx={{ color: theme.palette.error.main }} title="Offline">
                <CloudOff />
              </Icon>
            </Tooltip>
          )}
          {authData?.isLoggedIn && user && (
            <StreakCounter streak={user.current_streak || 0} />
          )}
          <Icon>
            <LightMode />
          </Icon>
          <Switch
            onChange={() => setMode(mode === "light" ? "dark" : "light")}
            color={"default"}
            checked={mode === "dark"}
          />
          <Icon sx={{ mr: 1.5 }}>
            <DarkMode />
          </Icon>
          {!isMobile &&
            (authIsLoading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : authData?.isLoggedIn ? (
              <>
                <IconButton onClick={handleProfileMenuOpen} sx={{ mt: 0.5 }}>
                  <Avatar
                    sx={{
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.primary.contrastText,
                    }}
                  >
                    {authData.username
                      ? authData.username[0].toUpperCase()
                      : "?"}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuItem
                    onClick={handleProfileMenuClose}
                    component={Link}
                    to="/profile"
                  >
                    My Profile
                  </MenuItem>
                  <MenuItem
                    onClick={handleProfileMenuClose}
                    component={Link}
                    to="/settings"
                  >
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <div style={{ display: authIsLoading ? "none" : "flex" }}>
                <Button component={Link} to="/login" color={"inherit"}>
                  Login
                </Button>
                <Button component={Link} to="/signup" color={"inherit"}>
                  Sign Up
                </Button>
              </div>
            ))}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
