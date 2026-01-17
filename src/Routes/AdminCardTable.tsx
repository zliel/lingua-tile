import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import NewCardForm from "@/Components/admin/NewCardForm";
import { Card } from "@/types/cards";
import { Lesson } from "@/types/lessons";
import { Section } from "@/types/sections";
import { TableSkeleton } from "@/Components/skeletons/TableSkeleton";
import FormSkeleton from "@/Components/skeletons/FormSkeleton";
import { CardTable } from "@/Components/admin/CardTable";
import api from "@/utils/apiClient";

const AdminCardTable = () => {
  const { authData, authIsLoading } = useAuth();
  const { showSnackbar } = useSnackbar();

  const {
    data: cards = [],
    isLoading: isLoadingCards,
    isError: isErrorCards,
  } = useQuery<Card[]>({
    queryKey: ["cards", authData?.token],
    queryFn: async (): Promise<Card[]> => {
      const response = await api.get<Card[]>("/api/cards/all");

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
        api.get<Lesson[]>(`/api/lessons/all`),
        api.get<Section[]>(`/api/sections/all`),
      ])

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

  if (isLoadingCards || isLoadingLessonGroups || authIsLoading) {
    return (
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Cards Table
        </Typography>
        <FormSkeleton />
        <TableSkeleton rows={5} columns={5} />
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
      />
      <CardTable cards={cards} lessonGroups={lessonGroups} />
    </Box>
  );
};

export default AdminCardTable;
