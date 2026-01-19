import { useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { useSnackbar } from "@/Contexts/SnackbarContext";
import { useLessons, useSections } from "@/hooks/useLessons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/apiClient";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  ExpandMore,
  Folder,
  Description,
  Style,
  Check,
  Close,
} from "@mui/icons-material";
import { Section } from "@/types/sections";
import { Lesson, NewLesson } from "@/types/lessons";
import { Card } from "@/types/cards";
import LessonEditModal from "@/Components/admin/LessonEditModal";

const CurriculumDashboard = () => {
  const { authData, authIsLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");
  const [editingLessonTitle, setEditingLessonTitle] = useState("");
  // State for inline adding
  const [addingSectionName, setAddingSectionName] = useState("");

  // State for lesson modal (create + edit)
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLessonContent, setEditingLessonContent] = useState<Lesson | null>(null);
  const [defaultSectionForNewLesson, setDefaultSectionForNewLesson] = useState<string | undefined>(undefined);

  const { data: sections = [], isLoading: isLoadingSections } = useSections(authData);
  const { data: lessons = [], isLoading: isLoadingLessons } = useLessons(authData);
  const { data: cards = [], isLoading: isLoadingCards } = useQuery({
    queryKey: ["cards", authData?.token],
    queryFn: async () => {
      const response = await api.get<Card[]>("/api/cards/all");
      return response.data;
    },
    enabled: !!authData,
  });

  const updateSectionMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await api.put(`/api/sections/update/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Section updated", "success");
      setEditingSection(null);
    },
    onError: () => showSnackbar("Failed to update section", "error"),
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/sections/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Section deleted", "success");
    },
    onError: () => showSnackbar("Failed to delete section", "error"),
  });

  const createSectionMutation = useMutation({
    mutationFn: async (name: string) => {
      await api.post("/api/sections/create", { name, lesson_ids: [] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Section created", "success");
      setAddingSectionName("");
    },
    onError: () => showSnackbar("Failed to create section", "error"),
  });

  const updateLessonMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      await api.put(`/api/lessons/update/${id}`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSnackbar("Lesson updated", "success");
      setEditingLesson(null);
    },
    onError: () => showSnackbar("Failed to update lesson", "error"),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/lessons/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSnackbar("Lesson deleted", "success");
    },
    onError: () => showSnackbar("Failed to delete lesson", "error"),
  });

  const createLessonMutation = useMutation({
    mutationFn: async (newLesson: NewLesson) => {
      await api.post("/api/lessons/create", newLesson);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Lesson created", "success");
      setLessonModalOpen(false);
      setDefaultSectionForNewLesson(undefined);
    },
    onError: () => showSnackbar("Failed to create lesson", "error"),
  });

  const createCardMutation = useMutation({
    mutationFn: async ({ front_text, back_text, lesson_id }: { front_text: string; back_text: string; lesson_id: string }) => {
      await api.post("/api/cards/create-bulk", [{ front_text, back_text, lesson_ids: [lesson_id] }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      showSnackbar("Card created", "success");
    },
    onError: () => showSnackbar("Failed to create card", "error"),
  });

  const updateCardMutation = useMutation({
    mutationFn: async ({ id, front_text, back_text }: { id: string; front_text: string; back_text: string }) => {
      await api.put(`/api/cards/update/${id}`, { front_text, back_text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      showSnackbar("Card updated", "success");
    },
    onError: () => showSnackbar("Failed to update card", "error"),
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/cards/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      showSnackbar("Card deleted", "success");
    },
    onError: () => showSnackbar("Failed to delete card", "error"),
  });

  const updateLessonContentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lesson> }) => {
      await api.put(`/api/lessons/update/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      showSnackbar("Lesson updated", "success");
      setLessonModalOpen(false);
      setEditingLessonContent(null);
    },
    onError: () => showSnackbar("Failed to update lesson", "error"),
  });

  const getLessonsForSection = (sectionId: string): Lesson[] => {
    return lessons.filter((l) => l.section_id === sectionId);
  };

  const getUngroupedLessons = (): Lesson[] => {
    return lessons.filter((l) => !l.section_id);
  };

  const getCardsForLesson = (lessonId: string): Card[] => {
    return cards.filter((c) => c.lesson_ids.includes(lessonId));
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "grammar": return "grammar";
      case "flashcards": return "primary";
      case "practice": return "secondary";
      default: return "default";
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section._id);
    setEditingSectionName(section.name);
  };

  const handleSaveSection = (id: string) => {
    if (editingSectionName.trim()) {
      updateSectionMutation.mutate({ id, name: editingSectionName });
    }
  };

  const handleDeleteSection = (id: string) => {
    if (window.confirm("Delete this section? Lessons will become ungrouped.")) {
      deleteSectionMutation.mutate(id);
    }
  };

  const handleAddSection = () => {
    if (addingSectionName.trim()) {
      createSectionMutation.mutate(addingSectionName);
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson._id);
    setEditingLessonTitle(lesson.title);
  };

  const handleSaveLesson = (id: string) => {
    if (editingLessonTitle.trim()) {
      updateLessonMutation.mutate({ id, title: editingLessonTitle });
    }
  };

  const handleDeleteLesson = (id: string) => {
    if (window.confirm("Delete this lesson?")) {
      deleteLessonMutation.mutate(id);
    }
  };

  // Open create lesson modal with optional section pre-selected
  const handleOpenCreateLesson = (sectionId?: string) => {
    setDefaultSectionForNewLesson(sectionId);
    setEditingLessonContent(null);
    setLessonModalOpen(true);
  };

  // Open edit lesson modal
  const handleOpenEditLesson = (lesson: Lesson) => {
    setEditingLessonContent(lesson);
    setLessonModalOpen(true);
  };

  if (isLoadingSections || isLoadingLessons || isLoadingCards || authIsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const sortedSections = [...sections].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Curriculum Dashboard
      </Typography>

      {/* Add Section Form */}
      <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          size="small"
          label="New Section Name"
          value={addingSectionName}
          onChange={(e) => setAddingSectionName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
          sx={{ flexGrow: 1, maxWidth: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSection}
          disabled={!addingSectionName.trim() || createSectionMutation.isPending}
        >
          Add Section
        </Button>
      </Paper>

      {/* Sections */}
      {sortedSections.map((section) => (
        <Accordion key={section._id} defaultExpanded sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
              <Folder color="primary" />
              {editingSection === section._id ? (
                <>
                  <TextField
                    size="small"
                    value={editingSectionName}
                    onChange={(e) => setEditingSectionName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Enter") handleSaveSection(section._id);
                      if (e.key === "Escape") setEditingSection(null);
                    }}
                    autoFocus
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleSaveSection(section._id); }}>
                    <Check color="success" />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); setEditingSection(null); }}>
                    <Close />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {section.name}
                  </Typography>
                  <Chip
                    label={`${getLessonsForSection(section._id).length} lessons`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditSection(section); }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteSection(section._id); }}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {getLessonsForSection(section._id)
                .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
                .map((lesson) => (
                  <LessonItem
                    key={lesson._id}
                    lesson={lesson}
                    cards={getCardsForLesson(lesson._id)}
                    isEditing={editingLesson === lesson._id}
                    editingTitle={editingLessonTitle}
                    onEditingTitleChange={setEditingLessonTitle}
                    onEdit={() => handleEditLesson(lesson)}
                    onSave={() => handleSaveLesson(lesson._id)}
                    onCancel={() => setEditingLesson(null)}
                    onDelete={() => handleDeleteLesson(lesson._id)}
                    onAddCard={(front_text, back_text) => createCardMutation.mutate({ front_text, back_text, lesson_id: lesson._id })}
                    isAddingCard={createCardMutation.isPending}
                    onUpdateCard={(id, front_text, back_text) => updateCardMutation.mutate({ id, front_text, back_text })}
                    onDeleteCard={(id) => deleteCardMutation.mutate(id)}
                    onEditContent={() => handleOpenEditLesson(lesson)}
                    getCategoryColor={getCategoryColor}
                  />
                ))}
            </List>

            {/* Add lesson to section */}
            <Button
              size="small"
              startIcon={<Add />}
              onClick={() => handleOpenCreateLesson(section._id)}
              sx={{ ml: 2 }}
            >
              Add Lesson
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Ungrouped Lessons */}
      {getUngroupedLessons().length > 0 && (
        <Accordion defaultExpanded sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Folder color="disabled" />
              <Typography variant="h6" color="text.secondary">
                Ungrouped Lessons
              </Typography>
              <Chip
                label={`${getUngroupedLessons().length} lessons`}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {getUngroupedLessons()
                .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
                .map((lesson) => (
                  <LessonItem
                    key={lesson._id}
                    lesson={lesson}
                    cards={getCardsForLesson(lesson._id)}
                    isEditing={editingLesson === lesson._id}
                    editingTitle={editingLessonTitle}
                    onEditingTitleChange={setEditingLessonTitle}
                    onEdit={() => handleEditLesson(lesson)}
                    onSave={() => handleSaveLesson(lesson._id)}
                    onCancel={() => setEditingLesson(null)}
                    onDelete={() => handleDeleteLesson(lesson._id)}
                    onAddCard={(front_text, back_text) => createCardMutation.mutate({ front_text, back_text, lesson_id: lesson._id })}
                    isAddingCard={createCardMutation.isPending}
                    onUpdateCard={(id, front_text, back_text) => updateCardMutation.mutate({ id, front_text, back_text })}
                    onDeleteCard={(id) => deleteCardMutation.mutate(id)}
                    onEditContent={() => handleOpenEditLesson(lesson)}
                    getCategoryColor={getCategoryColor}
                  />
                ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
      {/* Lesson Create/Edit Modal */}
      <LessonEditModal
        open={lessonModalOpen}
        onClose={() => {
          setLessonModalOpen(false);
          setEditingLessonContent(null);
          setDefaultSectionForNewLesson(undefined);
        }}
        lesson={editingLessonContent}
        sections={sections}
        defaultSectionId={defaultSectionForNewLesson}
        onSave={(id, updates) => updateLessonContentMutation.mutate({ id, updates })}
        onCreate={(newLesson) => createLessonMutation.mutate(newLesson)}
        isSaving={updateLessonContentMutation.isPending || createLessonMutation.isPending}
      />
    </Box>
  );
};

// Lesson item sub-component
interface LessonItemProps {
  lesson: Lesson;
  cards: Card[];
  isEditing: boolean;
  editingTitle: string;
  onEditingTitleChange: (title: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onAddCard: (front_text: string, back_text: string) => void;
  isAddingCard: boolean;
  onUpdateCard: (id: string, front_text: string, back_text: string) => void;
  onDeleteCard: (id: string) => void;
  onEditContent: () => void;
  getCategoryColor: (category?: string) => "primary" | "secondary" | "grammar" | "default";
}

const LessonItem = ({
  lesson,
  cards,
  isEditing,
  editingTitle,
  onEditingTitleChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onAddCard,
  isAddingCard,
  onUpdateCard,
  onDeleteCard,
  onEditContent,
  getCategoryColor,
}: LessonItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");

  // Card editing state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingCardFront, setEditingCardFront] = useState("");
  const [editingCardBack, setEditingCardBack] = useState("");

  const handleAddCard = () => {
    if (newCardFront.trim() && newCardBack.trim()) {
      onAddCard(newCardFront.trim(), newCardBack.trim());
      setNewCardFront("");
      setNewCardBack("");
      setShowAddCardForm(false);
      setExpanded(true);
    }
  };

  const handleStartEditCard = (card: Card) => {
    setEditingCardId(card._id);
    setEditingCardFront(card.front_text);
    setEditingCardBack(card.back_text);
  };

  const handleSaveCard = () => {
    if (editingCardId && editingCardFront.trim() && editingCardBack.trim()) {
      onUpdateCard(editingCardId, editingCardFront.trim(), editingCardBack.trim());
      setEditingCardId(null);
    }
  };

  const handleCancelEditCard = () => {
    setEditingCardId(null);
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm("Delete this card?")) {
      onDeleteCard(cardId);
    }
  };

  return (
    <Box sx={{ mb: 1 }}>
      <ListItem
        sx={{
          bgcolor: "background.paper",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Description sx={{ mr: 1.5, color: "text.secondary" }} />
        {isEditing ? (
          <>
            <TextField
              size="small"
              value={editingTitle}
              onChange={(e) => onEditingTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
                if (e.key === "Escape") onCancel();
              }}
              autoFocus
              sx={{ flexGrow: 1 }}
            />
            <IconButton size="small" onClick={onSave}>
              <Check color="success" />
            </IconButton>
            <IconButton size="small" onClick={onCancel}>
              <Close />
            </IconButton>
          </>
        ) : (
          <>
            <ListItemText
              primary={lesson.title}
              secondary={lesson.content?.slice(0, 60) + (lesson.content && lesson.content.length > 60 ? "..." : "")}
            />
            {lesson.category && (
              <Chip
                label={lesson.category}
                size="small"
                // @ts-ignore
                color={getCategoryColor(lesson.category)}
                sx={{ mr: 1 }}
              />
            )}
            {lesson.category === "flashcards" && (
              <Tooltip title="View cards">
                <Chip
                  icon={<Style fontSize="small" />}
                  label={cards.length}
                  size="small"
                  variant="outlined"
                  onClick={() => setExpanded(!expanded)}
                  sx={{ mr: 1, cursor: "pointer" }}
                />
              </Tooltip>
            )}
            {(lesson.category === "grammar" || lesson.category === "practice") && (
              <Tooltip title="Edit Content">
                <IconButton size="small" onClick={onEditContent}>
                  <Description fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            )}
            {lesson.category === "flashcards" && (
              <Tooltip title="Edit Section">
                <IconButton size="small" onClick={onEditContent}>
                  <Description fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Edit Title">
              <IconButton size="small" onClick={onEdit}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={onDelete}>
                <Delete fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </ListItem>

      {/* Expandable cards grid - only for flashcard lessons */}
      {lesson.category === "flashcards" && expanded && (
        <Box sx={{ pl: 4, pt: 1 }}>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 0.5,
          }}>
            {cards.map((card) => (
              <Box
                key={card._id}
                sx={{
                  display: "flex",
                  flexDirection: editingCardId === card._id ? "column" : "row",
                  alignItems: editingCardId === card._id ? "stretch" : "center",
                  gap: editingCardId === card._id ? 1 : 0.5,
                  py: 0.5,
                  px: 1,
                  bgcolor: "action.hover",
                  borderRadius: 0.5,
                }}
              >
                {editingCardId === card._id ? (
                  <>
                    <TextField
                      size="small"
                      label="Front"
                      value={editingCardFront}
                      onChange={(e) => setEditingCardFront(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveCard();
                        if (e.key === "Escape") handleCancelEditCard();
                      }}
                      autoFocus
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label="Back"
                      value={editingCardBack}
                      onChange={(e) => setEditingCardBack(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveCard();
                        if (e.key === "Escape") handleCancelEditCard();
                      }}
                      fullWidth
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                      <IconButton size="small" onClick={handleSaveCard}>
                        <Check fontSize="small" color="success" />
                      </IconButton>
                      <IconButton size="small" onClick={handleCancelEditCard}>
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 0 }} noWrap>
                      {card.front_text}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                      →
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1, minWidth: 0 }} noWrap>
                      {card.back_text}
                    </Typography>
                    <IconButton size="small" onClick={() => handleStartEditCard(card)} sx={{ ml: "auto" }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteCard(card._id)}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </>
                )}
              </Box>
            ))}
          </Box>

          {/* Add Card Form */}
          {showAddCardForm ? (
            <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
              <TextField
                size="small"
                label="Front"
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowAddCardForm(false);
                }}
                autoFocus
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                label="Back"
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCard();
                  if (e.key === "Escape") setShowAddCardForm(false);
                }}
                sx={{ flex: 1 }}
              />
              <IconButton size="small" onClick={handleAddCard} disabled={isAddingCard || !newCardFront.trim() || !newCardBack.trim()}>
                <Check color="success" />
              </IconButton>
              <IconButton size="small" onClick={() => setShowAddCardForm(false)}>
                <Close />
              </IconButton>
            </Box>
          ) : (
            <Button
              size="small"
              startIcon={<Add />}
              onClick={() => setShowAddCardForm(true)}
              sx={{ mt: 1 }}
            >
              Add Card
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CurriculumDashboard;
