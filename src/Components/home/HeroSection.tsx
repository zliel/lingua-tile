import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Logo from "../../assets/LinguaTile Logo.png";
import { useNavigate } from "react-router";
import { useAuth } from "@/Contexts/AuthContext";

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
        <Box
          component="img"
          src={Logo}
          alt="LinguaTile Logo"
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            bgcolor: "white",
            borderRadius: "10%",
            p: 1,
            boxShadow: 3,
            animation: "float 3s ease-in-out infinite",
            "@keyframes float": {
              "0%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-9px)" },
              "100%": { transform: "translateY(0px)" },
            },
          }}
        />
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
