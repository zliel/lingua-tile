import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, TextField, Typography } from "@mui/material";
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

  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string, password: string }) =>
      axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/auth/login`,
        credentials,
      ),
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
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        style={{ width: "100%" }}
      >
        <Grid container direction={"column"} spacing={2} alignItems={"center"}>
          <Grid>
            <Typography variant={"h4"}>Login</Typography>
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
            >
              Login
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Login;
