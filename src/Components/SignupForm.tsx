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
import GoogleIcon from "@mui/icons-material/Google";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupSchema, SignupSchemaType } from "@/Schemas/auth";

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
            spacing={4}
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
            <Grid style={{ width: "100%" }}>
              <Divider sx={{ my: 2 }}>OR</Divider>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<GoogleIcon />}
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_APP_API_BASE}/api/auth/login/google`;
                }}
              >
                Sign up with Google
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};
