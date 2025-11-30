import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useAuth } from "../Contexts/AuthContext";
import { useOffline } from "../Contexts/OfflineContext";

const useLessonReview = (
  lessonId: string,
  setModalOpen: (open: boolean) => void,
  setModalLoading: (loading: boolean) => void,
) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { isOnline, addToQueue } = useOffline();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLessonComplete = useMutation({
    mutationFn: async (rating: number) => {
      setModalLoading(true);
      await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/review`,
        { lesson_id: lessonId, overall_performance: rating },
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
      if (isOnline) {
        handleLessonComplete.mutate(rating);
      } else {
        if (!authData?.username) {
          showSnackbar("You must be logged in to save progress offline.", "error");
          return;
        }
        addToQueue({
          lesson_id: lessonId,
          overall_performance: rating,
          timestamp: Date.now(),
          username: authData.username,
        });
        showSnackbar("Saved offline. Will sync when online.", "success");
        setModalOpen(false);
        // We invalidate queries so that when we navigate back, the UI can potentially
        // check the queue and show "Pending Sync" instead of the old status.
        queryClient.invalidateQueries("lessons" as any);
        navigate("/lessons");
      }
    },
    [
      handleLessonComplete,
      isOnline,
      addToQueue,
      lessonId,
      showSnackbar,
      setModalOpen,
      queryClient,
      navigate,
    ],
  );

  return { handlePerformanceReview };
};

export default useLessonReview;
