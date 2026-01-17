import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  LinearProgress,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import TranslationQuestion from "@/Components/TranslationQuestion";
import "./PracticeLesson.css";
import ReviewModal from "@/Components/ReviewModal";
import PracticeLessonSkeleton from "@/Components/skeletons/PracticeLessonSkeleton";
import { api } from "@/utils/apiClient";
import { Lesson } from "@/types/lessons";

const PracticeLesson = () => {
  const { lessonId } = useParams();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [currentSentence, setCurrentSentence] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [animationClass, setAnimationClass] = useState<string>("slide-in");
  const nodeRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", lessonId, authData?.token],
    queryFn: async () => {
      const response = await api.get<Lesson>(`/api/lessons/${lessonId}`);
      return response.data;
    },
    enabled: !!authData,
  });

  // Event handler for switching to the next sentence
  const handleNext = () => {
    setAnimationClass("slide-out");
    setTimeout(() => {
      if (currentSentence === lesson!.sentences!.length - 1) {
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
        prev === lesson!.sentences!.length - 1 ? 0 : prev + 1,
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
        mt: isMobile ? 1 : 2,
        pb: 0.5,
        scrollMarginTop: 100,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          pl: 2,
        }}
      >
        <IconButton onClick={() => navigate("/learn")}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Typography variant={"h4"} gutterBottom>
        {lesson?.title}
      </Typography>
      <Box ref={nodeRef} className={animationClass}>
        <TranslationQuestion
          sentence={lesson?.sentences![currentSentence]!}
          allSentences={lesson?.sentences!}
          onNext={handleNext}
        />
      </Box>
      <Box
        sx={{
          width: "90%",
          maxWidth: 600,
          mt: isMobile ? 1 : 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={(currentSentence / (lesson?.sentences?.length || 1)) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: (theme) =>
                  `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              },
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {modalOpen ? lesson!.sentences!.length : currentSentence + 1}/
            {lesson!.sentences!.length}
          </Typography>
        </Box>
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
