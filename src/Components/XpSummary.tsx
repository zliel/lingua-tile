import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LevelProgressBar from "./charts/LevelProgressBar";

interface SummaryData {
  xp_gained: number;
  new_xp: number;
  new_level: number;
  leveled_up: boolean;
}

export const XpSummary = ({
  summaryData,
  handleContinue,
}: {
  summaryData: SummaryData;
  handleContinue: () => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90vw" : 500,
        maxWidth: "95vw",
        bgcolor: theme.palette.background.paper,
        borderRadius: 4,
        p: 4,
        textAlign: "center",
        outline: "none",
        boxShadow: 24,
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        {summaryData.leveled_up ? "Level Up!" : "Lesson Complete!"}
      </Typography>

      <Typography variant="h2" sx={{ my: 4, fontWeight: "bold" }}>
        +{summaryData.xp_gained} XP
      </Typography>

      {summaryData.leveled_up && (
        <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
          You reached Level {summaryData.new_level}!
        </Typography>
      )}

      <Box sx={{ mt: 2, mb: 3 }}>
        <LevelProgressBar
          level={summaryData.new_level}
          xp={summaryData.new_xp}
        />
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleContinue}
        sx={{ mt: 1 }}
      >
        Continue
      </Button>
    </Box>
  );
};
