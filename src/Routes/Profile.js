import React, { useState } from "react";
import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useAuth } from "../Contexts/AuthContext";

function Profile() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: user,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["user", auth.token],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/users/", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    },
    onError: (error) => {
      if (error.response.status === 401) {
        showSnackbar("Session expired. Please log in again.", "error");
        logout(() => navigate("/home"));
      } else {
        showSnackbar(`Error: ${error.response.data.detail}`, "error");
      }
    },
  });

  const handleUpdate = () => {
    // Redirect to update profile page
    navigate("/update-profile");
  };

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://127.0.0.1:8000/api/users/delete/${user._id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
    },
    onSuccess: () => {
      showSnackbar("Profile deleted successfully", "success");
      queryClient.invalidateQueries(["user", auth.token]);
      logout(() => navigate("/home"));
    },
    onError: (error) => {
      if (error.response.status === 401) {
        showSnackbar("Session expired. Please log in again.", "error");
      } else if (error.response.status === 403) {
        showSnackbar(
          "You do not have permission to delete this profile.",
          "error",
        );
      } else if (error.response.status === 404) {
        showSnackbar("Profile not found.", "error");
      } else {
        showSnackbar(`Error: ${error.response.data.detail}`, "error");
      }
    },
  });

  const handleDeleteConfirmation = async () => {
    deleteMutation.mutate();
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
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
          width="90%"
          height={40}
          sx={{ mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          width="90%"
          height={30}
          sx={{ mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          width="90%"
          height={20}
          sx={{ mb: 2 }}
        />
      </Box>
    );
  }

  if (!auth.isLoggedIn) {
    return (
      <Typography variant="h6" textAlign="center">
        Please log in to view your profile.
      </Typography>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" textAlign="center">
        Error loading profile data.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="h6" gutterBottom>
        Username: {user.username}
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update Profile
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="warning" onClick={handleDelete}>
            Delete Profile
          </Button>
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDeleteConfirmation}
        title={"Delete Profile"}
        message={"Are you sure you want to delete your profile?"}
      />
    </Box>
  );
}

export default Profile;
