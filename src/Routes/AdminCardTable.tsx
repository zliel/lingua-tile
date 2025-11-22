import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Skeleton,
  Typography,
} from "@mui/material";
import NewCardForm from "../Components/NewCardForm";
import { CardTable } from "@/Components/admin/CardTable";
import { Card, NewCard } from "@/types/cards";
import { Lesson } from "@/types/lessons";
import { Section } from "@/types/sections";

const AdminCardTable = () => {
  const { authData, authIsLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    data: cards = [],
    isLoading: isLoadingCards,
    isError: isErrorCards,
  } = useQuery({
    queryKey: ["cards", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/cards/all`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );

      return response.data as Card[];
    },
    enabled: !!authData,
  });

  if (isErrorCards) {
    showSnackbar("Failed to fetch cards", "error");
  }

  const {
    data: lessonGroups = { lessons: [], sections: [], groupedLessons: {} },
    isLoading: isLoadingLessonGroups,
    isError: isErrorLessonGroups,
  } = useQuery({
    queryKey: ["lessonGroups", authData?.token],
    queryFn: async () => {
      const [lessonsResponse, sectionsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_APP_API_BASE}/api/lessons/all`),
        axios.get(`${import.meta.env.VITE_APP_API_BASE}/api/sections/all`),
      ]);

      const lessons = lessonsResponse.data;
      const sections = sectionsResponse.data;

      const groupedLessons = sections.reduce(
        (acc: Record<string, Lesson[]>, section: Section) => {
          acc[section.name] = lessons.filter(
            (lesson: Lesson) => lesson.section_id === section._id,
          );
          return acc;
        },
        {},
      );

      groupedLessons["Ungrouped"] = lessons.filter(
        (lesson: Lesson) => !lesson.section_id,
      );

      return { groupedLessons, lessons, sections };
    },
    enabled: !!authData,
  });


  const addMutation = useMutation({
    mutationFn: async (newCard: NewCard) => {
      await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/cards/create`,
        newCard,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      showSnackbar("Card added successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cards", authData?.token] });
    },
    onError: () => {
      showSnackbar("Failed to add card", "error");
    },
  });

  const handleAddCard = async (newCard: NewCard) => {
    if (!newCard.front_text || !newCard.back_text) {
      showSnackbar("Front and back text are required", "error");
      return;
    }

    addMutation.mutate(newCard);
  };

  if (isLoadingCards || isLoadingLessonGroups || authIsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Loading...
        </Typography>
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          width="90%"
          height={40}
          sx={{ mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          width="90%"
          height={30}
          sx={{ mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          width="90%"
          height={20}
          sx={{ mb: 2 }}
        />
      </Box>
    );
  }

  if (isErrorCards || isErrorLessonGroups) {
    return (
      <Typography variant="h5" textAlign="center">
        Error loading data
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        pb: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Cards Table
      </Typography>
      <NewCardForm
        lessons={lessonGroups?.lessons}
        lessonGroups={lessonGroups?.groupedLessons}
        sections={lessonGroups?.sections}
        onSubmit={handleAddCard}
      />
      <CardTable
        cards={cards}
        lessonGroups={lessonGroups} />
    </Box>
  );
};

export default AdminCardTable;
