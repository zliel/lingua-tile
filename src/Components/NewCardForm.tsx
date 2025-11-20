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

const NewCardForm = ({
  lessons,
  lessonGroups,
  sections,
  onSubmit,
}: {
  lessons: Lesson[];
  lessonGroups: Record<string, Lesson[]>;
  sections: Section[];
  onSubmit: (card: NewCard) => void;
}) => {
  const [newCard, setNewCard] = useState<NewCard>({
    front_text: "",
    back_text: "",
    lesson_ids: [],
  });

  const handleAddCard = () => {
    onSubmit(newCard);
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
