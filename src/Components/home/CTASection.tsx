import { useAuth } from "@/Contexts/AuthContext";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router";

export const CTASection = () => {
  const theme = useTheme();
  const { authData } = useAuth();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (authData?.isLoggedIn) {
      navigate("/lessons");
    } else {
      navigate("/signup");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        py: 8,
        textAlign: "center",
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to start your journey?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          component="p"
          sx={{ mb: 4 }}
        >
          Join thousands of learners and begin your path to Japanese fluency
          today.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStartLearning}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1.1rem",
          }}
        >
          {authData?.isLoggedIn ? "View Lessons" : "Create Free Account"}
        </Button>
      </Container>
    </Box>
  );
};
