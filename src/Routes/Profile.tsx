import { useState, useEffect } from "react";
import { Box, Button, Fade, Grid, Skeleton, Typography } from "@mui/material";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useAuth } from "../Contexts/AuthContext";
import { PastWeekReviewsChart } from "@/Components/profile/PastWeekReviewsChart";
import { ProjectedReviewsChart } from "@/Components/profile/ProjectedReviewsChart";
import { LessonDifficultyChart } from "@/Components/profile/LessonDifficultyChart";

function Profile() {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showLoaded, setShowLoaded] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    isLoading,
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

  const { data: reviews, isLoading: isFetchingReviews } = useQuery({
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
      await axios.delete(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/delete/${user._id}`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
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
      <Fade in={isLoading || isFetchingReviews} timeout={100}>
        <Box
          sx={{
            display: isLoading ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Loading...
          </Typography>
          <Skeleton
            variant="rectangular"
            animation={"wave"}
            width="50%"
            height={40}
            sx={{ mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            animation={"wave"}
            width="50%"
            height={30}
            sx={{ mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            animation={"wave"}
            width="50%"
            height={20}
            sx={{ mb: 2 }}
          />
        </Box>
      </Fade>
      <Fade in={showLoaded} timeout={100} unmountOnExit>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
            width: "100%",
            minWidth: 300,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <Typography variant="h6" gutterBottom>
            Username: {localStorage.getItem("username") || ""}
          </Typography>
          <Grid container spacing={2} justifyContent="center" mb={2}>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
                Update Profile
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="warning"
                onClick={handleDelete}
              >
                Delete Profile
              </Button>
            </Grid>
          </Grid>
          <PastWeekReviewsChart reviews={reviews} />
          <ProjectedReviewsChart reviews={reviews} />
          <LessonDifficultyChart reviews={reviews} />
          <ConfirmationDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={handleDeleteConfirmation}
            title={"Delete Profile"}
            message={"Are you sure you want to delete your profile?"}
          />
        </Box>
      </Fade>
    </>
  );
}

export default Profile;
