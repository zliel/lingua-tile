import React, { useEffect } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

const Flashcard = ({
  frontText,
  backText,
  showTranslation,
  onShowTranslation,
  onNextCard,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case " ":
          event.preventDefault(); // Prevent default spacebar scroll behavior
          onShowTranslation();
          break;
        case "Enter":
          onNextCard();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onShowTranslation, onNextCard]);

  return (
    <Card
      sx={{
        maxWidth: 550,
        width: "60%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: 400,
      }}
      elevation={3}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          {frontText}
        </Typography>
        {showTranslation && (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            {backText}
          </Typography>
        )}
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onShowTranslation}
          sx={{ marginRight: 2 }}
        >
          Show Translation
        </Button>
        <Button variant="contained" color="secondary" onClick={onNextCard}>
          Next Card
        </Button>
      </Box>
    </Card>
  );
};

export default Flashcard;
