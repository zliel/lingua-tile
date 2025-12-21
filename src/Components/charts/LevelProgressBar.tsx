import { Box, LinearProgress, Typography, useTheme } from "@mui/material";

interface LevelProgressBarProps {
  level: number;
  xp: number;
}

const LevelProgressBar = ({ level, xp }: LevelProgressBarProps) => {
  const theme = useTheme();
  const xpNeeded = Math.floor(100 * Math.pow(level, 1.5));
  const progress = Math.min((xp / xpNeeded) * 100, 100);

  return (
    <Box sx={{ width: "100%", maxWidth: 400, mt: 2, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" fontWeight="bold">
          Level {level}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {xp} / {xpNeeded} XP
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            backgroundColor: theme.palette.secondary.main,
          },
        }}
      />
    </Box>
  );
};

export default LevelProgressBar;
