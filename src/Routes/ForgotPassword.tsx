import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/auth/forgot-password`,
        { email }
      );

      setMessage(res.data.message);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "Failed to send reset link");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your email to receive a reset link
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
                label="Email Address"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            color="primary"
            fontWeight="medium"
          >
            Back to Login
          </Link>
        </Box>
      </Card>
    </Box>
  );
};
