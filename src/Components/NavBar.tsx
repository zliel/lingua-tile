import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  SwipeableDrawer,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useColorScheme, useTheme } from "@mui/material/styles";
import {
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAuth } from "../Contexts/AuthContext";

type Page = {
  name: string;
  endpoint?: string;
  action?: () => void;
};

const basePages = [
  { name: "Home", endpoint: "/home" },
  { name: "About", endpoint: "/about" },
  { name: "Lessons", endpoint: "/lessons" },
  { name: "Translate", endpoint: "/translate" },
];

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
  const [pages, setPages] = useState<Page[]>(basePages);

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

  useEffect(() => {
    if (authData && authData.isAdmin) {
      if (!pages.find((page) => page.name === "User Table")) {
        let mobileExtraPages: Page[] = isMobile
          ? [
              { name: "Profile", endpoint: "/profile" },
              { name: "Logout", action: handleLogout },
            ]
          : [];

        setPages((prevPages) => {
          // Filter out the login/signup pages if they exist
          const filteredPrevPages = prevPages.filter(
            (page) => page.name !== "Login" && page.name !== "Sign Up",
          );

          return [...filteredPrevPages, ...adminPages, ...mobileExtraPages];
        });
      }
    } else {
      let pagesToAdd: Page[] = [
        { name: "Home", endpoint: "/home" },
        { name: "About", endpoint: "/about" },
        { name: "Lessons", endpoint: "/lessons" },
        { name: "Translate", endpoint: "/translate" },
      ];

      if (isMobile) {
        if (authData && authData.isLoggedIn) {
          pagesToAdd.push(
            { name: "Profile", endpoint: "/profile" },
            { name: "Logout", action: handleLogout },
          );
        } else {
          pagesToAdd.push(
            { name: "Login", endpoint: "/login" },
            { name: "Sign Up", endpoint: "/signup" },
          );
        }
      }

      setPages(pagesToAdd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData, handleLogout, isMobile]);

  return (
    <AppBar
      position={"sticky"}
      enableColorOnDark
      sx={{
        height: "64px",
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
        <SwipeableDrawer
          anchor="left"
          open={menuIsOpen}
          onClose={handleMenuClose}
          onOpen={handleMenuOpen}
          variant="temporary"
          slotProps={{
            paper: {
              sx: {
                width: isMobile ? "150px" : "180px",
                top: "64px",
                height: "calc(100% - 64px)",
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
            {pages.map((page) =>
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
        </SwipeableDrawer>
        {/* </Menu> */}
        <Typography variant={"h6"} sx={{ paddingRight: "10px" }}>
          <Link
            to={"/"}
            style={{
              textDecoration: "none",
              color: theme.palette.primary.contrastText,
            }}
          >
            LinguaTile
          </Link>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction={"row"} alignItems={"center"}>
          <Icon>
            <LightMode />
          </Icon>
          <Switch
            onChange={() => setMode(mode === "light" ? "dark" : "light")}
            color={"default"}
            checked={mode === "dark"}
            sx={{ mt: 0.7 }}
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
                      backgroundColor: theme.palette.secondary.dark,
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
