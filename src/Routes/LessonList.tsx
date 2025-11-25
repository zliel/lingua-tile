import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Fade,
  Typography,
  useTheme,
  Divider,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import dayjs from "dayjs";
import { LessonListItem } from "../Components/LessonListItem";
import { LessonListSkeleton } from "../Components/LessonListSkeleton";
import { Lesson, Review, ReviewStats } from "@/types/lessons";
import { Section } from "@/types/sections";

const LessonList = () => {
  const [showLoaded, setShowLoaded] = useState(false);
  const { authData, authIsLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: lessons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lessons", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/all`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
      return response.data;
    },
    enabled: !!authData,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    showSnackbar("Failed to fetch lessons", "error");
  }

  const {
    data: sections,
    isLoading: sectionsLoading,
    isError: sectionsError,
  } = useQuery({
    queryKey: ["sections", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/sections/all`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );

      return response.data;
    },
    enabled: !!authData,
    staleTime: 5 * 60 * 1000,
  });

  if (sectionsError) {
    showSnackbar("Failed to fetch sections", "error");
  }

  const { data: reviews, isError: reviewsError } = useQuery({
    queryKey: ["reviews", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/reviews`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );

      return response.data;
    },
    enabled: !authIsLoading && !!authData,
    staleTime: 5 * 60 * 1000,
  });

  if (reviewsError && authData?.token) {
    showSnackbar("Failed to fetch reviews", "error");
  }

  // Manage the animation in-between loading and loaded
  useEffect(() => {
    if (isLoading || sectionsLoading) {
      setShowLoaded(false);
    } else {
      const timer = setTimeout(() => setShowLoaded(true), 250);
      return () => clearTimeout(timer);
    }
  }, [isLoading, sectionsLoading]);

  if (isError || sectionsError || (reviewsError && authData?.token)) {
    return <Typography>Error loading lessons.</Typography>;
  }

  // Helper function to get review information for a specific lesson
  const getReviewForLesson = (lessonId: string): ReviewStats | null => {
    const review = reviews?.find(
      (review: Review) => review.lesson_id === lessonId,
    );
    if (review) {
      const daysLeft = dayjs(review.next_review_date).diff(dayjs(), "day");
      return {
        daysLeft: daysLeft,
        isOverdue: daysLeft < 0,
      };
    }
    return null;
  };

  // Group together the lessons
  let groupedLessons: Record<string, Lesson[]> = {};
  if (sections && lessons) {
    groupedLessons = sections.reduce(
      (acc: Record<string, Lesson[]>, section: Section) => {
        if (!section || !section.name) return acc;
        acc[section.name] = lessons.filter(
          (lesson: Lesson) => lesson.section_id === section._id,
        );
        return acc;
      },
      {},
    );

    // Handle lessons without sections in an "Extras" segment
    groupedLessons["Extras"] = lessons.filter(
      (lesson: Lesson) =>
        !lesson.section_id ||
        !sections.some((section: Section) => section._id === lesson.section_id),
    );
  }

  return (
    <>
      <Fade in={isLoading || sectionsLoading} timeout={100} unmountOnExit>
        <div>
          <LessonListSkeleton />
        </div>
      </Fade>
      <Fade in={showLoaded} timeout={100} unmountOnExit>
        <Box
          sx={{
            display: showLoaded && (lessons || sections) ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography
            sx={{ display: showLoaded ? "block" : "none" }}
            variant="h4"
            gutterBottom
          >
            Lessons
          </Typography>
          {Object.keys(groupedLessons).map((sectionName) => (
            <Box
              key={sectionName}
              sx={{ width: isMobile ? "90%" : "70%", mb: 4 }}
            >
              <Typography variant="h5" gutterBottom>
                {sectionName}
              </Typography>
              <Divider
                sx={{
                  width: "33%",
                  mb: 2,
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "primary.dark"
                      : "primary.light",
                  borderWidth: "1px",
                }}
              />
              {groupedLessons[sectionName].length > 0 ? (
                isMobile ? (
                  groupedLessons[sectionName].map((lesson) => {
                    const review = getReviewForLesson(lesson._id);
                    return (
                      <Box key={lesson._id} sx={{ mb: 2 }}>
                        <LessonListItem
                          lesson={lesson}
                          review={review || null}
                        />
                      </Box>
                    );
                  })
                ) : (
                  <Grid container spacing={2}>
                    {groupedLessons[sectionName].map((lesson) => {
                      const review = getReviewForLesson(lesson._id);
                      return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lesson._id}>
                          <LessonListItem lesson={lesson} review={review} />
                        </Grid>
                      );
                    })}
                  </Grid>
                )
              ) : (
                <Typography>No lessons available for this section.</Typography>
              )}
            </Box>
          ))}
        </Box>
      </Fade>
    </>
  );
};

export default LessonList;
