import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  LinearProgress,
  Skeleton,
  Typography,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import Flashcard from "./Flashcard";
import { useTheme } from "@mui/material/styles";
import ReviewModal from "./ReviewModal";
import { Card } from "@/types/cards";

const FlashcardList = ({ lessonId }: { lessonId: string }) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [shuffledFlashcards, setShuffledFlashcards] = useState<Card[]>([]);
  const [hasFinished, setHasFinished] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: flashcards = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["flashcards", lessonId, authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/cards/lesson/${lessonId}`,
      );
      return response.data;
    },
    enabled: !!authData,
  });

  const { data: review, isLoading: isReviewLoading } = useQuery({
    queryKey: ["review", lessonId, authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/review/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
      return response.data;
    },
    initialData: () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }
      return undefined;
    },
    retry: false,
    enabled: !!authData,
  });

  useEffect(() => {
    if (flashcards.length === 0) return;

    if (review && flashcards.length > 0) {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setShuffledFlashcards(shuffled);
    } else {
      setShuffledFlashcards([...flashcards]);
    }
  }, [review, flashcards]);

  if (isLoading || isReviewLoading) {
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
    setTimeout(() => {
      if (currentCardIndex + 1 === shuffledFlashcards.length) {
        // NOTE: Disallows reviewing when not logged in
        if (authData?.isLoggedIn) {
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

  const currentCard: Card = shuffledFlashcards[currentCardIndex];

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
            frontText={currentCard?.front_text}
            backText={currentCard?.back_text}
            onNextCard={handleNextCard}
          />
          <Box
            sx={{
              width: "100%",
              maxWidth: 600,
              mt: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={
                  hasFinished
                    ? 100
                    : (currentCardIndex / shuffledFlashcards.length) * 100
                }
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.action.hover,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  },
                }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {currentCardIndex + 1}/{shuffledFlashcards.length}
              </Typography>
            </Box>
            <Zoom in={hasFinished} easing={"ease"} timeout={500}>
              <Typography
                sx={{
                  mb: 0.5,
                  color: "transparent",
                  textShadow: `0 0 0 ${theme.palette.secondary.dark}`,
                }}
                variant={"h5"}
              >
                🔥
              </Typography>
            </Zoom>
          </Box>
        </>
      )}
      <ReviewModal
        open={modalOpen}
        setOpen={setModalOpen}
        lessonId={lessonId}
      />
    </Box>
  );
};

export default FlashcardList;
