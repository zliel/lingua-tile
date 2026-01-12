import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FlipCameraAndroid from "@mui/icons-material/FlipCameraAndroid";
import ArrowForward from "@mui/icons-material/ArrowForward";
import "./Flashcard.css";

interface FlashcardProps {
  frontText: string;
  backText: string;
  onNextCard: () => void;
  onPreviousCard: () => void;
}

const Flashcard = ({
  frontText,
  backText,
  onNextCard,
  onPreviousCard,
}: FlashcardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";
  const [isFlipped, setIsFlipped] = useState(false);

  const handleShowTranslation = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleNextCard = useCallback(() => {
    setIsFlipped(false);
    onNextCard();
  }, [onNextCard]);

  const handlePreviousCard = useCallback(() => {
    setIsFlipped(false);
    onPreviousCard();
  }, [onPreviousCard]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        return handleShowTranslation();
      }

      if (["Enter", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
        return handleNextCard();
      }
      if (event.code === "ArrowLeft") {
        event.preventDefault();
        return handlePreviousCard();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleNextCard, handleShowTranslation]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Card
        className="flashcard"
        sx={{
          backgroundColor: isDarkMode
            ? "rgba(30, 30, 30, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: 4,
          boxShadow: isDarkMode
            ? "0 8px 32px 0 rgba(0, 0, 0, 0.5)"
            : "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          border: `1px solid ${
            isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.4)"
          }`,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: isMobile ? "none" : "translateY(-5px)",
            boxShadow: isDarkMode
              ? "0 12px 40px 0 rgba(0, 0, 0, 0.6)"
              : "0 12px 40px 0 rgba(31, 38, 135, 0.2)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            width: "100%",
            perspective: "1000px",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box
            className={`flashcard-content ${isFlipped ? "flipped" : ""}`}
            onClick={handleShowTranslation}
            sx={{ height: "100%", width: "100%", textAlign: "center" }}
          >
            {/* Front Side */}
            <CardContent
              className="flashcard-front"
              sx={{ display: isFlipped ? "none" : "", p: 0 }}
            >
              <Typography
                component="div"
                sx={{
                  fontSize: isMobile ? "2rem" : "2.25rem",
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                {frontText}
              </Typography>
            </CardContent>

            {/* Back Side */}
            <CardContent
              className="flashcard-back"
              sx={{ display: isFlipped ? "" : "none", p: 0 }}
            >
              <Typography
                component="div"
                sx={{
                  fontSize: isMobile ? "2rem" : "2.25rem",
                  fontWeight: 400,
                  color: theme.palette.text.primary,
                }}
              >
                {backText}
              </Typography>
            </CardContent>
          </Box>
          <Typography
            variant="caption"
            sx={{
              width: "100%",
              textAlign: "center",
              opacity: 0.6,
              pointerEvents: "none",
            }}
          >
            {isMobile ? "Tap" : "Click"} to flip
          </Typography>
        </Box>

        {/* Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            gap: 4,
            mt: "auto",
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: isDarkMode
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
          }}
        >
          <Tooltip title="Flip Card (Space)">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleShowTranslation();
              }}
              size="large"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
                width: 56,
                height: 56,
              }}
            >
              <FlipCameraAndroid fontSize="medium" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Next Card (Enter / Right Arrow)">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleNextCard();
              }}
              size="large"
              sx={{
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                "&:hover": {
                  bgcolor: theme.palette.secondary.dark,
                },
                width: 56,
                height: 56,
              }}
            >
              <ArrowForward fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Box>
      </Card>
    </div>
  );
};

export default Flashcard;
