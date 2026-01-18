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
import { Lesson } from "@/types/lessons";
import { Card } from "@/types/cards";

const CurriculumDashboard = () => {
  const { authData, authIsLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  // State for inline editing
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");
  const [editingLessonTitle, setEditingLessonTitle] = useState("");

  // State for inline adding
  const [addingSectionName, setAddingSectionName] = useState("");
  const [addingLessonToSection, setAddingLessonToSection] = useState<
    string | null
  >(null);
  const [addingLessonTitle, setAddingLessonTitle] = useState("");

  // Fetch all data
  const { data: sections = [], isLoading: isLoadingSections } =
    useSections(authData);
  const { data: lessons = [], isLoading: isLoadingLessons } =
    useLessons(authData);
  const { data: cards = [], isLoading: isLoadingCards } = useQuery({
    queryKey: ["cards", authData?.token],
    queryFn: async () => {
      const response = await api.get<Card[]>("/api/cards/all");
      return response.data;
    },
    enabled: !!authData,
  });

  // Mutations
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
    mutationFn: async ({
      title,
      section_id,
    }: {
      title: string;
      section_id?: string;
    }) => {
      await api.post("/api/lessons/create", { title, section_id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      showSnackbar("Lesson created", "success");
      setAddingLessonToSection(null);
      setAddingLessonTitle("");
    },
    onError: () => showSnackbar("Failed to create lesson", "error"),
  });

  // Helper functions
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
      case "grammar":
        return "primary";
      case "flashcards":
        return "secondary";
      case "practice":
        return "success";
      default:
        return "default";
    }
  };

  // Event handlers
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

  const handleAddLesson = (sectionId?: string) => {
    if (addingLessonTitle.trim()) {
      createLessonMutation.mutate({
        title: addingLessonTitle,
        section_id: sectionId,
      });
    }
  };

  // Loading state
  if (
    isLoadingSections ||
    isLoadingLessons ||
    isLoadingCards ||
    authIsLoading
  ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Sort sections by order_index
  const sortedSections = [...sections].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Curriculum Dashboard
      </Typography>

      {/* Add Section Form */}
      <Paper
        sx={{ p: 2, mb: 3, display: "flex", gap: 2, alignItems: "center" }}
      >
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
          disabled={
            !addingSectionName.trim() || createSectionMutation.isPending
          }
        >
          Add Section
        </Button>
      </Paper>

      {/* Sections */}
      {sortedSections.map((section) => (
        <Accordion key={section._id} defaultExpanded sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
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
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveSection(section._id);
                    }}
                  >
                    <Check color="success" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSection(null);
                    }}
                  >
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
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSection(section);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(section._id);
                      }}
                    >
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
                    getCategoryColor={getCategoryColor}
                  />
                ))}
            </List>

            {/* Add lesson to section */}
            {addingLessonToSection === section._id ? (
              <Box sx={{ display: "flex", gap: 1, mt: 1, pl: 2 }}>
                <TextField
                  size="small"
                  label="Lesson Title"
                  value={addingLessonTitle}
                  onChange={(e) => setAddingLessonTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddLesson(section._id);
                    if (e.key === "Escape") setAddingLessonToSection(null);
                  }}
                  autoFocus
                  sx={{ flexGrow: 1 }}
                />
                <IconButton onClick={() => handleAddLesson(section._id)}>
                  <Check color="success" />
                </IconButton>
                <IconButton onClick={() => setAddingLessonToSection(null)}>
                  <Close />
                </IconButton>
              </Box>
            ) : (
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => setAddingLessonToSection(section._id)}
                sx={{ ml: 2 }}
              >
                Add Lesson
              </Button>
            )}
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
                    getCategoryColor={getCategoryColor}
                  />
                ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
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
  getCategoryColor: (
    category?: string,
  ) => "primary" | "secondary" | "success" | "default";
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
  getCategoryColor,
}: LessonItemProps) => {
  const [expanded, setExpanded] = useState(false);

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
              secondary={
                lesson.content?.slice(0, 60) +
                (lesson.content && lesson.content.length > 60 ? "..." : "")
              }
            />
            {lesson.category && (
              <Chip
                label={lesson.category}
                size="small"
                color={getCategoryColor(lesson.category)}
                sx={{ mr: 1 }}
              />
            )}
            {cards.length > 0 && (
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
            <Tooltip title="Edit">
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

      {/* Expandable cards list */}
      {expanded && cards.length > 0 && (
        <Box sx={{ pl: 4, pt: 1 }}>
          {cards.map((card) => (
            <Box
              key={card._id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 0.5,
                px: 1,
                bgcolor: "action.hover",
                borderRadius: 0.5,
                mb: 0.5,
              }}
            >
              <Style fontSize="small" color="disabled" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {card.front_text}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                → {card.back_text}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CurriculumDashboard;
