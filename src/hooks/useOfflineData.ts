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
  const [downloadingSections, setDownloadingSections] = useState<
    Record<string, boolean>
  >({});

  const fetchSectionData = useCallback(
    async (sectionId: string) => {
      const token = authData?.token;
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/sections/${sectionId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { lessons, cards } = response.data;

      // Cache lessons
      lessons.forEach((lesson: Lesson) => {
        queryClient.setQueryData(["lesson", lesson._id, token], lesson);
      });

      // Cache cards for flashcard lessons
      lessons.forEach((lesson: Lesson) => {
        if (lesson.category === "flashcards") {
          const lessonCards = cards.filter(
            (card: any) =>
              card.lesson_ids && card.lesson_ids.includes(lesson._id),
          );
          queryClient.setQueryData(
            ["flashcards", lesson._id, token],
            lessonCards,
          );
        }
      });
      return lessons.length;
    },
    [authData, queryClient],
  );

  const downloadSection = useCallback(
    async (sectionId: string) => {
      if (!navigator.onLine) {
        showSnackbar("You must be online to download lessons.", "error");
        return;
      }

      setDownloadingSections((prev) => ({ ...prev, [sectionId]: true }));

      try {
        const count = await fetchSectionData(sectionId);
        showSnackbar(`Downloaded ${count} lessons for offline use.`, "success");
      } catch (error) {
        console.error(error);
        showSnackbar("Failed to download lessons.", "error");
      } finally {
        setDownloadingSections((prev) => ({ ...prev, [sectionId]: false }));
      }
    },
    [fetchSectionData, showSnackbar],
  );

  const prefetchActiveSection = useCallback(
    async (lessonsInSection: Lesson[]) => {
      if (!navigator.onLine || lessonsInSection.length === 0) return;

      const nextLesson = lessonsInSection[0];
      const token = authData?.token;

      // Check if the next lesson is already cached. If so, assume section is reasonably fresh.
      const cachedLesson = queryClient.getQueryData([
        "lesson",
        nextLesson._id,
        token,
      ]);
      if (cachedLesson) {
        return;
      }

      // If next lesson is NOT in cache, bulk download the section to warm it up
      if (nextLesson.section_id) {
        try {
          await fetchSectionData(nextLesson.section_id);
        } catch (error) {
          console.error("Background prefetch failed", error);
        }
      }
    },
    [authData, queryClient, fetchSectionData],
  );

  return {
    downloadSection,
    prefetchActiveSection,
    downloadingSections,
  };
};
