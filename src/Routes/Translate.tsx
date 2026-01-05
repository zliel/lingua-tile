import { Box, useMediaQuery, useTheme } from "@mui/material";
import TranslationForm from "@/Components/TranslationForm";

function Translate() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        p: isMobile ? 2 : 4,
        mt: 4,
      }}
    >
      <Box
        sx={{
          p: 4,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.02)",
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          boxShadow: theme.shadows[4],
        }}
      >
        <TranslationForm />
      </Box>
    </Box>
  );
}

export default Translate;
