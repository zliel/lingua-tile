import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { Lesson } from "@/types/lessons";
import { useCallback, useState } from "react";
import axios from "axios";

export const useOfflineData = () => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [downloadingSections, setDownloadingSections] = useState<Record<string, boolean>>({});

  const prefetchLessonData = useCallback(async (lessonId: string) => {
    const token = authData?.token;

    await queryClient.prefetchQuery({
      queryKey: ["lesson", lessonId, token],
      queryFn: async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE}/api/lessons/${lessonId}`,
        );
        return response.data as Lesson;
      },
      staleTime: 1000 * 60 * 60 * 24,
    });

    if ((queryClient.getQueryState(["lesson", lessonId, token])?.data as Lesson).category === "flashcards") {
      await queryClient.prefetchQuery({
        queryKey: ["flashcards", lessonId, token],
        queryFn: async () => {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE}/api/cards/lesson/${lessonId}`
          );
          return response.data;
        },
        staleTime: 1000 * 60 * 60 * 24,
      });
    }

    if (token) {
      await queryClient.prefetchQuery({
        queryKey: ["review", lessonId, token],
        queryFn: async () => {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE}/api/lessons/review/${lessonId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return response.data;
        },
        staleTime: 1000 * 60 * 60 * 24,
      });
    }
  }, [authData, queryClient]);

  const downloadSection = useCallback(async (sectionId: string, lessons: Lesson[]) => {
    if (!navigator.onLine) {
      showSnackbar("You must be online to download lessons.", "error");
      return;
    }

    setDownloadingSections(prev => ({ ...prev, [sectionId]: true }));

    try {
      let count = 0;
      for (const lesson of lessons) {
        await prefetchLessonData(lesson._id);
        count++;
      }
      showSnackbar(`Downloaded ${count} lessons for offline use.`, "success");
    } catch (error) {
      showSnackbar("Failed to download some lessons.", "error");
    } finally {
      setDownloadingSections(prev => ({ ...prev, [sectionId]: false }));
    }
  }, [prefetchLessonData, showSnackbar]);

  const prefetchActiveSection = useCallback(async (lessonsInSection: Lesson[]) => {
    if (!navigator.onLine) return;

    const lessonsToPrefetch = lessonsInSection.slice(0, 5);

    try {
      for (const lesson of lessonsToPrefetch) {
        await prefetchLessonData(lesson._id).catch(err => console.error("Background prefetch failed", err));
      }
    } catch (error) {
      console.error("Background prefetch error", error);
    }
  }, [authData, prefetchLessonData]);

  return {
    downloadSection,
    prefetchActiveSection,
    downloadingSections
  };
};
