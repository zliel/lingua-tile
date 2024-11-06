import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Button,
  Skeleton,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import dayjs from "dayjs";

const LessonList = () => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const categoryColors = {
    flashcards: "primary",
    practice: "secondary",
    grammar: "warning",
  };
  const categoryRoutes = {
    flashcards: "/flashcards",
    practice: "/practice",
    grammar: "/grammar",
  };

  const {
    data: lessons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lessons", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/lessons/all`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        },
      );
      return response.data;
    },
    onError: () => {
      showSnackbar("Failed to fetch lessons", "error");
    },
    enabled: !!authData,
  });

  const {
    data: sections,
    isLoading: sectionsLoading,
    isError: sectionsError,
  } = useQuery({
    queryKey: ["sections", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/sections/all`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        },
      );

      return response.data;
    },
    onError: () => {
      showSnackbar("Failed to fetch sections", "error");
    },
    enabled: !!authData && !!lessons,
  });

  const {
    data: reviews,
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ["reviews", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/lessons/reviews`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        },
      );

      return response.data;
    },
    onError: () => {
      showSnackbar("Failed to fetch reviews", "error");
    },
    enabled: !!authData,
  });

  if (isLoading || sectionsLoading || reviewsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        {Array.from(new Array(5)).map((_, index) => (
          <Box key={index} sx={{ width: "70%", mb: 2 }}>
            <Skeleton
              variant="rectangular"
              animation={"wave"}
              width="100%"
              height={80}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        ))}
      </Box>
    );
  }

  if (isError || sectionsError || reviewsError) {
    return <Typography>Error loading lessons.</Typography>;
  }

  // Helper function to get review information for a specific lesson
  const getReviewForLesson = (lessonId) => {
    const review = reviews?.find((review) => review.lesson_id === lessonId);
    if (review) {
      const daysLeft = dayjs(review.next_review).diff(dayjs(), "day");
      return {
        daysLeft: daysLeft,
        isOverdue: daysLeft < 0,
      };
    }
    return null;
  };

  // Group together the lessons
  let groupedLessons = {};
  if (sections) {
    groupedLessons = sections.reduce((acc, section) => {
      acc[section.name] = lessons.filter(
        (lesson) => lesson.section_id === section._id,
      );
      return acc;
    }, {});

    // Handle lessons without sections in an "Extras" segment
    groupedLessons["Extras"] = lessons.filter(
      (lesson) =>
        !lesson.section_id ||
        !sections.some((section) => section._id === lesson.section_id),
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Lessons
      </Typography>
      {Object.keys(groupedLessons).map((sectionName) => (
        <Box key={sectionName} sx={{ width: "70%", mb: 4 }}>
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
            groupedLessons[sectionName].map((lesson) => {
              const review = getReviewForLesson(lesson._id);
              return (
                <Box
                  key={lesson._id}
                  sx={{
                    p: 1.5,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    border: `2px solid ${theme.palette.mode === "dark" ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText}`,
                    borderRadius: 2,
                    boxShadow: `0px 0px 5px 0px ${
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.contrastText
                        : theme.palette.secondary.contrastText
                    }`,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="h6">{lesson.title}</Typography>
                    {review && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: review.isOverdue
                            ? theme.palette.error.main
                            : theme.palette.text.secondary,
                        }}
                      >
                        {review.isOverdue
                          ? `Overdue by ${Math.abs(review.daysLeft)} days`
                          : `Next review in ${review.daysLeft} days`}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    color={categoryColors[lesson.category]}
                    component={Link}
                    to={`${categoryRoutes[lesson.category]}/${lesson._id}`}
                  >
                    {lesson.category}
                  </Button>
                </Box>
              );
            })
          ) : (
            <Typography>No lessons available for this section.</Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default LessonList;
