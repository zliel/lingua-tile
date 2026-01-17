import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import NewLessonForm from "@/Components/admin/NewLessonForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLessons, useSections } from "@/hooks/useLessons";
import { Box, Typography } from "@mui/material";
import { NewLesson } from "@/types/lessons";
import FormSkeleton from "@/Components/skeletons/FormSkeleton";
import { TableSkeleton } from "@/Components/skeletons/TableSkeleton";
import { LessonTable } from "@/Components/admin/LessonTable";
import { api } from "@/utils/apiClient";
import { Card } from "@/types/cards";

const AdminLessonTable = () => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    data: lessons = [],
    isLoading: isLoadingLessons,
    isError: isErrorLessons,
  } = useLessons(authData);

  const {
    data: sections = [],
    isLoading: isLoadingSections,
    isError: isErrorSections,
  } = useSections(authData);

  const {
    data: cards = [],
    isLoading: isLoadingCards,
    isError: isErrorCards,
  } = useQuery({
    queryKey: ["cards", authData?.token],
    queryFn: async () => {
      const response = await api.get<Card[]>("/api/cards/all");

      return response.data;
    },
    enabled: !!authData,
  });

  const addMutation = useMutation({
    mutationFn: async (lesson: NewLesson) => {
      await api.post("/api/lessons/create", lesson);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSnackbar("Lesson added successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to add lesson", "error");
    },
  });

  const handleAddLesson = async (lesson: NewLesson) => {
    addMutation.mutate(lesson);
  };

  if (isLoadingLessons || isLoadingSections || isLoadingCards) {
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
        <FormSkeleton title={true} fields={3} buttons={1} width={400} />
        <TableSkeleton rows={5} columns={4} />
      </Box>
    );
  }

  if (isErrorLessons || isErrorSections || isErrorCards) {
    return (
      <Typography variant="h6" textAlign="center">
        Failed to fetch data
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
        Lesson Table
      </Typography>
      <NewLessonForm
        cards={cards}
        sections={sections}
        onSubmit={handleAddLesson}
      />
      <LessonTable lessons={lessons} sections={sections} cards={cards} />
    </Box>
  );
};

export default AdminLessonTable;
