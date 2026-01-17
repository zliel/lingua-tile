import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { api } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { useOffline } from "@/Contexts/OfflineContext";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginSchemaType } from "@/Schemas/auth";
import { Link as RouterLink } from "react-router-dom";
import "@/Components/SSOButtons.css";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { clearQueue } = useOffline(); // Assuming useOfflineData is correct hook name

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginSchemaType) => {
      return api.post("/api/auth/login", credentials);
    },
    onSuccess: (response) => {
      showSnackbar("Login successful", "success");
      login(response.data as { token: string; username: string }, () => navigate("/dashboard"));
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        showSnackbar(
          `Login failed: ${error.response.data.message || "Unknown error"} `,
          "error",
        );
      } else {
        showSnackbar(`Login failed: ${(error as Error).message} `, "error");
      }
    },
  });

  const onSubmit = (data: LoginSchemaType) => {
    loginMutation.mutate(data);
  };

  return (
    <Box
      sx={{
        height: "90vh",
        pt: 4,
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
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to continue your progress
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Grid
            container
            direction={"column"}
            spacing={3}
            alignItems={"center"}
          >
            <Grid style={{ width: "100%" }}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>
            <Grid style={{ width: "100%" }}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid style={{ width: "100%" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disableElevation
                fullWidth
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </Grid>

            <Grid style={{ width: "100%", textAlign: "right" }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
                color="primary"
                variant="body2"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Forgot Password?
              </Link>
            </Grid>

            <Grid
              style={{
                width: "100%",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Divider sx={{ my: 2, width: "100%" }}>OR</Divider>
              <button
                className="gsi-material-button"
                type="button"
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_APP_API_BASE}/api/auth/login/google`;
                }}
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      style={{ display: "block" }}
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      ></path>
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    Sign in with Google
                  </span>
                  <span style={{ display: "none" }}>Sign in with Google</span>
                </div>
              </button>
            </Grid>

            <Grid>
              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={clearQueue}
              >
                Clear Offline Data
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/signup"
              underline="hover"
              color="primary"
              fontWeight="medium"
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default Login;
