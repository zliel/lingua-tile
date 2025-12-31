import { useNavigate } from "react-router-dom";
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
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useOffline } from "../Contexts/OfflineContext";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginSchemaType } from "../Schemas/auth";
import { Link as RouterLink } from "react-router-dom";

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
      return axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/auth/login`,
        credentials,
      );
    },
    onSuccess: (response) => {
      showSnackbar("Login successful", "success");
      login(response.data, () => navigate("/dashboard"));
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        showSnackbar(
          `Login failed: ${error.response.data.message || "Unknown error"} `,
          "error",
        );
      } else {
        showSnackbar(`Login failed: ${error.message} `, "error");
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
        pt: 8,
        px: 4,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: "100%" }}
        >
          <Grid
            container
            direction={"column"}
            spacing={3}
            alignItems={"center"}
          >
            <Grid style={{ width: '100%' }}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>
            <Grid style={{ width: '100%' }}>
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
            <Grid style={{ width: '100%' }}>
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
      </Card >
    </Box >
  );
}

export default Login;
