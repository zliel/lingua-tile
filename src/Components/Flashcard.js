import React, { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
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

  const handleShowTranslation = () => {
    setIsFlipped(!isFlipped);
    setTimeout(() => {
      onShowTranslation();
    }, 300); // Match the duration of the flip animation
  };

  return (
    <Card
      className="flashcard"
      sx={{
        backgroundColor: isDarkMode
          ? theme.palette.grey[900]
          : theme.palette.grey[300],
        transition: "transform 0.3s ease",
      }}
    >
      <Box className={`flashcard-content ${isFlipped ? "flipped" : ""}`}>
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
          sx={{ mr: 1, width: "80%" }}
        >
          {showTranslation ? "Hide Translation" : "Show Translation"}
        </Button>
        <Button variant="contained" color="secondary" onClick={onNextCard}>
          Next
        </Button>
      </Box>
    </Card>
  );
};

export default Flashcard;
