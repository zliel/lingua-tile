import React, { useState } from "react";
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

const AdminSectionTable = () => {
  const { auth } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editedSection, setEditedSection] = useState({});
  const queryClient = useQueryClient();

  const {
    data: lessons = [],
    isLoadingLessons,
    isErrorLessons,
  } = useQuery({
    queryKey: ["lessons", auth.token],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/lessons/all");

      return response.data;
    },
  });

  const {
    data: sections = [],
    isLoadingSections,
    isErrorSections,
  } = useQuery({
    queryKey: ["sections", auth.token],
    queryFn: async () => {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/sections/all",
      );

      return response.data;
    },
  });

  const handleEdit = (section) => {
    setEditingSectionId(section._id);
    setEditedSection(section);
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      await axios.put(
        `http://127.0.0.1:8000/api/sections/update/${editingSectionId}`,
        editedSection,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
    },
    onSuccess: () => {
      setEditingSectionId(null);
      queryClient.invalidateQueries("sections");
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
    mutationFn: async (sectionId) => {
      await axios.delete(
        `http://127.0.0.1:8000/api/sections/delete/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
    },
    onSuccess: () => {
      setEditingSectionId(null);
      queryClient.invalidateQueries("sections");
      showSnackbar("Section deleted successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to delete section", "error");
    },
  });

  const handleDelete = async (sectionId) => {
    deleteMutation.mutate(sectionId);
  };

  const addMutation = useMutation({
    mutationFn: async (section) => {
      await axios.post("http://127.0.0.1:8000/api/sections/create", section, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("sections");
      showSnackbar("Section added successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to add section", "error");
    },
  });

  const handleAddSection = async (section) => {
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
            {sections.map((section) => (
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
                      value={editedSection.name}
                      onChange={(e) =>
                        setEditedSection({
                          ...editedSection,
                          name: e.target.value,
                        })
                      }
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
                      value={editedSection.lesson_ids.map((lessonId) =>
                        lessons.find((lesson) => lesson._id === lessonId),
                      )}
                      onChange={(event, newValue) => {
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
                            lessons.find((lesson) => lesson._id === lessonId)
                              ?.title,
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
