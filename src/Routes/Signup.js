import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "../Contexts/SnackbarContext";

function Signup() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

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

    const messages = {
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

  const signupMutation = useMutation({
    mutationFn: (newUser) =>
      axios.post(`${process.env.REACT_APP_API_BASE}/api/users/signup`, newUser),
    onSuccess: () => {
      showSnackbar("Account created successfully", "success");
      navigate("/login");
    },
    onError: (error) => {
      if (error.response.status === 400) {
        showSnackbar("Username already exists", "error");
      } else {
        showSnackbar(`Error: ${error.response.data.detail}`, "error");
      }
    },
  });

  const handleSignup = () => {
    if (!isValidPassword()) {
      return;
    } else if (username === "") {
      showSnackbar("Please enter a username", "error");
      return;
    }

    signupMutation.mutate({ username: username, password: password });
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
      <Grid container direction={"column"} spacing={2} alignItems={"center"}>
        <Grid item>
          <Typography variant={"h4"}>Sign Up</Typography>
        </Grid>
        <Grid item>
          <TextField
            label={"Username"}
            variant={"outlined"}
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Grid>
        <Grid item>
          <TextField
            label={"Password"}
            type={"password"}
            variant={"outlined"}
            color={"secondary"}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Grid>
        <Grid item>
          <TextField
            label={"Confirm Password"}
            type={"password"}
            variant={"outlined"}
            color={"secondary"}
            fullWidth
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Grid>
        <Grid item>
          <Button
            variant={"contained"}
            color={"primary"}
            onClick={handleSignup}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Signup;
