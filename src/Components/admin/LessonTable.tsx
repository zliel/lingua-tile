import { useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { Lesson, Sentence } from "@/types/lessons";
import { Section } from "@/types/sections";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridDeleteIcon,
  GridColumnVisibilityModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Autocomplete, Box, Tab, Tabs, TextField } from "@mui/material";
import {
  useMutation,
  useQueryClient,
  useIsFetching,
} from "@tanstack/react-query";
import { api } from "@/utils/apiClient";
import { Card } from "@/types/cards";

const categoryColumnVisibility: Record<string, GridColumnVisibilityModel> = {
  All: { _id: false },
  Grammar: { _id: false, sentences: false, card_ids: false },
  Flashcards: { _id: false, sentences: false, content: false },
  Practice: { _id: false, card_ids: false, content: false },
};

export const LessonTable = ({
  cards,
  lessons,
  sections,
}: {
  cards: Card[];
  lessons: Lesson[];
  sections: Section[];
}) => {
  useAuth();
  const isFetchingSections = useIsFetching({ queryKey: ["sections"] }) > 0;
  const { showSnackbar } = useSnackbar();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", "Grammar", "Flashcards", "Practice"];
  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.category?.toLowerCase() === selectedCategory.toLowerCase(),
  );
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (editedLesson: Lesson) => {
      await api.put(`/api/lessons/update/${editedLesson._id}`, editedLesson);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSnackbar("Section updated successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to update section", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      await api.delete(`/api/lessons/delete/${lessonId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSnackbar("Section deleted successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to delete section", "error");
    },
  });

  const handleProcessRowUpdate = async (newRow: Lesson, oldRow: Lesson) => {
    if (JSON.stringify(newRow) === JSON.stringify(oldRow)) return oldRow;

    await updateMutation.mutateAsync(newRow);
    return newRow;
  };

  const handleDelete = (lessonId: string) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    deleteMutation.mutateAsync(lessonId);
  };

  const getSectionName = (sectionId: any) => {
    const sectionName =
      sections.find((s) => s._id === sectionId.value)?.name || "";
    return sectionName;
  };

  const CardEditCell = (params: GridRenderCellParams) => {
    const cardOptions = cards.map((card) => ({
      label: card.front_text,
      id: card._id,
    }));

    const selectedCards = (params.value as string[])
      .map((id) => {
        const card = cards.find((c) => c._id === id);
        return card ? { label: card.front_text, id: card._id } : null;
      })
      .filter(Boolean) as { label: string; id: string }[];

    return (
      <Autocomplete
        multiple
        options={cardOptions}
        value={selectedCards}
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
      field: "title",
      headerName: "Title",
      width: 200,
      headerAlign: "left",
      editable: true,
    },
    {
      field: "order_index",
      headerName: "Order Index",
      width: 120,
      headerAlign: "left",
      align: "left",
      editable: true,
      type: "number",
    },
    {
      field: "section_id",
      headerName: "Section Name",
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <Box sx={{ whiteSpace: "pre-line" }}>{getSectionName(params)}</Box>
        );
      },
      type: "singleSelect",
      valueOptions: sections.map((section) => ({
        label: section.name,
        value: section._id,
      })),
    },
    {
      field: "category",
      headerName: "Category",
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Grammar", "Flashcards", "Practice"],
      valueFormatter: (params: string) => {
        return params.charAt(0).toUpperCase() + params.slice(1).toLowerCase();
      },
    },
    {
      field: "content",
      headerName: "Content",
      width: 300,
      flex: 1,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          multiline
          fullWidth
          minRows={4}
          maxRows={10}
          value={params.value}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
        />
      ),
      renderCell: (params) => (
        <Box sx={{ whiteSpace: "pre-line", maxHeight: 200, overflowY: "auto" }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "sentences",
      headerName: "Sentences",
      width: 100,
      flex: 1,
      editable: false,
      renderCell: (params) => {
        const full_sentences = params.row.sentences
          .map((sentence: Sentence) => `- ${sentence.full_sentence}`)
          .join("\n");
        return (
          <Box
            sx={{ whiteSpace: "pre-line", maxHeight: 200, overflowY: "auto" }}
          >
            {full_sentences}
          </Box>
        );
      },
    },
    {
      field: "card_ids",
      headerName: "Cards",
      width: 100,
      flex: 1,
      editable: true,
      renderCell: (params) => {
        return (
          <Box sx={{ whiteSpace: "pre-line" }}>
            {params.row.card_ids
              .map((id: string) => cards.find((c) => c._id === id)?.front_text)
              .filter(Boolean)
              .join(", ")}
          </Box>
        );
      },
      renderEditCell: CardEditCell,
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

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(
    categoryColumnVisibility[selectedCategory],
  );
  const handleTabChange = (_: React.SyntheticEvent, newCategory: string) => {
    setSelectedCategory(newCategory);
    setColumnVisibilityModel(categoryColumnVisibility[newCategory]);
  };

  return (
    <Box sx={{ height: 600, width: "90%", mx: "auto" }}>
      <Tabs value={selectedCategory} onChange={handleTabChange} sx={{ mb: 2 }}>
        {categories.map((category) => (
          <Tab key={category} label={category} value={category} />
        ))}
      </Tabs>
      <DataGrid
        label="Lessons"
        rows={selectedCategory === "All" ? lessons : filteredLessons}
        columns={columns}
        getRowId={(row) => row._id}
        showToolbar
        loading={updateMutation.isPending || isFetchingSections}
        getRowHeight={() => "auto"}
        processRowUpdate={handleProcessRowUpdate}
        columnVisibilityModel={columnVisibilityModel}
        sx={{
          ".MuiDataGrid-cell": { py: "15px", maxHeight: "200px" },
        }}
      />
    </Box>
  );
};
