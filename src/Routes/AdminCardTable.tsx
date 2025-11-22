import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import NewCardForm from "../Components/NewCardForm";
import { Card, NewCard } from "@/types/cards";
import { Lesson } from "@/types/lessons";
import { Section } from "@/types/sections";

const AdminCardTable = () => {
  const { authData, authIsLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editedCard, setEditedCard] = useState<NewCard | null>(null);
  const queryClient = useQueryClient();

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

  if (isErrorCards) {
    showSnackbar("Failed to fetch cards", "error");
  }

  const {
    data: lessonGroups,
    isLoading: isLoadingLessonGroups,
    isError: isErrorLessonGroups,
  } = useQuery({
    queryKey: ["lessonGroups", authData?.token],
    queryFn: async () => {
      const [lessonsResponse, sectionsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_APP_API_BASE}/api/lessons/all`),
        axios.get(`${import.meta.env.VITE_APP_API_BASE}/api/sections/all`),
      ]);

      const lessons = lessonsResponse.data;
      const sections = sectionsResponse.data;

      const groupedLessons = sections.reduce(
        (acc: Record<string, Lesson[]>, section: Section) => {
          acc[section.name] = lessons.filter(
            (lesson: Lesson) => lesson.section_id === section._id,
          );
          return acc;
        },
        {},
      );

      groupedLessons["Ungrouped"] = lessons.filter(
        (lesson: Lesson) => !lesson.section_id,
      );

      return { groupedLessons, lessons, sections };
    },
    enabled: !!authData,
  });

  const handleEdit = (card: Card) => {
    setEditingCardId(card._id);
    setEditedCard(card);
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      await axios.put(
        `${import.meta.env.VITE_APP_API_BASE}/api/cards/update/${editingCardId}`,
        editedCard,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      showSnackbar("Card updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cards", authData?.token] });
      setEditingCardId(null);
    },
    onError: () => {
      showSnackbar("Failed to update card", "error");
    },
  });

  const handleUpdate = async () => {
    updateMutation.mutate();
  };

  const deleteMutation = useMutation({
    mutationFn: async (cardId: string) => {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_BASE}/api/cards/delete/${cardId}`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      showSnackbar("Card deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cards", authData?.token] });
    },
    onError: () => {
      showSnackbar("Failed to delete card", "error");
    },
  });

  const handleDelete = async (cardId: string) => {
    deleteMutation.mutate(cardId);
  };

  const addMutation = useMutation({
    mutationFn: async (newCard: NewCard) => {
      await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/cards/create`,
        newCard,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
    },
    onSuccess: () => {
      showSnackbar("Card added successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cards", authData?.token] });
    },
    onError: () => {
      showSnackbar("Failed to add card", "error");
    },
  });

  const handleAddCard = async (newCard: NewCard) => {
    if (!newCard.front_text || !newCard.back_text) {
      showSnackbar("Front and back text are required", "error");
      return;
    }

    addMutation.mutate(newCard);
  };

  if (isLoadingCards || isLoadingLessonGroups || authIsLoading) {
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

  if (isErrorCards || isErrorLessonGroups) {
    return (
      <Typography variant="h5" textAlign="center">
        Error loading data
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
        Cards Table
      </Typography>
      <NewCardForm
        lessons={lessonGroups?.lessons}
        lessonGroups={lessonGroups?.groupedLessons}
        sections={lessonGroups?.sections}
        onSubmit={handleAddCard}
      />
      <TableContainer
        sx={{ maxWidth: "90%", borderRadius: 2, border: `1px solid` }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Front</TableCell>
              <TableCell>Back</TableCell>
              <TableCell>Lessons</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards?.map((card: Card) => (
              <TableRow key={card._id} onDoubleClick={() => handleEdit(card)}>
                <TableCell
                  sx={{
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {card._id}
                </TableCell>
                <TableCell>
                  {editingCardId === card._id ? (
                    <TextField
                      value={editedCard?.front_text}
                      onChange={(e) => {
                        if (!editedCard) return;

                        return setEditedCard({
                          ...editedCard,
                          front_text: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <Typography sx={{ minWidth: 100, whiteSpace: "nowrap" }}>
                      {card.front_text}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {editingCardId === card._id ? (
                    <TextField
                      value={editedCard?.back_text}
                      onChange={(e) => {
                        if (!editedCard) return;

                        setEditedCard({
                          ...editedCard,
                          back_text: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <Typography sx={{ minWidth: 100, whiteSpace: "nowrap" }}>
                      {card.back_text}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ width: 300 }}>
                  {editingCardId === card._id ? (
                    <Autocomplete
                      multiple
                      disableCloseOnSelect
                      options={Object.keys(
                        lessonGroups?.groupedLessons,
                      ).flatMap(
                        (section) => lessonGroups?.groupedLessons[section],
                      )}
                      groupBy={(option) =>
                        lessonGroups?.sections.find(
                          (section: Section) =>
                            section._id === option.section_id,
                        )?.name || "Ungrouped"
                      }
                      getOptionLabel={(option) => option.title}
                      value={editedCard?.lesson_ids?.map((lessonId) =>
                        lessonGroups?.lessons.find(
                          (lesson: Lesson) => lesson._id === lessonId,
                        ),
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                      onChange={(_event, newValue) => {
                        if (!editedCard) return;

                        setEditedCard({
                          ...editedCard,
                          lesson_ids: newValue.map((lesson) => lesson._id),
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Lessons"
                          placeholder="Select lessons"
                        />
                      )}
                    />
                  ) : (
                    <Typography sx={{ minWidth: 150 }}>
                      {card.lesson_ids
                        ?.map(
                          (lessonId) =>
                            lessonGroups?.lessons.find(
                              (lesson: Lesson) => lesson._id === lessonId,
                            )?.title,
                        )
                        .join(", \n")}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ whiteSpace: "noWrap" }}>
                  {editingCardId === card._id ? (
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
                        onClick={() => setEditingCardId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      onClick={() => handleEdit(card)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    sx={{ ml: 1 }}
                    variant={"contained"}
                    color={"error"}
                    onClick={() => handleDelete(card._id)}
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

export default AdminCardTable;
