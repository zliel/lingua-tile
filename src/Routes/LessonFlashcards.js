import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import FlashcardsList from "../Components/FlashcardList";

const LessonFlashcards = () => {
  const { lessonId } = useParams();
  const { auth } = useAuth();
  const { showSnackbar } = useSnackbar();

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", lessonId, auth.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
      return response.data;
    },
    onError: () => {
      showSnackbar("Failed to fetch lesson", "error");
    },
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
        <Typography>Loading lesson...</Typography>
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error loading lesson.</Typography>;
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
        Lesson: {lesson.title}
      </Typography>
      <FlashcardsList lessonId={lessonId} />
    </Box>
  );
};

export default LessonFlashcards;
