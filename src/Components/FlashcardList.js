import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import Flashcard from "./Flashcard";
import { useTheme } from "@mui/material/styles";
import useLessonReview from "../hooks/useLessonReview";
import ReviewModal from "../Components/ReviewModal";

const FlashcardList = ({ lessonId }) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isEnglishToJapanese, setIsEnglishToJapanese] = useState(true);
  const [hasFinished, setHasFinished] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { handlePerformanceReview } = useLessonReview(
    lessonId,
    modalOpen,
    setModalOpen,
  );

  const {
    data: flashcards = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["flashcards", lessonId, authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/cards/lesson/${lessonId}`,
      );
      return response.data;
    },
    enabled: !!authData,
  });

  useEffect(() => {
    setIsEnglishToJapanese(Math.random() < 0.5);
  }, [currentCardIndex]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Skeleton
          animation={"wave"}
          variant="rectangular"
          width="70%"
          height={80}
          sx={{ borderRadius: 2, mb: 2 }}
        />
        <Skeleton
          animation={"wave"}
          variant="rectangular"
          width="70%"
          height={160}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error loading flashcards.</Typography>;
  }

  const handleNextCard = () => {
    setShowTranslation(false);

    setTimeout(() => {
      if (currentCardIndex + 1 === flashcards.length) {
        // NOTE: Disallows reviewing when not logged in
        if (authData.isLoggedIn) {
          showSnackbar("You have reached the end of the lesson!", "success");
          setHasFinished(true);
          setCurrentCardIndex(0);
          setModalOpen(true);
        } else {
          showSnackbar(
            "Please log in to complete the lesson to get personalized lesson scheduling.",
            "info",
          );
          setHasFinished(false);
          setCurrentCardIndex(0);
        }
      } else {
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
      }
    }, 10);
  };

  const handleShowTranslation = () => {
    setShowTranslation((prevShowTranslation) => !prevShowTranslation);
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: isMobile ? 2 : 4,
        width: isMobile ? "100%" : "auto",
        px: isMobile ? 1 : 0,
      }}
    >
      {authData && (
        <>
          <Flashcard
            frontText={
              isEnglishToJapanese
                ? currentCard?.back_text
                : currentCard?.front_text
            }
            backText={
              isEnglishToJapanese
                ? currentCard?.front_text
                : currentCard?.back_text
            }
            showTranslation={showTranslation}
            onShowTranslation={handleShowTranslation}
            onNextCard={handleNextCard}
          />
          <Stack
            direction={"row"}
            sx={{
              display: "flex",
              width: isMobile ? "100%" : "90%",
              alignItems: "center",
            }}
          >
            <LinearProgress
              variant="determinate"
              value={
                // Keep the progress at 100% if they finished, but allow them to keep reviewing
                hasFinished ? 100 : (currentCardIndex / flashcards.length) * 100
              }
              sx={{
                width: isMobile ? "100%" : "95%",
                height: isMobile ? 4 : 5,
                borderRadius: 2,
                mt: 1.1,
                ml: isMobile ? 2.5 : 1,
                "& .MuiLinearProgress-bar": {
                  background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                },
              }}
            />
            <Zoom in={hasFinished} easing={"ease"} timeout={500}>
              <Typography
                sx={{
                  mt: 0.8,
                  color: "transparent",
                  textShadow: `0 0 0 ${theme.palette.secondary.dark}`,
                }}
                variant={"h5"}
              >
                🔥
              </Typography>
            </Zoom>
          </Stack>
        </>
      )}
      <ReviewModal
        open={modalOpen}
        setOpen={setModalOpen}
        handlePerformanceReview={handlePerformanceReview}
      />
    </Box>
  );
};

export default FlashcardList;
