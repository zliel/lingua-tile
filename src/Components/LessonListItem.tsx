import { Box, Button, Typography, useTheme, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import SyncIcon from "@mui/icons-material/Sync";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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
    flashcards: <ViewCarouselIcon />,
    practice: <EditNoteIcon />,
    grammar: <MenuBookIcon />,
  };

  const color = categoryColors[lesson.category || "flashcards"] || "primary";
  const pending = isPending(lesson._id);

  return (
    <Box
      key={lesson._id}
      sx={{
        p: 2,
        mb: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 2,
        borderRadius: 3,
        border: `3px solid ${theme.palette[color].main}`,
        bgcolor: theme.palette.background.paper,
        backgroundImage: `radial-gradient(${theme.palette.action.hover} 1px, transparent 1px)`,
        backgroundSize: "10px 10px",
        boxShadow: theme.shadows[3],
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        height: "100%",
        justifyContent: "space-between",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[6],
        },
      }}
    >
      {/* Content Area */}
      <Box>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: theme.palette[color].main,
              color: theme.palette[color].contrastText,
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {categoryIcons[lesson.category || "flashcards"]}
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "800",
              lineHeight: 1.2,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: "1rem",
              wordBreak: "break-word",
            }}
          >
            {lesson.title}
          </Typography>
        </Box>

        {/* Status Indicator */}
        <Box
          sx={{
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            p: 1.5,
            border: `2px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Icon Box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: pending
                ? alpha(theme.palette.warning.main, 0.1)
                : review
                  ? review.isOverdue
                    ? alpha(theme.palette.error.main, 0.1)
                    : alpha(theme.palette.success.main, 0.1)
                  : theme.palette.action.hover,
              color: pending
                ? theme.palette.warning.main
                : review
                  ? review.isOverdue
                    ? theme.palette.error.main
                    : theme.palette.success.main
                  : theme.palette.text.secondary,
            }}
          >
            {pending ? (
              <SyncIcon />
            ) : review ? (
              review.isOverdue ? (
                <WarningIcon />
              ) : (
                <CheckCircleIcon />
              )
            ) : (
              <AddIcon />
            )}
          </Box>

          {/* Status Text */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "0.8rem",
              }}
            >
              {pending
                ? "Pending Sync"
                : isReviewLoading
                  ? "Loading..."
                  : review
                    ? review.isOverdue
                      ? "Overdue"
                      : "On Track"
                    : "New Lesson"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1.1, display: "block" }}
            >
              {pending
                ? "Waiting for connection"
                : review
                  ? review.isOverdue
                    ? `Due ${Math.abs(review.daysLeft)} day(s) ago`
                    : `Next review in ${review.daysLeft} day(s)`
                  : "Ready to start"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        color={color as any}
        onClick={() => {
          onLessonStart(lesson);
          navigate(
            `${categoryRoutes[lesson.category || "flashcards"]}/${lesson._id}`,
          );
        }}
        startIcon={<PlayArrowIcon />}
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: 2,
          fontWeight: "bold",
          transition: "all 0.1s",
        }}
      >
        Start Lesson
      </Button>
    </Box>
  );
};
