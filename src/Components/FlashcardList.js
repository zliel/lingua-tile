import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, LinearProgress, Skeleton, Typography } from "@mui/material";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import Flashcard from "./Flashcard";
import { RocketLaunch } from "@mui/icons-material";

const FlashcardList = ({ lessonId }) => {
  const { auth } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isEnglishToJapanese, setIsEnglishToJapanese] = useState(true);

  const {
    data: flashcards = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["flashcards", lessonId, auth.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/cards/lesson/${lessonId}`,
      );
      return response.data;
    },
  });

  useEffect(() => {
    setIsEnglishToJapanese(Math.random() < 0.5);
  }, [currentCardIndex]);

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
    return <Typography>Error loading flashcards.</Typography>;
  }

  const handleNextCard = () => {
    setShowTranslation(false);

    setTimeout(() => {
      if (currentCardIndex + 1 === flashcards.length) {
        showSnackbar("You have reached the end of the lesson!", "success");
        setCurrentCardIndex(0);
      } else {
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
      }
    }, 10);
  };

  const handleShowTranslation = () => {
    setShowTranslation((prevShowTranslation) => !prevShowTranslation);
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
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
      <LinearProgress
        variant="determinate"
        value={(currentCardIndex / flashcards.length) * 100}
        sx={{ width: "90%", height: 5, borderRadius: 2, mt: 1 }}
      />
    </Box>
  );
};

export default FlashcardList;
