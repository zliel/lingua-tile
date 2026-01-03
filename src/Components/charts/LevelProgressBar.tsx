import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

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
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
        <Typography variant="body2" fontWeight="bold">
          Level {level}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {xp} / {xpNeeded} XP
        </Typography>
      </Box>
      <Box
        sx={{
          height: 10,
          width: "100%",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, type: "spring", bounce: 0 }}
          style={{
            height: "100%",
            backgroundColor: theme.palette.secondary.main,
            borderRadius: 5,
          }}
        />
      </Box>
    </Box>
  );
};

export default LevelProgressBar;
