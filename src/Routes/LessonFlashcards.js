import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Skeleton, Typography } from "@mui/material";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import Flashcard from "../Components/Flashcard";

const LessonFlashcards = () => {
  const { lessonId } = useParams();
  const { auth } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

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

  const { data: flashcards = [] } = useQuery({
    queryKey: ["flashcards", lessonId, auth.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/cards/lesson/${lessonId}`,
      );

      return response.data;
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
        <Skeleton
          animation={"wave"}
          variant="rectangular"
          width="70%"
          height={80}
          sx={{ borderRadius: 2, mb: 2 }}
        />
        <Skeleton
          animation={"wave"}
          variant="rectangular"
          width="70%"
          height={160}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error loading lesson.</Typography>;
  }

  const handleNextCard = () => {
    setShowTranslation(false);
    if (currentCardIndex + 1 === flashcards.length) {
      showSnackbar("You have reached the end of the lesson!", "success");
      setCurrentCardIndex(0);
    } else {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleShowTranslation = () => {
    setShowTranslation(true);
  };

  const currentCard = flashcards[currentCardIndex];
  const isEnglishToJapanese = Math.random() > 0.5;

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
      <Flashcard
        frontText={
          isEnglishToJapanese ? currentCard?.back_text : currentCard?.front_text
        }
        backText={
          isEnglishToJapanese ? currentCard?.front_text : currentCard?.back_text
        }
        showTranslation={showTranslation}
        onShowTranslation={handleShowTranslation}
        onNextCard={handleNextCard}
      />
    </Box>
  );
};

export default LessonFlashcards;
