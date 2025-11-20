import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import NewLessonForm from "../Components/NewLessonForm";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
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
import MarkdownPreviewer from "../Components/MarkdownPreviewer";
import { Card as CardType } from "@/types/cards";
import { Lesson, LessonCategory, NewLesson } from "@/types/lessons";
import { Section } from "@/types/sections";

const AdminLessonTable = () => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null);
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

  const {
    data: cards = [],
    isLoading: isLoadingCards,
    isError: isErrorCards,
  } = useQuery({
    queryKey: ["cards", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/cards/all`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );

      return response.data;
    },
    enabled: !!authData,
  });

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

  const addMutation = useMutation({
    mutationFn: async (lesson: NewLesson) => {
      await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/create`,
        lesson,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSnackbar("Lesson added successfully", "success");
    },
    onError: () => {
      showSnackbar("Failed to add lesson", "error");
    },
  });

  const handleAddLesson = async (lesson: NewLesson) => {
    addMutation.mutate(lesson);
  };

  if (isLoadingLessons || isLoadingSections || isLoadingCards) {
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

  if (isErrorLessons || isErrorSections || isErrorCards) {
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
        Lesson Table
      </Typography>
      <NewLessonForm
        cards={cards}
        sections={sections}
        onSubmit={handleAddLesson}
      />
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
              <TableRow
                key={lesson._id}
                onDoubleClick={() => handleEdit(lesson)}
              >
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
                <TableCell
                  sx={{ width: 300, maxHeight: 150, overflowY: "auto" }}
                >
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
                        <TextField
                          {...params}
                          label="Cards"
                          variant="outlined"
                        />
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
    </Box>
  );
};

export default AdminLessonTable;
