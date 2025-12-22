import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "./NavBar";
import PWAInstallPrompt from "./PWAInstallPrompt";
import PWAPrompt from "react-ios-pwa-prompt";
import { motion, AnimatePresence } from "framer-motion";
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateAreas: '"content"',
          "& > *": {
            gridArea: "content",
          },
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: "100%" }}
          >
            <Box sx={{ width: "100%" }}>
              <Outlet />
            </Box>
          </motion.div>
        </AnimatePresence>{" "}
      </Box>
      <PWAInstallPrompt />
      <IOSPrompt />
    </Box>
  );
}
