import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useTheme } from "@mui/material/styles";
import TranslationQuestion from "../Components/TranslationQuestion";
import "./PracticeLesson.css";

const PracticeLesson = () => {
  const { lessonId } = useParams();
  const { auth } = useAuth();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const [currentSentence, setCurrentSentence] = useState(0);
  const [animationClass, setAnimationClass] = useState("slide-in");
  const nodeRef = useRef(null);

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
    setAnimationClass("slide-out");
    setTimeout(() => {
      if (currentSentence === lesson.sentences.length - 1) {
        showSnackbar("Lesson complete!", "success");
      }
      setCurrentSentence((prev) =>
        prev === lesson.sentences.length - 1 ? 0 : prev + 1,
      );
      setAnimationClass("slide-in");
    }, 400);
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
        mt: 6,
        p: 3,
        pb: "6em",
        border: 2,
        borderColor: "primary.main",
        borderRadius: 2,
      }}
    >
      <Typography variant={"h4"}>{lesson.title}</Typography>
      <div ref={nodeRef} className={animationClass}>
        <TranslationQuestion
          sentence={lesson.sentences[currentSentence]}
          onNext={handleNext}
        />
      </div>
    </Box>
  );
};

export default PracticeLesson;
