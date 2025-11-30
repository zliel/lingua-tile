import { useSnackbar } from "@/Contexts/SnackbarContext";
import { NewUser } from "@/types/users";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const errorMsgMap: Record<string, string> = {
  length: "Password must be between 8 and 64 characters long",
  validChars:
    "Password must only include letters, numbers, special characters, and spaces",
  lowercase: "Password must include at least one lowercase letter",
  uppercase: "Password must include at least one uppercase letter",
  number: "Password must include at least one number",
  specialChar: "Password must include at least one special character",
  match: "Passwords do not match",
};

export const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

    for (const [key, isValid] of Object.entries(conditions)) {
      if (!isValid) {
        showSnackbar(errorMsgMap[key], "error");
        return false;
      }
    }

    return true;
  };

  const signupMutation = useMutation({
    mutationFn: (newUser: NewUser) =>
      axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/signup`,
        newUser,
      ),
    onSuccess: () => {
      showSnackbar("Account created successfully", "success");
      navigate("/login");
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          showSnackbar("Username already exists", "error");
        } else {
          showSnackbar(`Error: ${error.response.data.detail}`, "error");
        }
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
    <Card
      elevation={1}
      sx={{
        pt: isMobile ? 2 : 0,
        width: isMobile ? "100%" : 400,
        maxWidth: "90%",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
          style={{ width: "100%" }}
        >
          <Grid
            container
            direction={"column"}
            spacing={4}
            alignItems={"center"}
          >
            <Grid>
              <Typography variant={"h4"} fontWeight={600}>
                Sign Up
              </Typography>
            </Grid>
            <Grid>
              <TextField
                label={"Username"}
                variant={"outlined"}
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
                required
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
                required
              />
            </Grid>
            <Grid>
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
            <Grid>
              <Button
                loading={signupMutation.isPending}
                variant={"contained"}
                color={"primary"}
                type="submit"
                size="large"
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};
