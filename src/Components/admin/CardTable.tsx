import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { DataGrid, GridColDef, GridActionsCellItem, GridDeleteIcon, GridRenderCellParams } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
      await axios.put(
        `${import.meta.env.VITE_APP_API_BASE}/api/cards/update/${card._id}`,
        card,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
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
      await axios.delete(
        `${import.meta.env.VITE_APP_API_BASE}/api/cards/delete/${cardId}`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
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

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 220 },
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
      field: "lesson_id",
      headerName: "Lesson",
      width: 200,
      flex: 1,
      editable: true,
      type: "singleSelect",
      renderCell: (params: GridRenderCellParams) => {
        const lesson = lessonGroups.lessons.find(
          (lesson) => lesson._id === params.row.lesson_ids[0],
        );
        return <span>{lesson ? lesson.title : ""}</span>;
      },
      valueOptions: lessonGroups.lessons.map((lesson) => ({
        value: lesson._id,
        label: lesson.title,
      })),
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
          '.MuiDataGrid-cell': { py: '15px', maxHeight: '200px' },
        }}
      />
    </Box>
  );
};
