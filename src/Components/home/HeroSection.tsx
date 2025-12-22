import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "@/Contexts/AuthContext";
import AnimatedLogo from "./AnimatedLogo";

export const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { authData } = useAuth();

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
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        py: 8,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        {/*<Container maxWidth="md" sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>*/}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <AnimatedLogo size={isMobile ? 100 : 120} />
        </Box>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: isMobile ? "2.5rem" : "3.5rem",
          }}
        >
          Master Japanese with LinguaTile
        </Typography>
        <Typography
          variant="h5"
          component="p"
          gutterBottom
          sx={{ mb: 4, opacity: 0.9 }}
        >
          A comprehensive learning platform designed to help you read, write,
          and speak Japanese fluently.
        </Typography>
        <Container
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "80%",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleStartLearning}
            sx={{
              fontSize: "1.2rem",
              px: 4,
              width: isMobile ? "100%" : "60%",
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Start Learning Now
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              fontSize: "1.2rem",
              px: 4,
              width: isMobile ? "100%" : "60%",
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Log In
          </Button>
        </Container>
      </Container>
    </Box>
  );
};
