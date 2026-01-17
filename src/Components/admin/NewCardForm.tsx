import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import { NewCard } from "@/types/cards";
import { Lesson } from "@/types/lessons";
import { Section } from "@/types/sections";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { useAuth } from "@/Contexts/AuthContext";
import { api } from "@/utils/apiClient";

const NewCardForm = ({
  lessons,
  lessonGroups,
  sections,
}: {
  lessons: Lesson[];
  lessonGroups: Record<string, Lesson[]>;
  sections: Section[];
}) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [newCard, setNewCard] = useState<NewCard>({
    front_text: "",
    back_text: "",
    lesson_ids: [],
  });

  const addMutation = useMutation({
    mutationFn: async (newCard: NewCard) => {
      await api.post("/api/cards/create", newCard);
    },
    onSuccess: () => {
      showSnackbar("Card added successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cards", authData?.token] });
    },
    onError: () => {
      showSnackbar("Failed to add card", "error");
    },
  });

  const handleAddCard = () => {
    if (!newCard.front_text || !newCard.back_text) {
      showSnackbar("Front and back text are required", "error");
      return;
    }

    addMutation.mutate(newCard);
    setNewCard({ front_text: "", back_text: "", lesson_ids: [] });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 4,
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
          Add a New Card
        </Typography>
        <TextField
          label="Front Text"
          value={newCard.front_text}
          onChange={(e) =>
            setNewCard({ ...newCard, front_text: e.target.value })
          }
          sx={{ mb: 2, width: "300px" }}
          required
        />
        <TextField
          label="Back Text"
          value={newCard.back_text}
          onChange={(e) =>
            setNewCard({ ...newCard, back_text: e.target.value })
          }
          sx={{ mb: 2, width: "300px" }}
          color={"secondary"}
          required
        />
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={Object.keys(lessonGroups).flatMap(
            (section) => lessonGroups[section],
          )}
          groupBy={(option) =>
            sections.find((section) => section._id === option.section_id)
              ?.name || "Ungrouped"
          }
          getOptionLabel={(option) => option.title}
          value={lessons.filter((lesson) =>
            newCard.lesson_ids?.includes(lesson._id),
          )}
          onChange={(_event, newValue) => {
            setNewCard({
              ...newCard,
              lesson_ids: newValue.map((lesson) => lesson._id),
            });
          }}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Lessons" />
          )}
          sx={{ mb: 2, width: "300px" }}
        />
        <Button variant="contained" color="primary" onClick={handleAddCard}>
          Add Card
        </Button>
      </Box>
    </Box>
  );
};

export default NewCardForm;
