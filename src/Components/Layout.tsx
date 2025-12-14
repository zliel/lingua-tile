import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "./NavBar";
import PWAInstallPrompt from "./PWAInstallPrompt";
import PWAPrompt from "react-ios-pwa-prompt";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useAppBadge } from "@/hooks/useAppBadge";

const IOSPrompt: React.FC = () => (
  <PWAPrompt
    appIconPath="/apple-touch-icon.png"
    copyTitle="Install LinguaTile"
    copySubtitle="LinguaTile"
    copyDescription="Add this app to your home screen for the best experience."
  />
);

export default function Layout() {
  const location = useLocation();

  useAppBadge();

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
      <IOSPrompt />
    </Box>
  );
}
