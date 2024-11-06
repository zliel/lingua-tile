import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Modal,
  Skeleton,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import TranslationQuestion from "../Components/TranslationQuestion";
import "./PracticeLesson.css";
import { useNavigate } from "react-router-dom";

const PracticeLesson = () => {
  const { lessonId } = useParams();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [currentSentence, setCurrentSentence] = useState(0);
  const [overallPerformance, setOverallPerformance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState("slide-in");
  const nodeRef = useRef(null);
  const navigate = useNavigate();

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", lessonId, authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        },
      );
      return response.data;
    },
    onError: () => {
      showSnackbar("Failed to fetch lesson", "error");
    },
    enabled: !!authData,
  });

  // Event handler for switching to the next sentence
  const handleNext = () => {
    setAnimationClass("slide-out");
    setTimeout(() => {
      if (currentSentence === lesson.sentences.length - 1) {
        showSnackbar("Lesson complete!", "success");
        setModalOpen(true);
      }
      setCurrentSentence((prev) =>
        prev === lesson.sentences.length - 1 ? 0 : prev + 1,
      );
      setAnimationClass("slide-in");
    }, 400);
  };

  const handlePerformanceReview = (rating) => {
    setOverallPerformance(rating);
    handleLessonComplete.mutate();
  };

  const handleLessonComplete = useMutation({
    mutationFn: async () => {
      await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/lessons/review`,
        { lesson_id: lessonId, overall_performance: overallPerformance },
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        },
      );
    },
    onError: () => {
      showSnackbar("Failed to mark lesson as complete", "error");
      setModalOpen(false);
    },
    onSuccess: () => {
      showSnackbar("Lesson marked as complete", "success");
      setModalOpen(false);
      navigate("/lessons");
    },
  });

  // Hotkeys for reviewing the lesson
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (modalOpen) {
        switch (event.key) {
          case "1":
            handlePerformanceReview(0.1);
            break;
          case "2":
            handlePerformanceReview(0.45);
            break;
          case "3":
            handlePerformanceReview(0.7);
            break;
          case "4":
            handlePerformanceReview(0.9);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [modalOpen, handleLessonComplete, handlePerformanceReview]);

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
      <Box ref={nodeRef} className={animationClass}>
        <TranslationQuestion
          sentence={lesson.sentences[currentSentence]}
          onNext={handleNext}
        />
        <Modal open={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={() => setModalOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="h2">
              Lesson Complete!
            </Typography>
            <Typography sx={{ mt: 2 }}>
              How would you rate your performance?
            </Typography>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  handlePerformanceReview(0.1);
                }}
              >
                Again
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handlePerformanceReview(0.45);
                }}
              >
                Hard
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handlePerformanceReview(0.7);
                }}
              >
                Good
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handlePerformanceReview(0.9);
                }}
              >
                Easy
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default PracticeLesson;
