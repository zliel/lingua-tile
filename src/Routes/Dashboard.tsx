import { useAuth } from "@/Contexts/AuthContext";
import { Box, Grid, Typography, useTheme, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { PastWeekReviewsChart } from "@/Components/charts/PastWeekReviewsChart";
import { ProjectedReviewsChart } from "@/Components/charts/ProjectedReviewsChart";
import { LessonProgressChart } from "@/Components/charts/LessonProgressChart";
import DashboardSkeleton from "@/Components/skeletons/DashboardSkeleton";
import { usePushSubscription } from "@/hooks/usePushSubscription";
import { NotificationPermissionModal } from "@/Components/NotificationPermissionModal";
import { useState } from "react";

const Dashboard = () => {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const theme = useTheme();

  const {
    isSubscribed,
    isLoading: isSubscriptionLoading,
    subscribe,
  } = usePushSubscription();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    if (
      authData?.isLoggedIn &&
      !isSubscriptionLoading &&
      !isSubscribed &&
      !("serviceWorker" in navigator && Notification.permission === "denied") &&
      !localStorage.getItem("notification_prompt_dismissed")
    ) {
      // Small delay to ensure UI is settled
      const timer = setTimeout(() => {
        setShowNotificationModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [authData, isSubscriptionLoading, isSubscribed]);

  const handleEnableNotifications = async () => {
    await subscribe();
    setShowNotificationModal(false);
  };

  const handleDismissNotifications = () => {
    localStorage.setItem("notification_prompt_dismissed", "true");
    setShowNotificationModal(false);
  };

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

  const {
    data: reviews,
    error: reviewsError,
    isLoading: isReviewsLoading,
  } = useQuery({
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

  const {
    data: reviewHistory,
    error: reviewHistoryError,
    isLoading: isReviewHistoryLoading,
  } = useQuery({
    queryKey: ["reviewHistory", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/reviews/history/all`,
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
    const error = userError || reviewsError || reviewHistoryError;
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
  }, [
    userError,
    reviewsError,
    reviewHistoryError,
    logout,
    navigate,
    showSnackbar,
  ]);

  if (!authData?.isLoggedIn) {
    // Should be handled by protected route, but safety check
    return null;
  }

  useEffect(() => {
    if (user) {
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (user.timezone !== browserTimezone) {
        // Update user timezone
        axios
          .put(
            `${import.meta.env.VITE_APP_API_BASE}/api/users/update/${user._id}`,
            { timezone: browserTimezone },
            { headers: { Authorization: `Bearer ${authData?.token}` } },
          )
          .catch((err) => console.error("Failed to sync timezone", err));
      }
    }
  }, [user, authData?.token]);

  const isLoading = isUserLoading || isReviewsLoading || isReviewHistoryLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", p: 2 }}>
      <Box>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
          >
            Welcome back, {user?.username || "Learner"}!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" color="text.secondary">
              Here's your progress overview.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/learn")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Go To Lessons
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Summary Cards could go here in the future */}

          {/* Charts Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                borderRadius: 4,
                height: "100%",
              }}
            >
              <PastWeekReviewsChart reviews={reviewHistory || []} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                borderRadius: 4,
                height: "100%",
              }}
            >
              <LessonProgressChart reviews={reviews} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                borderRadius: 4,
              }}
            >
              <ProjectedReviewsChart reviews={reviews} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <NotificationPermissionModal
        open={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onEnable={handleEnableNotifications}
        onDismiss={handleDismissNotifications}
        loading={isSubscriptionLoading}
      />
    </Box>
  );
};

export default Dashboard;
