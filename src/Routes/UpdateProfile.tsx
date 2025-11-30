import { useState } from "react";
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
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useAuth } from "../Contexts/AuthContext";

function UpdateProfile() {
  const { authData, logout } = useAuth();
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "",
  );
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        },
      );

      setUsername(response.data.username);
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
      showSnackbar(`Error: ${error?.message || "Unknown error"}`, "error");
    }
  }

  const updateMutation = useMutation({
    mutationFn: async (updatedUser) => {
      await axios.put(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/update/${user._id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        },
      );
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

  const isValidPassword = () => {
    const conditions = {
      length: password.length >= 8 && password.length <= 64,
      validChars: /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]*$/.test(
        password,
      ),
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      match: password === confirmPassword,
    };

    const messages: Record<string, string> = {
      length: "Password must be between 8 and 64 characters long",
      validChars:
        "Password must only include letters, numbers, special characters, and spaces",
      lowercase: "Password must include at least one lowercase letter",
      uppercase: "Password must include at least one uppercase letter",
      number: "Password must include at least one number",
      specialChar: "Password must include at least one special character",
      match: "Passwords do not match",
    };

    for (const [key, isValid] of Object.entries(conditions)) {
      if (!isValid) {
        showSnackbar(messages[key], "error");
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (password !== "") {
      if (!isValidPassword()) {
        return;
      }

      user.password = password;
    }

    const updatedUser = { ...user, username, password: password || undefined };
    updateMutation.mutate(updatedUser);
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
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={40} width="50%" sx={{ borderRadius: 2 }} />
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
        startIcon={<ArrowBackIcon />}
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Stack spacing={3}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              helperText={`Current: ${user.username}`}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Changing your username or password will require you to log in again.
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
