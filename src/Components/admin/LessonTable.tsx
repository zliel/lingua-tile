import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { Lesson, LessonCategory } from "@/types/lessons";
import { Section } from "@/types/sections";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import MarkdownPreviewer from "../MarkdownPreviewer";
import { Card as CardType } from "@/types/cards";

//TODO: Consider making this a tabbed table that filters for grammar/flashcard/practice lessons separately for easier editing
export const LessonTable = ({
  cards,
  lessons,
  sections,
}: {
  cards: CardType[];
  lessons: Lesson[];
  sections: Section[];
}) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null);
  const queryClient = useQueryClient();

  const handleEdit = (lesson: Lesson) => {
    setEditingLessonId(lesson._id);
    setEditedLesson(lesson);
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      await axios.put(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/update/${editedLesson?._id}`,
        editedLesson,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      setEditingLessonId(null);
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSnackbar("Lesson updated successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to update lesson", "error");
    },
  });

  const handleUpdate = async () => {
    updateMutation.mutate();
  };

  const deleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/delete/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      setEditingLessonId(null);
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSnackbar("Lesson deleted successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to delete lesson", "error");
    },
  });

  const handleDelete = async (lessonId: string) => {
    deleteMutation.mutate(lessonId);
  };

  return (
    <TableContainer
      sx={{ maxWidth: "95%", borderRadius: 2, border: `1px solid` }}
    >
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Section Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Sentences</TableCell>
            <TableCell>Cards</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lessons.map((lesson: Lesson) => (
            <TableRow key={lesson._id} onDoubleClick={() => handleEdit(lesson)}>
              <TableCell
                sx={{
                  maxWidth: 50,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {lesson._id}
              </TableCell>
              <TableCell>{lesson.title}</TableCell>
              {/* Sections Column */}
              <TableCell sx={{ width: 300 }}>
                {editingLessonId === lesson._id ? (
                  <Autocomplete
                    options={sections}
                    getOptionLabel={(option) => option.name}
                    value={sections.find(
                      (section: Section) => section._id === lesson.section_id,
                    )}
                    onChange={(_event, newValue) => {
                      if (!editedLesson) return;

                      setEditedLesson({
                        ...editedLesson,
                        section_id: newValue?._id ? newValue._id : "",
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Section"
                        variant="outlined"
                      />
                    )}
                  />
                ) : (
                  sections.find(
                    (section: Section) => section._id === lesson.section_id,
                  )?.name
                )}
              </TableCell>
              {/* Category Column */}
              <TableCell sx={{ width: 150 }}>
                {editingLessonId === lesson._id ? (
                  <TextField
                    label="Category"
                    value={editedLesson?.category}
                    onChange={(e) => {
                      if (!editedLesson) return;

                      setEditedLesson({
                        ...editedLesson,
                        category: e.target.value as LessonCategory,
                      });
                    }}
                    sx={{ mb: 2, minWidth: 120 }}
                    required
                  />
                ) : (
                  lesson.category
                )}
              </TableCell>
              {/* Content Column */}
              <TableCell sx={{ width: 300, maxHeight: 150, overflowY: "auto" }}>
                {editingLessonId === lesson._id &&
                lesson.category === "grammar" ? (
                  <MarkdownPreviewer
                    value={editedLesson?.content ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      if (!editedLesson) return;
                      setEditedLesson({
                        ...editedLesson,
                        content: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      maxHeight: 150,
                      overflowY: "auto",
                    }}
                  >
                    {lesson.content}
                  </Box>
                )}
              </TableCell>

              {/* Sentences Column */}
              <TableCell sx={{ width: 300 }}>
                {/*  TODO: Add sentences column for updating, consider reworking the db to include Sentence models as their own collection, similar to cards */}
                {/*  For now, we'll just show the full text for each sentence */}
                {lesson?.sentences?.map((sentence, sentenceIndex) => (
                  <Card key={sentenceIndex} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {sentence.full_sentence}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </TableCell>

              {/* Cards Column */}
              <TableCell sx={{ width: 300 }}>
                {editingLessonId === lesson._id ? (
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={cards}
                    getOptionLabel={(option) => option.front_text}
                    value={cards.filter((card: CardType) =>
                      editedLesson?.card_ids?.includes(card._id),
                    )}
                    onChange={(_event, newValue) => {
                      if (!editedLesson) return;

                      setEditedLesson({
                        ...editedLesson,
                        card_ids: newValue.map((card) => card._id),
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Cards" variant="outlined" />
                    )}
                  />
                ) : (
                  <Typography sx={{ minWidth: 150 }}>
                    {lesson.card_ids
                      ?.map(
                        (cardId) =>
                          cards.find((card: CardType) => card._id === cardId)
                            ?.front_text,
                      )
                      .join(", \n")}
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ whiteSpace: "noWrap" }}>
                {editingLessonId === lesson._id ? (
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
                      onClick={() => setEditingLessonId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => handleEdit(lesson)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  sx={{ ml: 1 }}
                  variant={"contained"}
                  color={"error"}
                  onClick={() => handleDelete(lesson._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
