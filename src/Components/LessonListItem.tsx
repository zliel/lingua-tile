import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// Border colors from @mui/color
import { grey } from "@mui/material/colors";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import { Lesson, ReviewStats } from "@/types/lessons";
import { useAuth } from "@/Contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useOffline } from "@/Contexts/OfflineContext";
import { JSX } from "react";

type CategoryColor = "primary" | "secondary" | "grammar";

export const LessonListItem = ({
  lesson,
  review,
  onLessonStart,
}: {
  lesson: Lesson;
  review: ReviewStats | null;
  onLessonStart: (lesson: Lesson) => void;
}) => {
  const { authData } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const { isPending } = useOffline();
  const navigate = useNavigate();

  const isReviewLoading =
    queryClient.isFetching({
      queryKey: ["reviews", authData?.token],
    }) > 0;

  const categoryColors: Record<string, CategoryColor> = {
    flashcards: "primary",
    practice: "secondary",
    grammar: "grammar",
  };

  const categoryRoutes = {
    flashcards: "/flashcards",
    practice: "/practice",
    grammar: "/grammar",
  };

  const categoryIcons: Record<string, JSX.Element> = {
    flashcards: <ViewCarouselIcon sx={{ mb: 0.2 }} />,
    practice: <EditNoteIcon />,
    grammar: <MenuBookIcon sx={{ mb: 0.3 }} />,
  };

  return (
    <Box
      key={lesson._id}
      sx={{
        p: 1.5,
        mb: 2,
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        alignItems: isMobile ? "center" : "flex-start",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        gap: 2,
        border: `2px solid ${theme.palette.mode === "dark" ? grey["400"] : grey["200"]}`,
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
      <Box width={isMobile ? "60%" : "100%"}>
        <Typography variant="h6" fontSize={"clamp(1.1rem, 2vw, 1.3rem)"}>
          {lesson.title}
        </Typography>
        {isReviewLoading ? (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            Loading review...
          </Typography>
        ) : isPending(lesson._id) ? (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.warning.main, fontWeight: "bold" }}
          >
            Pending Sync
          </Typography>
        ) : (
          review && (
            <Typography
              variant="body2"
              sx={{
                color: review.isOverdue
                  ? theme.palette.error.main
                  : theme.palette.text.secondary,
              }}
            >
              {review.isOverdue
                ? `overdue by ${Math.abs(review.daysLeft)} day${review.daysLeft > 1 ? "s" : ""}`
                : `next review in ${review.daysLeft} day${review.daysLeft !== 1 ? "s" : ""}`}
            </Typography>
          )
        )}
      </Box>
      <Button
        variant="contained"
        color={categoryColors[lesson.category || "flashcards"]}
        sx={{
          mt: isMobile ? 0 : 2,
          minWidth: isMobile ? "40%" : "auto",
        }}
        onClick={() => {
          onLessonStart(lesson);
          navigate(
            `${categoryRoutes[lesson.category || "flashcards"]}/${lesson._id}`,
          );
        }}
      >
        {categoryIcons[lesson.category || "flashcards"]} &nbsp;
        {lesson.category}
      </Button>
    </Box>
  );
};
