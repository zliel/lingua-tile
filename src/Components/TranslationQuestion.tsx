import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useTheme } from "@mui/material/styles";

interface Sentence {
  full_sentence: string;
  possible_answers: string[];
}

const TranslationQuestion = ({
  sentence,
  onNext,
}: {
  sentence: Sentence;
  onNext: () => void;
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>();
  const [randomAnswer, setRandomAnswer] = useState(0); // Random possible answer for when the user is incorrect
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state on each sentence
  useEffect(() => {
    setUserAnswer("");
    setIsCorrect(null);
    inputRef.current?.focus();
  }, [sentence]);

  // Listener for the enter key if the input is focused
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        event.preventDefault();
        checkAnswer();
      }
    };

    const currentInput = inputRef.current;

    currentInput?.addEventListener("keydown", handleKeyPress);
    return () => {
      currentInput?.removeEventListener("keydown", handleKeyPress);
    };
  });

  // Helper function to remove punctuation and extra spaces, and make it lowercase
  const cleanString = (inputString: string) => {
    return inputString
      .trim()
      .toLowerCase()
      .replaceAll(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
  };

  const possibleAnswers = sentence.possible_answers.map((answer) =>
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
    <Card
      className={isCorrect === false ? "shake" : ""}
      sx={{
        m: isMobile ? 1 : 8,
        p: 0,
        minWidth: isMobile ? "95%" : "50%",
        maxWidth: isMobile ? "100%" : "600px",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(30, 30, 30, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderRadius: 4,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 8px 32px 0 rgba(0, 0, 0, 0.5)"
            : "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.4)"
        }`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: isMobile ? "none" : "translateY(-5px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 12px 40px 0 rgba(0, 0, 0, 0.6)"
              : "0 12px 40px 0 rgba(31, 38, 135, 0.2)",
        },
      }}
    >
      <Box
        sx={{
          p: isMobile ? 3 : 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 2,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: "0.8rem",
          }}
        >
          Translate this sentence
        </Typography>

        <Typography
          variant="h4"
          component="div"
          align="center"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: theme.palette.text.primary,
            fontSize: isMobile ? "1.5rem" : "2rem",
          }}
        >
          {sentence.full_sentence}
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your answer in English..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          inputRef={inputRef}
          error={isCorrect === false}
          disabled={isCorrect === true}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.02)",
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              },
            },
          }}
        />

        <Button
          onClick={checkAnswer}
          variant="contained"
          size="large"
          fullWidth
          color={
            isCorrect === true
              ? "success"
              : isCorrect === false
                ? "error"
                : "primary"
          }
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: "bold",
            textTransform: "none",
            transition: "all 0.3s ease",
          }}
        >
          {isCorrect === true
            ? "Correct!"
            : isCorrect === false
              ? "Try Again"
              : "Check Answer"}
        </Button>

        {isCorrect !== null && !isCorrect && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              width: "100%",
              borderRadius: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(211, 47, 47, 0.1)"
                  : "rgba(211, 47, 47, 0.05)",
              border: `1px solid ${theme.palette.error.main}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: "fadeIn 0.3s ease-in",
            }}
          >
            <Typography
              variant="subtitle1"
              color="error"
              fontWeight="bold"
              gutterBottom
            >
              Incorrect
            </Typography>
            <Typography variant="body1" color="text.primary" align="center">
              One correct answer is: <br />
              <Box component="span" fontWeight="bold" color="success.main">
                "{sentence.possible_answers[randomAnswer]}"
              </Box>
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default TranslationQuestion;
