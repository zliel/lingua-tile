import { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { api } from "@/utils/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { useAuth } from "@/Contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpdateProfileSchema, UpdateProfileSchemaType } from "@/Schemas/auth";
import { User } from "@/types/users";

function UpdateProfile() {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User>({
    queryKey: ["user", authData?.token],
    queryFn: async (): Promise<User> => {
      const response = await api.get<User>("/api/users");
      return response.data;
    },
    enabled: !!authData && !!authData.isLoggedIn,
  });

  if (error) {
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
      showSnackbar(
        `Error: ${(error as Error)?.message || "Unknown error"}`,
        "error",
      );
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      username: user?.username || "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: async (updatedUser: UpdateProfileSchemaType) => {
      if (!user) throw new Error("User not found");
      await api.put(`/api/users/update/${user._id}`, updatedUser);
    },
    onSuccess: () => {
      showSnackbar("Profile updated successfully", "success");
      logout(() => navigate("/login"));
    },
  });

  if (updateMutation.error) {
    const error = updateMutation.error;
    if (axios.isAxiosError(error) && error.response) {
      switch (error.response.status) {
        case 401:
          showSnackbar("Invalid token. Please log in again.", "error");
          logout(() => navigate("/login"));
          break;
        case 403:
          showSnackbar("Unauthorized to update user", "error");
          break;
        case 404:
          showSnackbar("User not found", "error");
          break;
        default:
          showSnackbar(
            `Error: ${error.response.data?.detail || error.message}`,
            "error",
          );
      }
    }
  }

  const onSubmit = (data: UpdateProfileSchemaType) => {
    const payload = {
      ...user,
      username: data.username,
      password: data.password || undefined, // Only send password if it's set
    };
    updateMutation.mutate(payload);
  };

  if (!authData?.isLoggedIn) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 4 }}>
          <Typography variant="h6">
            Please log in to update your profile.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
        </Paper>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton
            variant="rectangular"
            height={60}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={60}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={60}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={40}
            width="50%"
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 4 }}>
          <Typography variant="h6" color="error">
            Failed to load profile data.
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate("/profile")}
          >
            Back to Profile
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/profile")}
        sx={{ mb: 2 }}
      >
        Back to Profile
      </Button>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Update Profile
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Update your account information below.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              {...register("username")}
              error={!!errors.username}
              helperText={
                errors.username?.message || `Current: ${user?.username ?? ""}`
              }
            />

            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.secondary">
                CHANGE PASSWORD (OPTIONAL)
              </Typography>
            </Divider>

            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              variant="outlined"
              fullWidth
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Changing your username or password will require you to log in
              again.
            </Alert>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              loading={updateMutation.isPending}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2, fontSize: "1.1rem" }}
            >
              Save Changes
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default UpdateProfile;
