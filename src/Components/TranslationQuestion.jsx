import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useSnackbar } from "../Contexts/SnackbarContext";

const TranslationQuestion = ({ sentence, onNext }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState();
  const { showSnackbar } = useSnackbar();

  const possibleAnswers = sentence.possible_answers.map((answer) =>
    answer.trim().toLowerCase(),
  );

  const checkAnswer = () => {
    if (possibleAnswers.includes(userAnswer.trim().toLowerCase())) {
      setIsCorrect(true);
      showSnackbar("Correct!", "success");
      setTimeout(onNext, 1000);
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
        m: 2,
        p: 2,
        border: 1,
        borderColor:
          isCorrect != null && isCorrect
            ? "success.main"
            : isCorrect != null && !isCorrect
              ? "error.main"
              : "primary.main",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6">{sentence.full_sentence}</Typography>
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
