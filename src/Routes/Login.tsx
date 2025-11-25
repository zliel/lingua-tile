import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { LoadingButton } from "@mui/lab";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) => {
      console.log("Logging into: " + import.meta.env.VITE_APP_API_BASE);
      return axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/auth/login`,
        credentials,
      );
    },
    onSuccess: (response) => {
      showSnackbar("Login successful", "success");
      login(response.data, () => navigate("/"));
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        showSnackbar(
          `Login failed: ${error.response.data.message || "Unknown error"}`,
          "error",
        );
      } else {
        showSnackbar(`Login failed: ${error.message}`, "error");
      }
    },
  });

  const handleLogin = () => {
    if (username === "" || password === "") {
      showSnackbar("Please enter a username and password", "error");
      return;
    }

    loginMutation.mutate({ username: username, password: password });
  };
  return (
    <Box
      sx={{
        height: "90vh",
        p: 8,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        elevation={1}
        sx={{
          pt: isMobile ? 2 : 0,
          width: isMobile ? "100%" : 400,
          maxWidth: isMobile ? "100%" : "90%",
          height: "fit-content",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            style={{ width: "100%" }}
          >
            <Grid
              container
              direction={"column"}
              spacing={4}
              alignItems={"center"}
            >
              <Grid mt={2}>
                <Typography variant={"h4"}>Log in</Typography>
              </Grid>
              <Grid>
                <TextField
                  label={"Username"}
                  variant={"outlined"}
                  fullWidth
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid>
                <TextField
                  label={"Password"}
                  type={"password"}
                  variant={"outlined"}
                  color={"secondary"}
                  fullWidth
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid>
                <LoadingButton
                  loading={loginMutation.isPending}
                  variant={"contained"}
                  color={"primary"}
                  type="submit"
                  size="large"
                >
                  Log in
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
