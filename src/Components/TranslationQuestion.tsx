import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  useMediaQuery,
  Fade,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { checkAnswer as checkAnswerUtil } from "@/utils/answerUtils";
import WordBank from "./WordBank";
import FuriganaWord from "./FuriganaWord";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { useTheme } from "@mui/material/styles";

interface Sentence {
  full_sentence: string;
  possible_answers: string[];
  words?: string[];
}

const TranslationQuestion = ({
  sentence,
  allSentences = [],
  onNext,
}: {
  sentence: Sentence;
  allSentences?: Sentence[];
  onNext: () => void;
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>();
  const [randomAnswer, setRandomAnswer] = useState(0); // Random possible answer for when the user is incorrect
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"keyboard" | "word_bank">("word_bank");
  const [showFurigana, setShowFurigana] = useState(true);
  const [availableWords, setAvailableWords] = useState<
    { id: string; text: string }[]
  >([]);
  const [selectedWords, setSelectedWords] = useState<
    { id: string; text: string }[]
  >([]); // For Word Bank mode reconstruction

  // Reset state on each sentence
  useEffect(() => {
    setUserAnswer("");
    setIsCorrect(null);
    setSelectedWords([]);

    // Generate word bank words
    if (sentence.possible_answers && sentence.possible_answers.length > 0) {
      const primaryAnswer = sentence.possible_answers[0];
      const correctWords = primaryAnswer
        .replace(/[.,/#!$%^&*;:{}=\-_`~]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 0);

      // Distractors logic
      const distractors: string[] = [];
      if (allSentences.length > 0) {
        const japaneseRegex =
          /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
        const isJapaneseTarget = japaneseRegex.test(primaryAnswer);

        let candidateWords: string[] = [];

        if (isJapaneseTarget) {
          // Use 'words' (Japanese tokens) from ALL sentences
          // This avoids an issue where a fallback unspaced answer in 'possible_answers' gets treated as a single giant token
          candidateWords = allSentences
            .filter((s) => s.full_sentence !== sentence.full_sentence)
            .flatMap((s) => s.words || [])
            .map((w) => w.replace(/[.,/#!$%^&*;:{}=\-_`~]/g, "")) // Clean punctuation from tokens
            .filter((w) => w.length > 0 && !correctWords.includes(w));
        } else {
          // Target is English: Use 'possible_answers' that aren't Japanese
          candidateWords = allSentences
            .filter((s) => s.full_sentence !== sentence.full_sentence)
            .flatMap((s) => [...s.possible_answers, s.full_sentence])
            .filter((text) => !japaneseRegex.test(text)) // Exclude Japanese text
            .flatMap((text) =>
              text.replace(/[.,/#!$%^&*;:{}=\-_`~]/g, "").split(/\s+/),
            )
            .filter((w) => w.length > 0 && !correctWords.includes(w));
        }

        // Get unique candidates
        const uniqueCandidates = [...new Set(candidateWords)];

        // Shuffle and pick 3
        distractors.push(
          ...uniqueCandidates.sort(() => Math.random() - 0.5).slice(0, 3),
        );
      }

      // Combine and shuffle
      const combinedWords = [...correctWords, ...distractors];
      const shuffled = combinedWords
        .map((w, i) => ({ id: `${w}-${i}-${Math.random()}`, text: w }))
        .sort(() => Math.random() - 0.5);

      setAvailableWords(shuffled);
    }

    if (mode === "keyboard") {
      inputRef.current?.focus();
    }
  }, [sentence, mode, allSentences]);

  // Sync selected words to userAnswer for checking
  useEffect(() => {
    if (mode === "word_bank") {
      // Strip furigana for validation: "学生(がくせい)" -> "学生"
      const cleanText = (text: string) => text.replace(/\(.*\)/g, "");

      // If any word has Japanese characters or furigana syntax, join with "", else " "
      const hasJapanese = selectedWords.some(
        (w) =>
          /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(
            w.text,
          ) || /\(.*\)/.test(w.text),
      );

      const joinChar = hasJapanese ? "" : " ";

      const constructedSentence = selectedWords
        .map((w) => cleanText(w.text))
        .join(joinChar);
      setUserAnswer(constructedSentence);
    }
  }, [selectedWords, mode]);

  const handleWordClick = (
    word: { id: string; text: string },
    fromBank: boolean,
  ) => {
    if (fromBank) {
      // Move from bank to selected
      setAvailableWords((prev) => prev.filter((w) => w.id !== word.id));
      setSelectedWords((prev) => [...prev, word]);
    } else {
      // Move from selected to bank
      setSelectedWords((prev) => prev.filter((w) => w.id !== word.id));
      setAvailableWords((prev) => [...prev, word]);
    }
  };

  const handleReorder = (newOrder: { id: string; text: string }[]) => {
    setSelectedWords(newOrder);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "keyboard" ? "word_bank" : "keyboard"));
    setUserAnswer("");
    setSelectedWords([]);
    if (sentence.possible_answers && sentence.possible_answers.length > 0) {
      const words = sentence.possible_answers[0]
        .replace(/[.,/#!$%^&*;:{}=\-_`~]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 0);
      const shuffled = words
        .map((w, i) => ({ id: `${w}-${i}-${Math.random()}`, text: w }))
        .sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
    }
  };

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

  // Check if the user's answer is correct using the utility function
  const checkAnswer = () => {
    const result = checkAnswerUtil(userAnswer, sentence.possible_answers);

    if (result.isCorrect) {
      setIsCorrect(true);

      // Give specific feedback if it was a fuzzy match
      if (result.isFuzzy) {
        showSnackbar("Close enough!", "success", 1500);
        setTimeout(onNext, 1500);
      } else {
        showSnackbar("Correct!", "success", 500);
        setTimeout(onNext, 500);
      }
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
        m: isMobile ? 1 : 2,
        mb: 1,
        p: 0,
        minWidth: isMobile ? "80vw" : "50vw",
        maxWidth: isMobile ? "90vw" : "50vw",
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
        border: `1px solid ${theme.palette.mode === "dark"
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
          p: isMobile ? 2 : 3,
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
          {sentence.words &&
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(
              sentence.full_sentence,
            ) ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              {sentence.words.map((word, index) => (
                <FuriganaWord key={`${word}-${index}`} text={word} />
              ))}
            </Box>
          ) : (
            sentence.full_sentence
          )}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mb: 1,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={showFurigana}
                onChange={(e) => setShowFurigana(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Furigana
              </Typography>
            }
          />
          <Button
            onClick={toggleMode}
            size="small"
            sx={{ textTransform: "none" }}
          >
            {mode === "keyboard" ? "Switch to Word Bank" : "Switch to Keyboard"}
          </Button>
        </Box>

        {mode === "keyboard" ? (
          <Fade in={true} timeout={300}>
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
          </Fade>
        ) : (
          <Fade in={true} timeout={300}>
            <Box sx={{ width: "100%" }}>
              <WordBank
                availableWords={availableWords}
                selectedWords={selectedWords}
                onWordClick={handleWordClick}
                onReorder={handleReorder}
                isCorrect={isCorrect ?? null}
                showFurigana={showFurigana}
              />
            </Box>
          </Fade>
        )}

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
