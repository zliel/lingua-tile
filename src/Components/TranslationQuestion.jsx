import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useTheme } from "@mui/material/styles";

const TranslationQuestion = ({ sentence, onNext }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState();
  const [randomAnswer, setRandomAnswer] = useState(0); // Random possible answer for when the user is incorrect
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef(null);

  // Reset state on each sentence
  useEffect(() => {
    setUserAnswer("");
    setIsCorrect(null);
    inputRef.current.focus();
  }, [sentence]);

  // Listener for the enter key if the input is focused
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Enter") {
        event.preventDefault();
        checkAnswer();
      }
    };

    const currentInput = inputRef.current;

    currentInput.addEventListener("keydown", handleKeyPress);
    return () => {
      // NOTE: linting fix
      if (currentInput) {
        currentInput.removeEventListener("keydown", handleKeyPress);
      }
    };
  });

  // Helper function to remove punctuation and extra spaces, and make it lowercase
  const cleanString = (inputString) => {
    return inputString
      .trim()
      .toLowerCase()
      .replaceAll(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
  };

  const possibleAnswers = sentence.possible_answers.map((answer) =>
    // remove all punctuation and make lowercase
    cleanString(answer),
  );

  // Check if the user's answer is correct by comparing it to all answers in the sentence's possible_answers array
  const checkAnswer = () => {
    if (possibleAnswers.includes(cleanString(userAnswer))) {
      setIsCorrect(true);
      // NOTE: Shortened timeout to 500ms for quicker feedback and to allow
      // the "please login" snackbar to show before moving to the next sentence
      showSnackbar("Correct!", "success", 500);
      setTimeout(onNext, 500);
    } else {
      // Select a random answer to show the user if they are incorrect
      setRandomAnswer(
        Math.floor(Math.random() * sentence.possible_answers.length),
      );
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
        m: isMobile ? 1 : 8,
        p: isMobile ? 2 : 4,
        minWidth: isMobile ? "95%" : "50%",
        maxWidth: isMobile ? "100%" : "600px",
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
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Typography variant="h6">
        Please translate this sentence:
        <br /> {sentence.full_sentence}
      </Typography>
      <TextField
        label="Translate to English"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        sx={{ mt: 2, width: "100%" }}
        inputRef={inputRef}
      />
      <Button onClick={checkAnswer} variant="contained" sx={{ mt: 2 }}>
        Submit
      </Button>
      {isCorrect !== null && !isCorrect && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          Incorrect! One correct answer is: "
          {sentence.possible_answers[randomAnswer]}"
        </Typography>
      )}
    </Box>
  );
};

export default TranslationQuestion;
