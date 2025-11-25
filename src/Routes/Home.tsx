import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Logo from "../assets/LinguaTile Logo.png";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";
import { useEffect } from "react";

function Home() {
  const { authData } = useAuth();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (authData?.token) {
      queryClient.prefetchQuery({
        queryKey: ["lessons", authData.token],
        queryFn: async () => {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE}/api/lessons/all`,
            {
              headers: { Authorization: `Bearer ${authData.token}` },
            },
          );
          return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      queryClient.prefetchQuery({
        queryKey: ["sections", authData.token],
        queryFn: async () => {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE}/api/sections/all`,
            {
              headers: { Authorization: `Bearer ${authData.token}` },
            },
          );
          return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      queryClient.prefetchQuery({
        queryKey: ["reviews", authData.token],
        queryFn: async () => {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE}/api/lessons/reviews/`,
            {
              headers: { Authorization: `Bearer ${authData.token}` },
            },
          );
          return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [authData, queryClient]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        margin: "auto",
        display: "flex",
        padding: 2,
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component={"img"}
        sx={{
          margin: "auto",
          marginTop: 5,
          display: "block",
          marginBottom: 2,
          transition: isMobile ? "" : "transform 0.3s ease",
          "&:hover": {
            transform: isMobile ? "" : "scale(1.1)",
          },
        }}
        src={Logo}
      />
      <Typography
        sx={{ textAlign: "center", fontSize: isMobile ? "1.2rem" : "1.5rem" }}
      >
        Welcome to LinguaTile, a learning platform focused on the Japanese
        language.
      </Typography>
    </Box>
  );
}

export default Home;
