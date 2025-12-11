import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "./NavBar";
import PWAInstallPrompt from "./PWAInstallPrompt";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default function Layout() {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.pathname}
            classNames="fade"
            timeout={300}
          >
            <Box sx={{ width: "100%" }}>
              <Outlet />
            </Box>
          </CSSTransition>
        </TransitionGroup>
      </Box>
      <PWAInstallPrompt />
    </Box>
  );
}
