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
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Close, Delete } from "@mui/icons-material";
import MarkdownPreviewer from "@/Components/MarkdownPreviewer";
import { Lesson, Sentence } from "@/types/lessons";

interface LessonEditModalProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onSave: (lessonId: string, updates: Partial<Lesson>) => void;
  isSaving: boolean;
}

export const LessonEditModal = ({
  open,
  onClose,
  lesson,
  onSave,
  isSaving,
}: LessonEditModalProps) => {
  // Local state for editing
  const [content, setContent] = useState("");
  const [sentences, setSentences] = useState<Sentence[]>([]);

  // Reset state when lesson changes
  useEffect(() => {
    if (lesson) {
      setContent(lesson.content || "");
      setSentences(lesson.sentences || []);
    }
  }, [lesson]);

  const handleSave = () => {
    if (!lesson) return;

    if (lesson.category === "grammar") {
      onSave(lesson._id, { content });
    } else if (lesson.category === "practice") {
      // Auto-generate words from full_sentence for each sentence
      const sentencesWithWords = sentences.map((s) => ({
        ...s,
        words: s.full_sentence.split(/\s+/).filter(Boolean),
      }));
      onSave(lesson._id, { sentences: sentencesWithWords });
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

  if (!lesson) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Edit: {lesson.title}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {lesson.category === "grammar" && (
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

        {lesson.category === "practice" && (
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

        {lesson.category === "flashcards" && (
          <Typography color="text.secondary">
            Use the inline card creation in the dashboard to manage flashcards.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || lesson.category === "flashcards"}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LessonEditModal;

