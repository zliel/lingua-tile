import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useAuth } from "../Contexts/AuthContext";

const useLessonReview = (
  lessonId: string,
  setModalOpen: (open: boolean) => void,
  setModalLoading: (loading: boolean) => void,
) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [overallPerformance, setOverallPerformance] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLessonComplete = useMutation({
    mutationFn: async () => {
      setModalLoading(true);
      await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/review`,
        { lesson_id: lessonId, overall_performance: overallPerformance },
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onError: () => {
      showSnackbar("Failed to mark lesson as complete", "error");
      setModalLoading(false);
      setModalOpen(false);
    },
    onSuccess: () => {
      showSnackbar("Lesson marked as complete", "success");
      setModalLoading(false);
      setModalOpen(false);
      queryClient.invalidateQueries("lessons" as any);
      navigate("/lessons");
    },
  });

  const handlePerformanceReview = useCallback(
    (rating: number) => {
      setOverallPerformance(rating);
      handleLessonComplete.mutate();
    },
    [handleLessonComplete, setOverallPerformance],
  );

  return { handlePerformanceReview };
};

export default useLessonReview;
