import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  LinearProgress,
  Typography,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import Flashcard from "./Flashcard";
import { useTheme } from "@mui/material/styles";
import ReviewModal from "./ReviewModal";
import { Card } from "@/types/cards";
import { AnimatePresence, motion } from "framer-motion";
import { Lesson, Review } from "@/types/lessons";
import FlashcardListSkeleton from "./skeletons/FlashcardListSkeleton";
import { useSwipeable } from "react-swipeable";
import { api } from "@/utils/apiClient";

const variants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "left" ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "left" ? -300 : 300,
    opacity: 0,
  }),
};

const FlashcardList = ({
  lessonId,
  lesson,
}: {
  lessonId: string;
  lesson: Lesson;
}) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [[currentCardIndex, slideDirection], setPage] = useState<
    [number, "left" | "right"]
  >([0, "left"]);
  const [shuffledFlashcards, setShuffledFlashcards] = useState<Card[]>([]);
  const [hasFinished, setHasFinished] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isNavigating = useRef(false);

  const {
    data: flashcards = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["flashcards", lessonId, authData?.token],
    queryFn: async () => {
      const response = await api.post<Card[]>(
        "/api/cards/by-ids",
        lesson.card_ids,
      );
      return response.data;
    },
  });

  const { data: review, isLoading: isReviewLoading } = useQuery({
    queryKey: ["review", lessonId, authData?.token],
    queryFn: async () => {
      const response = await api.get<Review[]>(
        `/api/lessons/review/${lessonId}`,
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
      setShuffledFlashcards(
        [...flashcards].sort((a, b) =>
          a.front_text.localeCompare(b.front_text),
        ),
      );
    }
  }, [review, flashcards]);

  // Handle reaching the end of the flashcards
  useEffect(() => {
    if (
      shuffledFlashcards.length > 0 &&
      currentCardIndex === shuffledFlashcards.length
    ) {
      if (authData?.isLoggedIn) {
        showSnackbar("You have reached the end of the lesson!", "success");
        setHasFinished(true);
        setModalOpen(true);
        // Reset safely using current direction
        setPage([0, "left"]);
      } else {
        showSnackbar(
          "Please log in to complete the lesson to get personalized lesson scheduling.",
          "info",
        );
        setHasFinished(false);
        setPage([0, "left"]);
      }
    }
  }, [currentCardIndex, shuffledFlashcards.length, authData, showSnackbar]);

  const handleNextCard = () => {
    if (isNavigating.current) return;

    isNavigating.current = true;
    setTimeout(() => {
      isNavigating.current = false;
    }, 300);

    setPage(([currentIndex]) => {
      if (currentIndex + 1 > shuffledFlashcards.length)
        return [currentIndex, "left"];
      return [currentIndex + 1, "left"];
    });
  };

  const handlePreviousCard = () => {
    if (isNavigating.current) return;

    if (currentCardIndex > 0) {
      isNavigating.current = true;
      setTimeout(() => {
        isNavigating.current = false;
      }, 300);

      setPage(([currentIndex]) => {
        if (currentIndex <= 0) return [0, "right"];
        return [currentIndex - 1, "right"];
      });
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextCard(),
    onSwipedRight: () => handlePreviousCard(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (isLoading || isReviewLoading) {
    return <FlashcardListSkeleton />;
  }

  if (isError) {
    return <Typography>Error loading flashcards.</Typography>;
  }

  const currentCard: Card = shuffledFlashcards[currentCardIndex];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: isMobile ? 2 : 4,
        width: "100%",
        px: isMobile ? 1 : 0,
        overflow: "hidden",
      }}
      {...handlers}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateAreas: '"card"',
          width: "auto",
          padding: 1,
          justifyItems: "center",
        }}
      >
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={currentCardIndex}
            custom={slideDirection}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{
              gridArea: "card",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Flashcard
              frontText={currentCard?.front_text}
              backText={currentCard?.back_text}
              isFirstCard={currentCardIndex === 0}
              isLastCard={currentCardIndex === shuffledFlashcards.length - 1}
              onNextCard={handleNextCard}
              onPreviousCard={handlePreviousCard}
            />
          </motion.div>
        </AnimatePresence>
      </Box>
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
                : (currentCardIndex / (shuffledFlashcards?.length || 1)) * 100
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
              display: hasFinished ? "block" : "none",
              mb: 0.5,
              color: "transparent",
              textShadow: `0 0 0 ${theme.palette.secondary.dark}`,
              cursor: "default",
            }}
            variant={"h5"}
          >
            🔥
          </Typography>
        </Zoom>
      </Box>
      <ReviewModal
        open={modalOpen}
        setOpen={setModalOpen}
        lessonId={lessonId}
      />
    </Box>
  );
};

export default FlashcardList;
