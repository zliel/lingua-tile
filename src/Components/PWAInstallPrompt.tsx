import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { usePWAInstall } from "../hooks/usePWAInstall";

const PWAInstallPrompt = () => {
  const { isInstallable, promptInstall, dismissPrompt } = usePWAInstall();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!isInstallable) return null;

  return (
    <Fade in={isInstallable} timeout={500}>
      <Box
        sx={{
          position: "fixed",
          bottom: isMobile ? 16 : 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1300, // Above most things (Snackbar is 1400)
          width: "90%",
          maxWidth: 500,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 3,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(30, 30, 30, 0.9)"
                : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                p: 1,
                borderRadius: 2,
                display: "flex",
              }}
            >
              <Download />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Install LinguaTile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get the best experience with offline access.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={dismissPrompt}
              color="inherit"
              size="small"
              sx={{ minWidth: "auto" }}
            >
              Later
            </Button>
            <Button
              onClick={promptInstall}
              variant="contained"
              size="small"
              disableElevation
              sx={{ borderRadius: 2 }}
            >
              Install
            </Button>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default PWAInstallPrompt;
