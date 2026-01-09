import { useState } from "react";
import { useSearchParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Grid,
  Link,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!token) {
      return setError("Invalid or missing token");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/auth/reset-password`,
        { token, new_password: password }
      );

      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "Failed to reset password");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">Invalid Reset Link</Typography>
        <Link component={RouterLink} to="/login">Go to Login</Link>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "90vh",
        pt: 8,
        px: 4,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        elevation={1}
        sx={{
          width: isMobile ? "100%" : 400,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Set New Password
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid
            container
            direction={"column"}
            spacing={3}
            alignItems={"center"}
          >
            <Grid style={{ width: "100%" }}>
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid style={{ width: "100%" }}>
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Grid>

            {error && (
              <Grid style={{ width: "100%" }}>
                <Typography color="error" variant="body2" align="center">
                  {error}
                </Typography>
              </Grid>
            )}

            {message && (
              <Grid style={{ width: "100%" }}>
                <Typography color="success.main" variant="body2" align="center">
                  {message}
                </Typography>
              </Grid>
            )}

            <Grid style={{ width: "100%" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disableElevation
                fullWidth
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
};
