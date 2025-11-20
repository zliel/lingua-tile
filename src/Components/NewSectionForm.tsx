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

const NewSectionForm = ({
  lessons,
  onSubmit,
}: {
  lessons: Lesson[];
  onSubmit: (section: NewSection) => void;
}) => {
  const [newSection, setNewSection] = useState<NewSection>({
    name: "",
    lesson_ids: [],
  });

  const handleAddSection = () => {
    onSubmit(newSection);
    setNewSection({ name: "", lesson_ids: [] });
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
        />
        <Button variant="contained" color="primary" onClick={handleAddSection}>
          Add Section
        </Button>
      </Box>
    </Box>
  );
};

export default NewSectionForm;
