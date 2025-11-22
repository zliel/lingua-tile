import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import NewLessonForm from "../Components/NewLessonForm";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import { NewLesson } from "@/types/lessons";
import { LessonTable } from "@/Components/admin/LessonTable";
import FormSkeleton from "@/Components/skeletons/FormSkeleton";
import { TableSkeleton } from "@/Components/skeletons/TableSkeleton";

const AdminLessonTable = () => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    data: lessons = [],
    isLoading: isLoadingLessons,
    isError: isErrorLessons,
  } = useQuery({
    queryKey: ["lessons", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/all`,
      );

      return response.data;
    },
    enabled: !!authData,
  });

  const {
    data: sections = [],
    isLoading: isLoadingSections,
    isError: isErrorSections,
  } = useQuery({
    queryKey: ["sections", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/sections/all`,
      );

      return response.data;
    },
    enabled: !!authData,
  });

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

      return response.data;
    },
    enabled: !!authData,
  });

  const addMutation = useMutation({
    mutationFn: async (lesson: NewLesson) => {
      await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/create`,
        lesson,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
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
