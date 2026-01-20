import { useAuth } from "@/Contexts/AuthContext";
import { useLessons, useReviews, useSections } from "@/hooks/useLessons";
import { Lesson, Review, ReviewStats } from "@/types/lessons";
import dayjs from "dayjs";

import { Section } from "@/types/sections";

export interface JourneyRow {
  index: number;
  lessons: Lesson[];
  offsetY: number;
  sectionStartTitle?: string;
  sectionId?: string;
}

export const useJourneyData = () => {
  const { authData } = useAuth();
  const ROW_HEIGHT = 120;

  const { data: lessons = [], isLoading: isLoadingLessons } =
    useLessons(authData);
  const { data: sections = [] } = useSections(authData);
  const { data: reviews = [] } = useReviews(authData);

  // Helper function to get whether the review is overdue
  const getLessonReviewStatus = (lessonId: string): ReviewStats | null => {
    const review: Review | undefined = reviews?.find(
      (r: Review) => r.lesson_id === lessonId,
    );
    if (!review) return null;
    const daysLeft = dayjs(review.next_review).diff(dayjs(), "day");
    return {
      daysLeft,
      isOverdue: daysLeft < 0,
    };
  };

  // Logic to line up two lessons with the same order index in the same section
  const journeyRows: JourneyRow[] = [];
  const extraRows: JourneyRow[] = [];

  if (lessons.length > 0) {
    const mainLessons = lessons.filter((l: Lesson) => l.section_id);
    const extraLessons = lessons.filter((l: Lesson) => !l.section_id);

    let currentY = 50;
    let lastSectionId = "";

    const processListToRows = (list: Lesson[], targetArray: JourneyRow[]) => {
      const sorted = [...list].sort((a, b) => {
        const orderA = a.order_index || 0;
        const orderB = b.order_index || 0;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.title.localeCompare(b.title);
      });


      const grouped = new Map<number, Lesson[]>();

      sorted.forEach((lesson) => {
        const idx = lesson.order_index || 0;
        if (!grouped.has(idx)) grouped.set(idx, []);
        grouped.get(idx)?.push(lesson);
      });

      Array.from(grouped.keys())
        .sort((a, b) => a - b)
        .forEach((idx) => {
          const rowLessons = grouped.get(idx) || [];

          // Determine if this is the start of a new section
          let sectionTitle = undefined;
          const currentSectionId = rowLessons[0]?.section_id;

          if (currentSectionId) {
            if (currentSectionId !== lastSectionId) {
              lastSectionId = currentSectionId;
              const section = sections.find(
                (s: Section) => s._id === currentSectionId,
              );
              if (section) {
                sectionTitle = section.name;
                console.log(
                  `[JourneyData] Found Section Start: ${sectionTitle} for row ${idx}`,
                );
              } else {
                console.warn(
                  `[JourneyData] Section ID ${currentSectionId} not found in sections list`,
                  sections,
                );
              }
            }
          }

          targetArray.push({
            index: idx,
            lessons: rowLessons,
            offsetY: currentY,
            sectionStartTitle: sectionTitle,
            sectionId: currentSectionId,
          });
          currentY += ROW_HEIGHT;
        });
    };

    processListToRows(mainLessons, journeyRows);

    if (extraLessons.length > 0) {
      currentY += 50; // Divider space
    }
    processListToRows(extraLessons, extraRows);
  }

  return {
    journeyRows,
    extraRows,
    isLoading: isLoadingLessons,
    getLessonReviewStatus,
  };
};
