import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Fade,
  Slide,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./Flashcard.css";

const Flashcard = ({
  frontText,
  backText,
  showTranslation,
  onShowTranslation,
  onNextCard,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideIn, setSlideIn] = useState(true);

  const handleShowTranslation = () => {
    setIsFlipped(!isFlipped);
    setTimeout(() => {
      onShowTranslation();
    }, 300); // Match the duration of the flip animation
  };

  const handleNextCard = () => {
    setSlideIn(false);
    setTimeout(() => {
      onNextCard();
      setSlideIn(true);
      // The timeout should be longer than the duration of the slide animation
      // So that the first slide animation is done before the second one starts
    }, 350);
  };

  return (
    <Slide
      direction={slideIn ? "left" : "right"}
      in={slideIn}
      timeout={300}
      mountOnEnter
      easing={"ease"}
      sx={{
        transform: slideIn ? "translateX(100vw)" : "translateX(-100vw)",
      }}
    >
      <div>
        <Fade in={slideIn} timeout={300} easing={"ease"}>
          <div>
            <Card
              className="flashcard"
              sx={{
                backgroundColor: isDarkMode
                  ? theme.palette.grey[900]
                  : theme.palette.grey[100],
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
              elevation={8}
            >
              <Box
                className={`flashcard-content ${isFlipped ? "flipped" : ""}`}
                onClick={handleShowTranslation}
              >
                <CardContent
                  className="flashcard-front"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" component="div">
                    {frontText}
                  </Typography>
                </CardContent>
                <CardContent
                  className="flashcard-back"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" component="div">
                    {backText}
                  </Typography>
                </CardContent>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 2,
                  backgroundColor: theme.palette.action.hover,
                  borderTop: "1px solid",
                  borderColor: theme.palette.divider,
                  mt: "auto",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleShowTranslation}
                  sx={{ m: "auto", width: "45%" }}
                >
                  {showTranslation ? "Hide Translation" : "Show Translation"}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNextCard}
                  sx={{ m: "auto", width: "45%" }}
                >
                  Next Card
                </Button>
              </Box>
            </Card>
          </div>
        </Fade>
      </div>
    </Slide>
  );
};

export default Flashcard;
