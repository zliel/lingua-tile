import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useAuth } from "../Contexts/AuthContext";
import { useOffline } from "../Contexts/OfflineContext";
import { api } from "@/utils/apiClient";

const useLessonReview = (
  lessonId: string,
  setModalOpen: (open: boolean) => void,
  setModalLoading: (loading: boolean) => void,
  onReviewComplete?: (data: any) => void,
) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { isOnline, addToQueue } = useOffline();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLessonComplete = useMutation({
    mutationFn: async (rating: number) => {
      setModalLoading(true);
      try {
        const response = await api.post<Record<string, unknown>>(
          "/api/lessons/review",
          { lesson_id: lessonId, overall_performance: rating },
          { timeout: 3000 },
        );
        return { offline: false, ...response.data };
      } catch (error: any) {
        // Check for network error (no response) or timeout
        if (
          !error.response ||
          error.code === "ERR_NETWORK" ||
          error.code === "ECONNABORTED"
        ) {
          if (!authData?.username) {
            throw new Error("User not logged in");
          }
          addToQueue({
            lesson_id: lessonId,
            overall_performance: rating,
            timestamp: Date.now(),
            username: authData.username,
          });
          return { offline: true };
        }
        throw error;
      }
    },
    onError: (error: any) => {
      showSnackbar(
        error.message === "User not logged in"
          ? "You must be logged in to save progress."
          : "Failed to mark lesson as complete",
        "error",
      );
      setModalLoading(false);
      setModalOpen(false);
    },
    onSuccess: (data) => {
      if (data.offline) {
        showSnackbar("Saved offline. Will sync when online.", "success");
        setModalLoading(false);
        setModalOpen(false);
        navigate("/lessons");
      } else {
        setModalLoading(false);
        if (onReviewComplete) {
          onReviewComplete(data);
        } else {
          showSnackbar("Lesson marked as complete", "success");
          setModalOpen(false);
          navigate("/lessons");
        }
      }
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewHistory"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });

  const handlePerformanceReview = useCallback(
    (rating: number) => {
      if (isOnline) {
        handleLessonComplete.mutate(rating);
      } else {
        if (!authData?.username) {
          showSnackbar(
            "You must be logged in to save progress offline.",
            "error",
          );
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
        queryClient.invalidateQueries({ queryKey: ["lessons"] });
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        queryClient.invalidateQueries({ queryKey: ["reviewHistory"] });
        queryClient.invalidateQueries({ queryKey: ["activity"] });
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
