import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Logo from "../assets/LinguaTile Logo.png";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { School, TrendingUp, Translate } from "@mui/icons-material";

function Home() {
  const { authData } = useAuth();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    if (authData?.token) {
      queryClient.prefetchQuery({
        queryKey: ["lessons", authData.token],
        queryFn: async () => {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE}/api/lessons/all`,
            {
              headers: { Authorization: `Bearer ${authData.token}` },
            },
          );
          return response.data;
        },
        staleTime: 5 * 60 * 1000,
      });

      queryClient.prefetchQuery({
        queryKey: ["sections", authData.token],
        queryFn: async () => {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE}/api/sections/all`,
            {
              headers: { Authorization: `Bearer ${authData.token}` },
            },
          );
          return response.data;
        },
        staleTime: 5 * 60 * 1000,
      });

      queryClient.prefetchQuery({
        queryKey: ["reviews", authData.token],
        queryFn: async () => {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE}/api/lessons/reviews/`,
            {
              headers: { Authorization: `Bearer ${authData.token}` },
            },
          );
          return response.data;
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [authData, queryClient]);

  const handleStartLearning = () => {
    if (authData?.isLoggedIn) {
      navigate("/lessons");
    } else {
      navigate("/signup");
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Hero Section */}
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
              animation: "float 3s ease-in-out infinite",
              "@keyframes float": {
                "0%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-10px)" },
                "100%": { transform: "translateY(0px)" },
              },
            }}
          />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: isMobile ? "2.5rem" : "3.5rem" }}
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
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleStartLearning}
            sx={{
              fontSize: "1.2rem",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {authData?.isLoggedIn ? "Continue Learning" : "Start Learning Now"}
          </Button>
        </Container>
      </Box>

      {/* Info Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: "bold", color: theme.palette.text.primary }}
        >
          Why Choose LinguaTile?
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              icon: <School fontSize="large" color="primary" />,
              title: "Structured Lessons",
              description:
                "Follow a carefully curated curriculum that takes you from beginner to advanced levels step by step.",
            },
            {
              icon: <TrendingUp fontSize="large" color="primary" />,
              title: "Track Progress",
              description:
                "Monitor your learning journey with detailed statistics and visual progress indicators.",
            },
            {
              icon: <Translate fontSize="large" color="primary" />,
              title: "Interactive Practice",
              description:
                "Reinforce your knowledge with interactive exercises, flashcards, and real-world examples.",
            },
          ].map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 2,
                  boxShadow: 3,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
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
          <Typography variant="body1" color="text.secondary" component="p" sx={{ mb: 4 }}>
            Join your fellow learners and begin your path to Japanese fluency
            today.
          </Typography>
          <Button
            variant="outlined"
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
            {authData?.isLoggedIn ? "Go to Dashboard" : "Create Free Account"}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
