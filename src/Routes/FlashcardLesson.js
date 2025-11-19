import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import FlashcardsList from "../Components/FlashcardList";

const FlashcardLesson = () => {
  const { lessonId } = useParams();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));

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
        <Typography>Loading lesson...</Typography>
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
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h1" gutterBottom sx={{ fontSize: isMobile ? "1.5rem" : "2.5rem" }}>
        {lesson && lesson.title}
      </Typography>
      <FlashcardsList lessonId={lessonId} />
    </Box >
  );
};

export default FlashcardLesson;
