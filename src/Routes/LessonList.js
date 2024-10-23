// src/Routes/LessonList.js
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Button, Skeleton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";

const LessonList = () => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const categoryColors = {
    flashcards: "primary",
    practice: "secondary",
    grammar: "warning",
  };
  const categoryRoutes = {
    flashcards: "/flashcards",
    practice: "/practice",
    grammar: "/grammar",
  };

  const {
    data: lessons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lessons", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/lessons/all`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        },
      );
      return response.data;
    },
    onError: () => {
      showSnackbar("Failed to fetch lessons", "error");
    },
    enabled: !!authData,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        {Array.from(new Array(5)).map((_, index) => (
          <Box key={index} sx={{ width: "70%", mb: 2 }}>
            <Skeleton
              variant="rectangular"
              animation={"wave"}
              width="100%"
              height={80}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        ))}
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error loading lessons.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Lessons
      </Typography>
      {lessons &&
        lessons.map((lesson) => (
          <Box
            key={lesson.id}
            sx={{
              p: 1.5,
              mb: 2,
              width: "70%",
              display: "flex",
              justifyContent: "space-between",
              border: `2px solid ${theme.palette.primary.contrastText}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">{lesson.title}</Typography>
            <Button
              variant="contained"
              color={categoryColors[lesson.category]}
              component={Link}
              to={`${categoryRoutes[lesson.category]}/${lesson._id}`}
            >
              {lesson.category}
            </Button>
          </Box>
        ))}
    </Box>
  );
};

export default LessonList;
