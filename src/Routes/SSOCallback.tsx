import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

function SSOCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");

    if (token) {
      login({
        token,
        username: username || "",
      }, () => navigate("/dashboard"));
    } else {
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
      <CircularProgress />
      <Typography>Logging you in...</Typography>
    </Box>
  );
}

export default SSOCallback;

