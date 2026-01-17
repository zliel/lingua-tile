import { useState, useEffect, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import School from "@mui/icons-material/School";
import TrendingUp from "@mui/icons-material/TrendingUp";
import RestartAlt from "@mui/icons-material/RestartAlt";
import ConfirmationDialog from "@/Components/ConfirmationDialog";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { useAuth } from "@/Contexts/AuthContext";
import { PastWeekReviewsChart } from "@/Components/charts/PastWeekReviewsChart";
// import { ProjectedReviewsChart } from "@/Components/charts/ProjectedReviewsChart";
import { LessonDifficultyChart } from "@/Components/charts/LessonDifficultyChart";
import { ProfileSkeleton } from "@/Components/skeletons/ProfileSkeleton";
import { ProfileHeader } from "@/Components/profile/ProfileHeader";
import { ActivityHeatmap } from "@/Components/charts/ActivityHeatmap";
import { useReviewHistory, useReviews } from "@/hooks/useLessons";
import { motion } from "framer-motion";
import { api } from "@/utils/apiClient";
import { User } from "@/types/users";

function Profile() {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [showLoaded, setShowLoaded] = useState(false);
  const queryClient = useQueryClient();
  const theme = useTheme();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User>({
    queryKey: ["user", authData?.token],
    queryFn: async (): Promise<User> => {
      const response = await api.get<User>("/api/users/");
      return response.data;
    },
    enabled: !!authData && !!authData.isLoggedIn,
  });

  const { data: reviews, isLoading: isFetchingReviews } = useReviews(authData);

  const { data: reviewHistory, isLoading: isFetchingReviewHistory } =
    useReviewHistory(authData);

  const { data: activityData, isLoading: isFetchingActivity } = useQuery({
    queryKey: ["activity", authData?.token],
    queryFn: async () => {
      const response = await api.get<any[]>("/api/users/activity");
      return response.data;
    },
    enabled: !!authData && !!authData.isLoggedIn,
  });

  // Calculate stats
  const stats = useMemo(() => {
    if (!reviews || !user)
      return { totalReviews: 0, activeLessons: 0, avgDifficulty: 0 };

    const totalReviews = reviews.length;
    // Calculate unique active lessons from reviews
    const uniqueLessons = new Set(reviews.map((r: any) => r.lesson_id));
    const activeLessons = uniqueLessons.size;

    const totalDifficulty = reviews.reduce((acc: number, review: any) => {
      return acc + (review.card_object?.difficulty || 0);
    }, 0);

    const avgDifficulty =
      totalReviews > 0 ? (totalDifficulty / totalReviews).toFixed(1) : 0;

    return { totalReviews, activeLessons, avgDifficulty };
  }, [reviews, user]);

  const resetMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/users/reset-progress");
    },
    onSuccess: () => {
      showSnackbar("Progress reset successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["user", authData?.token] });
      queryClient.invalidateQueries({ queryKey: ["lessons", authData?.token] });
      queryClient.invalidateQueries({ queryKey: ["reviews", authData?.token] });
      queryClient.invalidateQueries({
        queryKey: ["reviewHistory", authData?.token],
      });
      queryClient.invalidateQueries({
        queryKey: ["activity", authData?.token],
      });
      setResetDialogOpen(false);
    },
    onError: (error) => {
      console.error("Failed to reset progress", error);
      showSnackbar("Failed to reset progress", "error");
      setResetDialogOpen(false);
    },
  });

  // Handle query errors
  useEffect(() => {
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
  }, [error, logout, navigate, showSnackbar]);

  useEffect(() => {
    if (user && user.username) {
      localStorage.setItem("username", user.username);
    }
  }, [user]);

  const handleUpdate = () => {
    // Redirect to update profile page
    navigate("/update-profile");
  };

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/users/delete/${user?._id}`);
    },
    onSuccess: () => {
      showSnackbar("Profile deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["user", authData?.token] });
      logout(() => navigate("/home"));
    },
  });

  useEffect(() => {
    if (deleteMutation.isError) {
      const error = deleteMutation.error;
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          showSnackbar("Session expired. Please log in again.", "error");
          logout(() => navigate("/home"));
        } else if (error.response.status === 403) {
          showSnackbar(
            "You do not have permission to delete this profile.",
            "error",
          );
        } else if (error.response.status === 404) {
          showSnackbar("Profile not found.", "error");
        } else {
          showSnackbar(
            `Error: ${error.response.data?.detail || error.message}`,
            "error",
          );
        }
      } else {
        showSnackbar(`Error: ${error?.message || "Unknown error"}`, "error");
      }
    }
  }, [
    deleteMutation.isError,
    deleteMutation.error,
    logout,
    navigate,
    showSnackbar,
  ]);

  const handleDeleteConfirmation = async () => {
    deleteMutation.mutate();
    setDialogOpen(false);
  };

  const handleResetConfirmation = async () => {
    resetMutation.mutate();
  };

  const handleReset = () => {
    setResetDialogOpen(true);
  };

  // Manage the animation in-between loading and loaded
  useEffect(() => {
    if (isLoading) {
      setShowLoaded(false);
    } else {
      const timer = setTimeout(() => setShowLoaded(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!authData?.isLoggedIn) {
    return (
      <Typography variant="h6" textAlign="center">
        Please log in to view your profile.
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" textAlign="center">
        Error loading profile data.
      </Typography>
    );
  }

  return (
    <>
      <Fade
        in={
          isLoading ||
          isFetchingReviews ||
          isFetchingActivity ||
          isFetchingReviewHistory
        }
        timeout={100}
      >
        <div>
          <ProfileSkeleton
            sx={{
              display:
                isLoading ||
                isFetchingReviews ||
                isFetchingActivity ||
                isFetchingReviewHistory
                  ? "block"
                  : "none",
            }}
          />
        </div>
      </Fade>
      <Fade in={showLoaded} timeout={500} unmountOnExit>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Header Section */}
          <ProfileHeader user={user!} handleUpdate={handleUpdate} />

          {/* Stats Section */}
          <Grid container spacing={3} mb={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ height: "100%" }}
              >
                <Card
                  elevation={5}
                  sx={{
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.success.light,
                          color: theme.palette.success.contrastText,
                        }}
                      >
                        <School />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stats.activeLessons}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Lessons
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ height: "100%" }}
              >
                <Card
                  elevation={5}
                  sx={{
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.warning.light,
                          color: theme.palette.warning.contrastText,
                        }}
                      >
                        <TrendingUp />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stats.avgDifficulty}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average Lesson Difficulty
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} mb={4}>
            <Grid size={{ xs: 12 }}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ActivityHeatmap data={activityData || []} />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={5}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    height: "100%",
                  }}
                >
                  <PastWeekReviewsChart reviews={reviewHistory || []} />
                </Paper>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={5}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    height: "100%",
                  }}
                >
                  <LessonDifficultyChart reviews={reviews ?? []} />
                </Paper>
              </motion.div>
            </Grid>

            {/* <Grid size={{ xs: 12 }}> */}
            {/*   <Paper */}
            {/*     elevation={0} */}
            {/*     sx={{ */}
            {/*       p: 2, */}
            {/*       borderRadius: 4, */}
            {/*       border: `1px solid ${theme.palette.divider}`, */}
            {/*     }} */}
            {/*   > */}
            {/*     <ProjectedReviewsChart reviews={reviews} /> */}
            {/*   </Paper> */}
            {/* </Grid> */}
          </Grid>

          {/* Danger Zone */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.error.main}`,
              bgcolor: theme.palette.error.main + "10",
            }}
          >
            <Typography variant="h6" color="error">
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Once you delete your account, there is no going back. Please be
              certain.
            </Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              Delete Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<RestartAlt />}
              onClick={handleReset}
              sx={{ ml: 2 }}
            >
              Reset Progress
            </Button>
          </Paper>

          <ConfirmationDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={handleDeleteConfirmation}
            title={"Delete Profile"}
            message={"Are you sure you want to delete your profile?"}
          />

          <ConfirmationDialog
            open={resetDialogOpen}
            onClose={() => setResetDialogOpen(false)}
            onConfirm={handleResetConfirmation}
            title={"Reset Progress"}
            message={
              "Are you sure you want to reset your progress? This will delete all your reviews and reset your XP to 0. This action cannot be undone."
            }
          />
        </Container>
      </Fade>
    </>
  );
}

export default Profile;
