import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

interface StreakCounterProps {
  streak: number;
  loading?: boolean;
}

const StreakCounter = ({ streak, loading = false }: StreakCounterProps) => {
  const theme = useTheme();

  if (loading) return null;

  return (
    <Tooltip title={`Daily Streak: ${streak} days`}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 0.5,
          mx: 2,
          color:
            streak > 0
              ? theme.palette.secondary.main
              : theme.palette.text.disabled,
          cursor: "default",
        }}
      >
        <LocalFireDepartmentIcon
          sx={{
            fontSize: "1.8rem",
            mr: 0.5,
            animation: streak > 0 ? `${pulse} 1s ease-in-out 1` : "none",
            filter:
              streak > 0
                ? "drop-shadow(0 0 8px " + theme.palette.secondary.main + ")"
                : "none",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: streak > 0 ? "white" : theme.palette.text.disabled,
          }}
        >
          {streak}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default StreakCounter;
