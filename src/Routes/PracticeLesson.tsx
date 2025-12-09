import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import TranslationQuestion from "../Components/TranslationQuestion";
import "./PracticeLesson.css";
import ReviewModal from "../Components/ReviewModal";
import PracticeLessonSkeleton from "@/Components/skeletons/PracticeLessonSkeleton";

const PracticeLesson = () => {
  const { lessonId } = useParams();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [currentSentence, setCurrentSentence] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [animationClass, setAnimationClass] = useState<string>("slide-in");
  const nodeRef = useRef(null);

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", lessonId, authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
      return response.data;
    },
    enabled: !!authData,
  });

  // Event handler for switching to the next sentence
  const handleNext = () => {
    setAnimationClass("slide-out");
    setTimeout(() => {
      if (currentSentence === lesson.sentences.length - 1) {
        // NOTE: Disallows reviewing when not logged in
        if (authData?.isLoggedIn) {
          showSnackbar("Lesson complete!", "success");
          setModalOpen(true);
        } else {
          showSnackbar(
            "Please log in to complete the lesson to get personalized lesson scheduling.",
            "info",
            2000,
          );
        }
      }
      setCurrentSentence((prev) =>
        prev === lesson.sentences.length - 1 ? 0 : prev + 1,
      );
      setAnimationClass("slide-in");
    }, 400);
  };

  if (isLoading) {
    return <PracticeLessonSkeleton />;
  }

  if (isError) {
    showSnackbar("Failed to fetch lesson", "error");
    return <Typography>Error loading lesson.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        mt: 4,
        pb: 8,
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
        lessonId={lessonId || ""}
      />
    </Box>
  );
};

export default PracticeLesson;
