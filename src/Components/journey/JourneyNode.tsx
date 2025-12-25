import { useState, JSX } from "react";
import { Button, Popover, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { Lesson, ReviewStats } from "@/types/lessons";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

interface JourneyNodeProps {
  lesson: Lesson;
  review: ReviewStats | null;
}

type CategoryColor = "primary" | "secondary" | "grammar";

export const JourneyNode = ({ lesson, review }: JourneyNodeProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const categoryColors: Record<string, CategoryColor> = {
    flashcards: "primary",
    practice: "secondary",
    grammar: "grammar",
  };

  const categoryIcons: Record<string, JSX.Element> = {
    flashcards: <ViewCarouselIcon fontSize={isMobile ? "small" : "medium"} />,
    practice: <EditNoteIcon fontSize={isMobile ? "small" : "medium"} />,
    grammar: <MenuBookIcon fontSize={isMobile ? "small" : "medium"} />,
  };

  const categoryRoutes = {
    flashcards: "/flashcards",
    practice: "/practice",
    grammar: "/grammar",
  };

  const color = categoryColors[lesson.category || "flashcards"] || "primary";

  return (
    <>
      <Button
        variant="contained"
        color={color}
        onClick={handleClick}
        sx={{
          borderRadius: 4,
          px: isMobile ? 1 : 3,
          py: 1.5,
          width: "100%",
          minWidth: 0,
          minHeight: 44,
          textTransform: "none",
          fontWeight: "bold",
          boxShadow: theme.shadows[4],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? 0.5 : 1,
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        {categoryIcons[lesson.category || "flashcards"]}
        <Typography
          variant={isMobile ? "caption" : "body2"}
          sx={{
            fontWeight: "bold",
            lineHeight: 1.1,
            textAlign: "center"
          }}
        >
          {lesson.title}
        </Typography>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, minWidth: 200, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            {lesson.title}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {review
                ? review.isOverdue
                  ? `Overdue by ${Math.abs(review.daysLeft)} days`
                  : `Next review in ${review.daysLeft} days`
                : "Not started yet"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color={color}
            fullWidth
            startIcon={<PlayArrowIcon />}
            onClick={() => {
              navigate(`${categoryRoutes[lesson.category || "flashcards"]}/${lesson._id}`);
              handleClose();
            }}
            sx={{ opacity: 1 }}
          >
            Start Lesson
          </Button>
        </Box>
      </Popover >
    </>
  );
};
