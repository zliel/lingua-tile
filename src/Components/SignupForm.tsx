import { useSnackbar } from "@/Contexts/SnackbarContext";
import { NewUser } from "@/types/users";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupSchema, SignupSchemaType } from "@/Schemas/auth";
import "./SSOButtons.css";

export const SignupForm = () => {
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
  });

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

  const onSubmit = (data: SignupSchemaType) => {
    signupMutation.mutate({
      username: data.username,
      password: data.password,
      email: data.email,
    });
  };

  return (
    <Card
      elevation={1}
      sx={{
        pt: isMobile ? 2 : 0,
        mb: isMobile ? 2 : 0,
        width: isMobile ? "100%" : 400,
        maxWidth: "90%",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Grid
            container
            direction={"column"}
            spacing={2.5}
            alignItems={"center"}
          >
            <Grid>
              <Typography variant={"h4"} fontWeight={600}>
                Sign Up
              </Typography>
            </Grid>
            <Grid style={{ width: "100%" }}>
              <TextField
                label={"Username"}
                variant={"outlined"}
                fullWidth
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                required
              />
            </Grid>
            <Grid style={{ width: "100%" }}>
              <TextField
                label={"Password"}
                type={"password"}
                variant={"outlined"}
                color={"secondary"}
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                required
              />
            </Grid>
            <Grid style={{ width: "100%" }}>
              <TextField
                label={"Confirm Password"}
                type={"password"}
                variant={"outlined"}
                color={"secondary"}
                fullWidth
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                required
              />
            </Grid>
            <Grid style={{ width: "100%" }}>
              <TextField
                label={"Email"}
                type={"email"}
                variant={"outlined"}
                color={"secondary"}
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                required
              />
            </Grid>
            <Grid>
              <Button
                disabled={signupMutation.isPending}
                variant={"contained"}
                color={"primary"}
                type="submit"
                size="large"
              >
                {signupMutation.isPending ? "Signing up..." : "Sign Up"}
              </Button>
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
                    Sign up with Google
                  </span>
                  <span style={{ display: "none" }}>Sign up with Google</span>
                </div>
              </button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};
