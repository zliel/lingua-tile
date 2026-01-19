import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Close, Delete } from "@mui/icons-material";
import MarkdownPreviewer from "@/Components/MarkdownPreviewer";
import { Lesson, LessonCategory, NewLesson, Sentence } from "@/types/lessons";
import { Section } from "@/types/sections";

interface LessonEditModalProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null; // null = create mode
  sections?: Section[];
  defaultSectionId?: string;
  defaultOrderIndex?: number;
  onSave: (lessonId: string, updates: Partial<Lesson>) => void;
  onCreate?: (newLesson: NewLesson) => void;
  isSaving: boolean;
}

export const LessonEditModal = ({
  open,
  onClose,
  lesson,
  sections = [],
  defaultSectionId,
  defaultOrderIndex,
  onSave,
  onCreate,
  isSaving,
}: LessonEditModalProps) => {
  const isCreateMode = lesson === null;

  // Local state for editing
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<LessonCategory>("flashcards");
  const [sectionId, setSectionId] = useState<string>("");
  const [content, setContent] = useState("");
  const [sentences, setSentences] = useState<Sentence[]>([]);

  // Reset state when lesson changes or modal opens
  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setCategory(lesson.category || "flashcards");
      setSectionId(lesson.section_id || "");
      setContent(lesson.content || "");
      setSentences(lesson.sentences || []);
    } else {
      // Create mode
      setTitle("");
      setCategory("flashcards");
      setSectionId(defaultSectionId || "");
      setContent("");
      setSentences([]);
    }
  }, [lesson, defaultSectionId, open]);

  const handleSave = () => {
    if (isCreateMode && onCreate) {
      const newLesson: NewLesson = {
        title,
        category,
        section_id: sectionId || undefined,
        order_index: defaultOrderIndex,
        content: category === "grammar" ? content : undefined,
        sentences: category === "practice"
          ? sentences.map((s) => ({
            ...s,
            words: s.full_sentence.split(/\s+/).filter(Boolean),
          }))
          : undefined,
      };
      onCreate(newLesson);
    } else if (lesson) {
      const updates: Partial<Lesson> = {
        section_id: sectionId || undefined,
      };
      if (lesson.category === "grammar") {
        updates.content = content;
      } else if (lesson.category === "practice") {
        updates.sentences = sentences.map((s) => ({
          ...s,
          words: s.full_sentence.split(/\s+/).filter(Boolean),
        }));
      }
      onSave(lesson._id, updates);
    }
  };

  // Sentence editing handlers
  const handleSentenceChange = (index: number, value: string) => {
    const updated = [...sentences];
    updated[index] = { ...updated[index], full_sentence: value };
    setSentences(updated);
  };

  const handleAnswerChange = (sentenceIndex: number, answerIndex: number, value: string) => {
    const updated = [...sentences];
    updated[sentenceIndex].possible_answers[answerIndex] = value;
    setSentences(updated);
  };

  const addSentence = () => {
    setSentences([...sentences, { full_sentence: "", possible_answers: [""], words: [] }]);
  };

  const removeSentence = (index: number) => {
    setSentences(sentences.filter((_, i) => i !== index));
  };

  const addAnswer = (sentenceIndex: number) => {
    const updated = [...sentences];
    updated[sentenceIndex].possible_answers.push("");
    setSentences(updated);
  };

  const removeAnswer = (sentenceIndex: number, answerIndex: number) => {
    const updated = [...sentences];
    updated[sentenceIndex].possible_answers = updated[sentenceIndex].possible_answers.filter(
      (_, i) => i !== answerIndex
    );
    setSentences(updated);
  };

  const currentCategory = isCreateMode ? category : lesson?.category;
  const canSave = isCreateMode
    ? title.trim() !== ""
    : true; // All lesson types can save (at minimum for section changes)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isCreateMode ? "Create New Lesson" : `Edit: ${lesson?.title}`}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Section selector - shown in both modes */}
        {sections.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Section</InputLabel>
              <Select
                value={sectionId}
                label="Section"
                onChange={(e) => setSectionId(e.target.value)}
              >
                <MenuItem value="">None (Ungrouped)</MenuItem>
                {sections.map((s) => (
                  <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Create mode: show title, category fields */}
        {isCreateMode && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Lesson Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ flex: 1 }}
                autoFocus
                required
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value as LessonCategory)}
                >
                  <MenuItem value="flashcards">Flashcards</MenuItem>
                  <MenuItem value="grammar">Grammar</MenuItem>
                  <MenuItem value="practice">Practice</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        {/* Grammar content editor */}
        {currentCategory === "grammar" && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Markdown Content
            </Typography>
            <MarkdownPreviewer
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Box>
        )}

        {/* Practice sentences editor */}
        {currentCategory === "practice" && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Practice Sentences ({sentences.length})
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sentences.map((sentence, sIndex) => (
                <Card key={sIndex} variant="outlined">
                  <CardContent>
                    <TextField
                      label="Japanese Sentence"
                      value={sentence.full_sentence}
                      onChange={(e) => handleSentenceChange(sIndex, e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Possible Answers:
                    </Typography>
                    {sentence.possible_answers.map((answer, aIndex) => (
                      <Box key={aIndex} sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          label={`Answer ${aIndex + 1}`}
                          value={answer}
                          onChange={(e) => handleAnswerChange(sIndex, aIndex, e.target.value)}
                          sx={{ flex: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeAnswer(sIndex, aIndex)}
                          disabled={sentence.possible_answers.length <= 1}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={() => addAnswer(sIndex)}
                    >
                      Add Answer
                    </Button>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => removeSentence(sIndex)}
                    >
                      Remove Sentence
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addSentence}
              sx={{ mt: 2 }}
            >
              Add Sentence
            </Button>
          </Box>
        )}

        {/* Flashcards info */}
        {currentCategory === "flashcards" && (
          <Typography color="text.secondary">
            {isCreateMode
              ? "After creating this lesson, you can add cards using the inline card creator in the dashboard."
              : "You can change the section above. Cards are managed inline in the dashboard."
            }
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || !canSave}
        >
          {isSaving ? "Saving..." : isCreateMode ? "Create Lesson" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LessonEditModal;
