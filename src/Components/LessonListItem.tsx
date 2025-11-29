import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
// Border colors from @mui/color
import { grey } from "@mui/material/colors";
import { Lesson, ReviewStats } from "@/types/lessons";
import { useAuth } from "@/Contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

type CategoryColor = "primary" | "secondary" | "grammar";

export const LessonListItem = ({
  lesson,
  review,
}: {
  lesson: Lesson;
  review: ReviewStats | null;
}) => {
  const { authData } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
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
      <Box>
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
                ? `overdue by ${Math.abs(review.daysLeft)} days`
                : `next review in ${review.daysLeft} days`}
            </Typography>
          )
        )}
      </Box>
      <Button
        variant="contained"
        color={categoryColors[lesson.category || "flashcards"]}
        sx={{
          mt: isMobile ? 0 : 2,
        }}
        component={Link}
        to={`${categoryRoutes[lesson.category || "flashcards"]}/${lesson._id}`}
      >
        {lesson.category}
      </Button>
    </Box>
  );
};
