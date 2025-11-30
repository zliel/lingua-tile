import { useAuth } from "@/Contexts/AuthContext";
import { Box, Fade, Grid, Skeleton, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { PastWeekReviewsChart } from "@/Components/charts/PastWeekReviewsChart";
import { ProjectedReviewsChart } from "@/Components/charts/ProjectedReviewsChart";
import { LessonProgressChart } from "@/Components/charts/LessonProgressChart";

const Dashboard = () => {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [showLoaded, setShowLoaded] = useState(false);
  const theme = useTheme();

  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["user", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
      return response.data;
    },
    enabled: !!authData && !!authData.isLoggedIn,
  });

  const { data: reviews, isLoading: isFetchingReviews, error: reviewsError } = useQuery({
    queryKey: ["reviews", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/reviews`,
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        },
      );
      return response.data;
    },
    enabled: !!authData && !!authData.isLoggedIn,
  });

  // Handle query errors
  useEffect(() => {
    const error = userError || reviewsError;
    if (!error) return;
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        showSnackbar("Session expired. Please log in again.", "error");
        logout(() => navigate("/home"));
      } else {
        showSnackbar(
          `Error: ${error.response.data?.detail || error.message}`,
          "error",
        );
      }
    } else {
      showSnackbar(`Error: ${error?.message || "Unknown error"}`, "error");
    }
  }, [userError, reviewsError, logout, navigate, showSnackbar]);

  // Manage the animation in-between loading and loaded
  useEffect(() => {
    if (isUserLoading || isFetchingReviews) {
      setShowLoaded(false);
    } else {
      const timer = setTimeout(() => setShowLoaded(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isUserLoading, isFetchingReviews]);

  if (!authData?.isLoggedIn) {
    // Should be handled by protected route, but safety check
    return null;
  }

  const isLoading = isUserLoading || isFetchingReviews;

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", p: 2 }}>
      <Fade in={isLoading} timeout={100}>
        <Box
          sx={{
            display: isLoading ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Loading Dashboard...
          </Typography>
          <Skeleton variant="rectangular" width="80%" height={200} sx={{ mb: 2, borderRadius: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Box>
      </Fade>

      <Fade in={showLoaded} timeout={500} unmountOnExit>
        <Box>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
              Welcome back, {user?.username || "Learner"}!
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Here's your progress overview.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Summary Cards could go here in the future */}

            {/* Charts Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 4,
                height: '100%'
              }}>
                <PastWeekReviewsChart reviews={reviews} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 4,
                height: '100%'
              }}>
                <LessonProgressChart reviews={reviews} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 4,
              }}>
                <ProjectedReviewsChart reviews={reviews} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Box>
  );
};

export default Dashboard;
