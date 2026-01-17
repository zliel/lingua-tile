import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { Lesson } from "@/types/lessons";
import { useCallback, useState } from "react";
import { api } from "@/utils/apiClient";

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
      const response = await api.get<{ lessons: Lesson[]; cards: any[] }>(
        `/api/sections/${sectionId}/download`
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

  const prefetchLessonComponents = async (lessons: Lesson[]) => {
    const categories = new Set(lessons.map((l) => l.category));
    const promises: Promise<any>[] = [];

    if (categories.has("flashcards")) {
      promises.push(import("../Routes/FlashcardLesson"));
    }
    if (categories.has("practice")) {
      promises.push(import("../Routes/PracticeLesson"));
    }
    if (categories.has("grammar")) {
      promises.push(import("../Routes/GrammarLesson"));
    }

    try {
      await Promise.all(promises);
      console.log("Prefetched lesson components:", Array.from(categories));
    } catch (e) {
      console.error("Failed to prefetch lesson components", e);
    }
  };

  const downloadSection = useCallback(
    async (sectionId: string) => {
      if (!navigator.onLine) {
        showSnackbar("You must be online to download lessons.", "error");
        return;
      }

      setDownloadingSections((prev) => ({ ...prev, [sectionId]: true }));

      try {
        const count = await fetchSectionData(sectionId);

        // After data is fetched, prefetch the code chunks
        // We find the lessons in the cache that match the section ID
        const queries = queryClient.getQueriesData({ queryKey: ["lesson"] });

        // Since fetchSectionData puts them in cache, we can just look at all lessons in cache
        // and filter by sectionId.
        const relevantLessons = queries
          .map(([_, data]) => data as Lesson)
          .filter((l) => l.section_id === sectionId);

        if (relevantLessons.length > 0) {
          prefetchLessonComponents(relevantLessons);
        }

        showSnackbar(`Downloaded ${count} lessons for offline use.`, "success");
      } catch (error) {
        console.error(error);
        showSnackbar("Failed to download lessons.", "error");
      } finally {
        setDownloadingSections((prev) => ({ ...prev, [sectionId]: false }));
      }
    },
    [fetchSectionData, showSnackbar, queryClient],
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
