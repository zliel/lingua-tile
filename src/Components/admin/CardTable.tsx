import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridDeleteIcon,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/apiClient";
import { Card } from "@/types/cards";
import { Lesson } from "@/types/lessons";
import { Section } from "@/types/sections";

type LessonGroup = {
  lessons: Lesson[];
  sections: Section[];
  groupedLessons: { [key: string]: Lesson[] };
};

export const CardTable = ({
  cards,
  lessonGroups,
}: {
  cards: Card[];
  lessonGroups: LessonGroup;
}) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (card: Card) => {
      await api.put(`/api/cards/update/${card._id}`, card);
    },
    onSuccess: () => {
      showSnackbar("Card updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cards", authData?.token] });
    },
    onError: () => {
      showSnackbar("Failed to update card", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (cardId: string) => {
      await api.delete(`/api/cards/delete/${cardId}`);
    },
    onSuccess: () => {
      showSnackbar("Card deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cards", authData?.token] });
    },
    onError: () => {
      showSnackbar("Failed to delete card", "error");
    },
  });

  const handleProcessRowUpdate = async (newRow: Card, oldRow: Card) => {
    if (JSON.stringify(newRow) === JSON.stringify(oldRow)) return oldRow;

    await updateMutation.mutateAsync(newRow);
    return newRow;
  };

  const handleDelete = (cardId: string) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    deleteMutation.mutateAsync(cardId);
  };

  const getLessonTitles = (lessonIds: string[]) => {
    const titles = lessonIds
      .map((id) => {
        const lesson = lessonGroups.lessons.find((lesson) => lesson._id === id);
        return lesson ? lesson.title : null;
      })
      .filter((title): title is string => title !== null);
    return titles.join("\n");
  };

  const LessonEditCell = (params: GridRenderCellParams) => {
    const lessonOptions = lessonGroups.lessons.map((lesson) => ({
      id: lesson._id,
      label: lesson.title,
    }));
    const selectedLessons = (params.value as string[])
      .map((id) => {
        const lesson = lessonGroups.lessons.find((l) => l._id === id);
        return lesson ? { label: lesson.title, id: lesson._id } : null;
      })
      .filter(Boolean) as { label: string; id: string }[];
    return (
      <Autocomplete
        multiple
        options={lessonOptions}
        value={selectedLessons}
        onChange={(_, newValue) => {
          const newLessonIds = newValue.map((item) => item.id);
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: newLessonIds,
          });
        }}
        renderInput={(inputParams) => (
          <TextField {...inputParams} variant="standard" label="Lessons" />
        )}
        sx={{ mr: 2, ml: 2, width: "100%" }}
      />
    );
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 220, editable: false },
    {
      field: "front_text",
      headerName: "Front",
      width: 180,
      editable: true,
    },
    {
      field: "back_text",
      headerName: "Back",
      width: 180,
      editable: true,
    },
    {
      field: "lesson_ids",
      headerName: "Lesson",
      width: 200,
      flex: 1,
      editable: true,
      renderEditCell: LessonEditCell,
      renderCell: (params) => {
        return (
          <Box sx={{ whiteSpace: "pre-line" }}>
            {getLessonTitles(params.value as string[])}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<GridDeleteIcon color="error" />}
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: "90%", mx: "auto", mt: 2 }}>
      <DataGrid
        label="Cards"
        rows={cards}
        columns={columns}
        loading={updateMutation.isPending || deleteMutation.isPending}
        getRowId={(row) => row._id}
        getRowHeight={() => "auto"}
        showToolbar
        processRowUpdate={handleProcessRowUpdate}
        sx={{
          ".MuiDataGrid-cell": { py: "15px", maxHeight: "200px" },
        }}
      />
    </Box>
  );
};
