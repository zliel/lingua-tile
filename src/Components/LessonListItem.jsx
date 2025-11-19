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

export const LessonListItem = ({ lesson, review }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

  return (
    <Box
      key={lesson._id}
      sx={{
        p: 1.5,
        mb: 2,
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        border: `2px solid ${theme.palette.mode === "dark" ? grey["400"] : grey["a200"]}`,
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
              ? `overdue by ${Math.abs(review.daysLeft)} days`
              : `next review in ${review.daysLeft} days`}
          </Typography>
        )}
      </Box>
      <Button
        variant="contained"
        color={categoryColors[lesson.category]}
        sx={{
          color: theme.palette.mode === "dark" ? "white" : "black",
          mt: 2,
        }}
        component={Link}
        to={`${categoryRoutes[lesson.category]}/${lesson._id}`}
      >
        {lesson.category}
      </Button>
    </Box>
  );
};
