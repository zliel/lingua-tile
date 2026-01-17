import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import FlashcardsList from "@/Components/FlashcardList";
import { api } from "@/utils/apiClient";
import { Lesson } from "@/types/lessons";

const FlashcardLesson = () => {
  const { lessonId } = useParams();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));
  const navigate = useNavigate();

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", lessonId, authData?.token],
    queryFn: async () => {
      const response = await api.get<Lesson>(
        `/api/lessons/${lessonId}`,
      );
      return response.data;
    },
    enabled: !!authData,
  });

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
        <Typography sx={{ fontSize: isMobile ? "1.5rem" : "2.5rem" }}>
          Loading lesson...
        </Typography>
      </Box>
    );
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
        alignItems: "center",
        mt: 2,
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
      <Typography
        variant="h1"
        gutterBottom
        sx={{ fontSize: isMobile ? "1.5rem" : "2.5rem" }}
      >
        {lesson && lesson.title}
      </Typography>
      <FlashcardsList lessonId={lessonId || ""} lesson={lesson!} />
    </Box>
  );
};

export default FlashcardLesson;
