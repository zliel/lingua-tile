import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import axios from "axios";
import {
  Autocomplete,
  Box,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import NewSectionForm from "../Components/NewSectionForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewSection, Section } from "@/types/sections";
import { Lesson } from "@/types/lessons";

const AdminSectionTable = () => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editedSection, setEditedSection] = useState<Section | null>(null);
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

  const handleEdit = (section: Section) => {
    setEditingSectionId(section._id);
    setEditedSection(section);
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      await axios.put(
        `${import.meta.env.VITE_APP_API_BASE}/api/sections/update/${editingSectionId}`,
        editedSection,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      setEditingSectionId(null);
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Section updated successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to update section", "error");
    },
  });

  const handleUpdate = () => {
    updateMutation.mutate();
  };

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
      setEditingSectionId(null);
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Section deleted successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to delete section", "error");
    },
  });

  const handleDelete = async (sectionId: string) => {
    deleteMutation.mutate(sectionId);
  };

  const addMutation = useMutation({
    mutationFn: async (section: NewSection) => {
      await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/sections/create`,
        section,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Section added successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to add section", "error");
    },
  });

  const handleAddSection = async (section: NewSection) => {
    addMutation.mutate(section);
  };

  if (isLoadingLessons || isLoadingSections) {
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

  if (isErrorLessons || isErrorSections) {
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
        Sections Table
      </Typography>
      <NewSectionForm lessons={lessons} onSubmit={handleAddSection} />
      <TableContainer
        sx={{ maxWidth: "90%", borderRadius: 2, border: `1px solid` }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Lessons</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section: Section) => (
              <TableRow
                key={section._id}
                onDoubleClick={() => handleEdit(section)}
              >
                <TableCell
                  sx={{
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {section._id}
                </TableCell>
                <TableCell sx={{ whiteSpace: "noWrap", minWidth: 150 }}>
                  {editingSectionId === section._id ? (
                    <TextField
                      value={editedSection?.name}
                      onChange={(e) => {
                        if (!editedSection) return;

                        setEditedSection({
                          ...editedSection,
                          name: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <Typography sx={{ minWidth: 150 }}>
                      {section.name}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ width: 300 }}>
                  {editingSectionId === section._id ? (
                    <Autocomplete
                      multiple
                      disableCloseOnSelect
                      options={lessons}
                      getOptionLabel={(option) => option.title}
                      value={editedSection?.lesson_ids.map((lessonId) =>
                        lessons.find(
                          (lesson: Lesson) => lesson._id === lessonId,
                        ),
                      )}
                      onChange={(_event, newValue) => {
                        if (!editedSection) return;

                        setEditedSection({
                          ...editedSection,
                          lesson_ids: newValue.map((option) => option._id),
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Lessons"
                        />
                      )}
                    />
                  ) : (
                    <Typography sx={{ minWidth: 150 }}>
                      {section.lesson_ids
                        ?.map(
                          (lessonId) =>
                            lessons.find(
                              (lesson: Lesson) => lesson._id === lessonId,
                            )?.title,
                        )
                        .join(", \n")}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ whiteSpace: "noWrap" }}>
                  {editingSectionId === section._id ? (
                    <>
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={handleUpdate}
                      >
                        Save
                      </Button>
                      <Button
                        sx={{ ml: 1 }}
                        variant={"contained"}
                        color={"warning"}
                        onClick={() => setEditingSectionId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      onClick={() => handleEdit(section)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    sx={{ ml: 1 }}
                    variant={"contained"}
                    color={"error"}
                    onClick={() => handleDelete(section._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminSectionTable;
