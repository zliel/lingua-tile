import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { Card, NewCard } from "@/types/cards";
import { Lesson } from "@/types/lessons";
import { Section } from "@/types/sections";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Typography,
  Autocomplete,
  Button,
} from "@mui/material";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type LessonGroup = {
  lessons: Lesson[];
  sections: Section[];
  groupedLessons: { [key: string]: Lesson[] };
};

export const CardTable = ({
  cards,
  lessonGroups,
}: {
  cards: Card[];
  lessonGroups: LessonGroup;
}) => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editedCard, setEditedCard] = useState<NewCard | null>(null);
  const queryClient = useQueryClient();

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

  return (
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
                  wordBreak: "break-word",
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
                    multiline
                    maxRows={4}
                  />
                ) : (
                  <Typography
                    sx={{
                      minWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      display: "block",
                    }}
                  >
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
                    multiline
                    maxRows={4}
                  />
                ) : (
                  <Typography
                    sx={{
                      minWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      display: "block",
                    }}
                  >
                    {card.back_text}
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ width: 300 }}>
                {editingCardId === card._id ? (
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={Object.keys(lessonGroups?.groupedLessons).flatMap(
                      (section) => lessonGroups?.groupedLessons[section],
                    )}
                    groupBy={(option) =>
                      lessonGroups?.sections.find(
                        (section: Section) =>
                          section._id === option?.section_id,
                      )?.name || "Ungrouped"
                    }
                    getOptionLabel={(option) => option?.title || ""}
                    value={editedCard?.lesson_ids?.map((lessonId) =>
                      lessonGroups?.lessons.find(
                        (lesson: Lesson) => lesson._id === lessonId,
                      ),
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    onChange={(_event, newValue) => {
                      if (!editedCard) return;

                      setEditedCard({
                        ...editedCard,
                        lesson_ids: newValue.map((lesson) => lesson?._id || ""),
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
                  <Typography
                    sx={{
                      minWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      display: "block",
                    }}
                  >
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
  );
};
