import { useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { Lesson } from "@/types/lessons";
import { Section } from "@/types/sections";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridDeleteIcon,
  GridColumnVisibilityModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Autocomplete, Box, TextField } from "@mui/material";
import {
  useMutation,
  useQueryClient,
  useIsFetching,
} from "@tanstack/react-query";
import axios from "axios";

export const SectionTable = ({
  lessons,
  sections,
}: {
  lessons: Lesson[];
  sections: Section[];
}) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const isFetchingSections = useIsFetching({ queryKey: ["sections"] }) > 0;

  const updateMutation = useMutation({
    mutationFn: async (editedSection: Section) => {
      await axios.put(
        `${import.meta.env.VITE_APP_API_BASE}/api/sections/update/${editedSection._id}`,
        editedSection,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Section updated successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to update section", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_BASE}/api/sections/delete/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Section deleted successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to delete section", "error");
    },
  });

  const handleProcessRowUpdate = async (newRow: Section, oldRow: Section) => {
    if (JSON.stringify(newRow) === JSON.stringify(oldRow)) return oldRow;

    await updateMutation.mutateAsync(newRow);
    return newRow;
  };

  const handleDelete = (sectionId: string) => {
    if (!window.confirm("Are you sure you want to delete this section?"))
      return;
    deleteMutation.mutateAsync(sectionId);
  };

  const getLessonTitles = (lessonIds: string[]) => {
    if (!lessons || lessons.length === 0) return "";

    return lessonIds
      .map((id) => lessons.find((l) => l._id === id)?.title)
      .filter(Boolean)
      .join("\n");
  };

  const LessonEditCell = (params: GridRenderCellParams) => {
    const lessonOptions = lessons.map((lesson) => ({
      label: lesson.title,
      id: lesson._id,
    }));
    const selectedLessons = (params.value as string[])
      .map((id) => {
        const lesson = lessons.find((l) => l._id === id);
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
      field: "name",
      headerName: "Name",
      width: 200,
      headerAlign: "left",
      editable: true,
    },
    {
      field: "lesson_ids",
      headerName: "Lessons",
      width: 300,
      flex: 1,
      editable: true,
      renderCell: (params) => {
        return (
          <Box sx={{ whiteSpace: "pre-line" }}>
            {getLessonTitles(params.value as string[])}
          </Box>
        );
      },
      renderEditCell: LessonEditCell,
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

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      _id: false,
    });

  return (
    <Box sx={{ height: 600, width: "90%", mx: "auto" }}>
      <DataGrid
        label="Sections"
        rows={sections}
        columns={columns}
        getRowId={(row) => row._id}
        showToolbar
        loading={updateMutation.isPending || isFetchingSections}
        getRowHeight={() => "auto"}
        processRowUpdate={handleProcessRowUpdate}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) =>
          setColumnVisibilityModel(newModel)
        }
        sx={{
          ".MuiDataGrid-cell": { py: "15px" },
        }}
      />
    </Box>
  );
};
