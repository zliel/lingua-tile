import { useState, JSX } from "react";
import { Button, Popover, Typography, Box, useTheme, useMediaQuery, alpha } from "@mui/material";
import { Lesson, ReviewStats } from "@/types/lessons";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
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
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              border: `3px solid ${theme.palette[color].main}`,
              bgcolor: theme.palette.background.paper,
              backgroundImage: `radial-gradient(${theme.palette.action.focus} 1px, transparent 1px)`,
              backgroundSize: '10px 10px',
              overflow: 'visible', // Allow button 3D effect to not clip if needed
              mt: 1,
              boxShadow: theme.shadows[5],
            }
          }
        }}
      >
        <Box sx={{ p: 2, minWidth: 260, maxWidth: 300 }}>
          {/* Header: Icon + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: theme.palette[color].main,
                color: theme.palette[color].contrastText,
                boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.2)"
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
                fontSize: "1rem"
              }}
            >
              {lesson.title}
            </Typography>
          </Box>

          {/* Stats Panel */}
          <Box
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              p: 2,
              mb: 2,
              border: `2px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textAlign: 'left'
            }}
          >
            {/* Status Icon */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: review
                ? review.isOverdue ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1)
                : theme.palette.action.hover,
              color: review
                ? review.isOverdue ? theme.palette.error.main : theme.palette.success.main
                : theme.palette.text.secondary
            }}>
              {review
                ? review.isOverdue
                  ? <WarningIcon fontSize="large" />
                  : <CheckCircleIcon fontSize="large" />
                : <AddIcon fontSize="large" />
              }
            </Box>

            {/* Status Text */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase', lineHeight: 1.1 }}>
                {review
                  ? review.isOverdue ? "Overdue" : "On Track"
                  : "New Lesson"
                }
              </Typography>
              <Typography variant="caption" color={review ? (review.isOverdue ? "error" : "success.main") : "textSecondary"}>
                {review
                  ? review.isOverdue
                    ? `Due ${Math.abs(review.daysLeft)} day(s) ago`
                    : `Next review in ${review.daysLeft} day(s)`
                  : "Ready to start"}
              </Typography>
            </Box>
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
            sx={{
              borderRadius: 2,
              py: 1,
              fontWeight: 'bold',
              boxShadow: `0 4px 0 ${theme.palette[color].dark}`, // 3D Button
              transition: 'all 0.1s',
              "&:active": {
                boxShadow: `0 0 0 ${theme.palette[color].dark}`,
                transform: 'translateY(4px)',
              },
              "&:hover": {
                transform: `translateY(-1px)`,
                boxShadow: `0 5px 0 ${theme.palette[color].dark}`,
              }
            }}
          >
            Start Lesson
          </Button>
        </Box>
      </Popover >
    </>
  );
};
