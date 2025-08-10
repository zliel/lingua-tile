import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import TranslationQuestion from "../Components/TranslationQuestion";
import "./PracticeLesson.css";
import useLessonReview from "../hooks/useLessonReview";
import ReviewModal from "../Components/ReviewModal";

const PracticeLesson = () => {
  const { lessonId } = useParams();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [currentSentence, setCurrentSentence] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState("slide-in");
  const nodeRef = useRef(null);

  const { handlePerformanceReview } = useLessonReview(
    lessonId,
    modalOpen,
    setModalOpen,
  );

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", lessonId, authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        },
      );
      return response.data;
    },
    onError: () => {
      showSnackbar("Failed to fetch lesson", "error");
    },
    enabled: !!authData,
  });

  // Event handler for switching to the next sentence
  const handleNext = () => {
    setAnimationClass("slide-out");
    setTimeout(() => {
      if (currentSentence === lesson.sentences.length - 1) {
        showSnackbar("Lesson complete!", "success");
        setModalOpen(true);
      }
      setCurrentSentence((prev) =>
        prev === lesson.sentences.length - 1 ? 0 : prev + 1,
      );
      setAnimationClass("slide-in");
    }, 400);
  };

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
        <Skeleton variant="rectangular" width="80%" height={200} />
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error loading lesson.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        mt: 6,
        p: 3,
        pb: "6em",
        border: 2,
        borderColor: "primary.main",
        borderRadius: 2,
      }}
    >
      <Typography variant={"h4"}>{lesson.title}</Typography>
      <Box ref={nodeRef} className={animationClass}>
        <TranslationQuestion
          sentence={lesson.sentences[currentSentence]}
          onNext={handleNext}
        />
      </Box>
      <ReviewModal
        open={modalOpen}
        setOpen={setModalOpen}
        handlePerformanceReview={handlePerformanceReview}
      />
    </Box>
  );
};

export default PracticeLesson;
