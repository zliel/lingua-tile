// src/hooks/useLessonComplete.js
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useAuth } from "../Contexts/AuthContext";

const useLessonReview = (lessonId, modalOpen, setModalOpen) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [overallPerformance, setOverallPerformance] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries("lessons");
      navigate("/lessons");
    },
  });

  const handlePerformanceReview = useCallback(
    (rating) => {
      setOverallPerformance(rating);
      handleLessonComplete.mutate();
    },
    [handleLessonComplete, setOverallPerformance],
  );

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
  }, [modalOpen, handlePerformanceReview]);

  return { handlePerformanceReview };
};

export default useLessonReview;
