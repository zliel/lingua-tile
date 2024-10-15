import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useTheme } from "@mui/material/styles";

const TranslationQuestion = ({ sentence, onNext }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();

  useEffect(() => {
    setUserAnswer("");
    setIsCorrect(null);
  }, [sentence]);

  const possibleAnswers = sentence.possible_answers.map((answer) =>
    answer.trim().toLowerCase(),
  );

  const checkAnswer = () => {
    if (possibleAnswers.includes(userAnswer.trim().toLowerCase())) {
      setIsCorrect(true);
      showSnackbar("Correct!", "success");
      setTimeout(onNext, 500);
    } else {
      setIsCorrect(false);
      showSnackbar("Incorrect", "error");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        m: 8,
        p: 4,
        border: 1,
        borderColor:
          isCorrect != null && isCorrect
            ? "success.main"
            : isCorrect != null && !isCorrect
              ? "error.main"
              : "primary.main",
        borderRadius: 2,
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[100],
      }}
    >
      <Typography variant="h6">
        Please translate this sentence: {sentence.full_sentence}
      </Typography>
      <TextField
        label="Translate to English"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        sx={{ mt: 2, width: "100%" }}
      />
      <Button onClick={checkAnswer} variant="contained" sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

export default TranslationQuestion;
