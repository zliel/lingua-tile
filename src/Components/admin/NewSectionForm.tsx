import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Lesson } from "@/types/lessons";
import { NewSection } from "@/types/sections";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";

const NewSectionForm = ({ lessons }: { lessons: Lesson[] }) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [newSection, setNewSection] = useState<NewSection>({
    name: "",
    lesson_ids: [],
  });

  const addMutation = useMutation({
    mutationKey: ["addingSection"],
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
      setNewSection({ name: "", lesson_ids: [] });
    },
    onError: () => {
      showSnackbar("Failed to add section", "error");
    },
  });

  const handleAddSection = () => {
    addMutation.mutate(newSection);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
          p: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add a New Section
        </Typography>
        <TextField
          label="Section Name"
          value={newSection.name || ""}
          onChange={(e) =>
            setNewSection({ ...newSection, name: e.target.value })
          }
          sx={{ mb: 2, width: "300px" }}
          required
        />
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={lessons}
          getOptionLabel={(option) => option.title}
          value={lessons.filter((lesson) =>
            newSection.lesson_ids.includes(lesson?._id),
          )}
          onChange={(_event, newValue) => {
            setNewSection({
              ...newSection,
              lesson_ids: newValue.map((lesson) => lesson._id),
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Lessons" variant="standard" />
          )}
          sx={{ mb: 2, width: "300px" }}
          disabled={newSection.name.trim() === ""}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSection}
          loading={addMutation.isPending}
        >
          Add Section
        </Button>
      </Box>
    </Box>
  );
};

export default NewSectionForm;
