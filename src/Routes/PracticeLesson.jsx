import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useTheme } from "@mui/material/styles";
import TranslationQuestion from "../Components/TranslationQuestion";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./PracticeLesson.css";

const GrammarLesson = () => {
  const { lessonId } = useParams();
  const { auth } = useAuth();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const [currentSentence, setCurrentSentence] = useState(0);

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

  const handleNext = () => {
    if (currentSentence === lesson.sentences.length - 1) {
      showSnackbar("Lesson complete!", "success");
    }

    setCurrentSentence((prev) =>
      prev === lesson.sentences.length - 1 ? 0 : prev + 1,
    );
  };

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
        <Skeleton variant="rectangular" width="80%" height={200} />
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
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        mt: 4,
        p: 1.5,
        border: 2,
        borderColor: "primary.main",
        borderRadius: 2,
      }}
    >
      <TransitionGroup>
        <CSSTransition timeout={1000} classNames={"fade"} key={currentSentence}>
          <TranslationQuestion
            sentence={lesson.sentences[currentSentence]}
            onNext={handleNext}
          />
        </CSSTransition>
      </TransitionGroup>
    </Box>
  );
};

export default GrammarLesson;
