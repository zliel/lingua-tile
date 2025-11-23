import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import MarkdownPreviewer from "../MarkdownPreviewer";
import { Section } from "@/types/sections";
import { LessonCategory, NewLesson, Sentence } from "@/types/lessons";
import { Card as CardType } from "@/types/cards";

const NewLessonForm = ({
  cards,
  sections,
  onSubmit,
}: {
  cards: CardType[];
  sections: Section[];
  onSubmit: (lesson: NewLesson) => void;
}) => {
  const [newLesson, setNewLesson] = useState<NewLesson>({
    title: "",
    section_id: "",
    category: "",
    content: "",
    sentences: [],
    card_ids: [],
  });

  const handleAddLesson = () => {
    onSubmit(newLesson);
    setNewLesson({
      title: "",
      section_id: "",
      category: "",
      content: "",
      sentences: [],
      card_ids: [],
    });
  };

  const handleSentenceChange = (
    index: number,
    field: "full_sentence" | "possible_answers",
    value: string,
  ) => {
    const updatedSentences = newLesson.sentences
      ? [...newLesson.sentences]
      : [];
    if (field === "full_sentence") {
      updatedSentences[index].full_sentence = value;
    } else if (field === "possible_answers") {
      updatedSentences[index].possible_answers = [value]; // or handle as needed
    }

    setNewLesson({ ...newLesson, sentences: updatedSentences });
  };

  const handlePossibleAnswerChange = (
    sentenceIndex: number,
    answerIndex: number,
    value: string,
  ) => {
    const updatedSentences = newLesson.sentences
      ? [...newLesson.sentences]
      : [];
    updatedSentences[sentenceIndex].possible_answers[answerIndex] = value;
    setNewLesson({ ...newLesson, sentences: updatedSentences });
  };

  const addNewSentence = () => {
    if (!newLesson.sentences) {
      setNewLesson({
        ...newLesson,
        sentences: [{ full_sentence: "", possible_answers: [], words: [] }],
      });
      return;
    }

    setNewLesson({
      ...newLesson,
      sentences: [
        ...newLesson.sentences,
        { full_sentence: "", possible_answers: [], words: [] },
      ],
    });
  };

  const addNewPossibleAnswer = (sentenceIndex: number) => {
    const updatedSentences = newLesson.sentences
      ? [...newLesson.sentences]
      : [];
    updatedSentences[sentenceIndex].possible_answers.push("");
    setNewLesson({ ...newLesson, sentences: updatedSentences });
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
          Add a New Lesson
        </Typography>
        <TextField
          label="Title"
          value={newLesson.title}
          onChange={(e) =>
            setNewLesson({ ...newLesson, title: e.target.value })
          }
          sx={{ mb: 2, width: "300px" }}
          required
        />
        <Autocomplete
          options={sections}
          getOptionLabel={(option) => option.name}
          value={
            sections.find((section) => section._id === newLesson.section_id) ||
            null
          }
          onChange={(_event, newValue) => {
            setNewLesson({
              ...newLesson,
              section_id: newValue ? newValue._id : "",
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Section" variant="outlined" />
          )}
          sx={{ mb: 2, width: "300px" }}
        />
        <Autocomplete
          options={["grammar", "flashcards", "practice"] as LessonCategory[]}
          value={newLesson.category}
          onChange={(_event, value) => {
            setNewLesson({ ...newLesson, category: value ?? "" });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Category" variant="outlined" />
          )}
          sx={{ mb: 2, width: "300px" }}
        />

        {newLesson.category === "grammar" && (
          <Box sx={{ width: 600, mb: 2 }}>
            <Typography variant="h6" gutterBottom textAlign={"center"}>
              Add Content
            </Typography>
            <MarkdownPreviewer
              value={newLesson.content ?? ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewLesson({ ...newLesson, content: e.target.value })
              }
            />
          </Box>
        )}

        {newLesson.category === "practice" && (
          <Box sx={{ mb: 2, width: "300px" }}>
            {newLesson?.sentences?.map(
              (sentence: Sentence, sentenceIndex: number) => (
                <Card key={sentenceIndex} sx={{ mb: 2 }}>
                  <CardContent>
                    <TextField
                      label="Full Sentence"
                      value={sentence.full_sentence}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSentenceChange(
                          sentenceIndex,
                          "full_sentence",
                          e.target.value,
                        )
                      }
                      sx={{ mb: 1, width: "100%" }}
                      required
                    />
                    {sentence.possible_answers.map(
                      (answer: string, answerIndex: number) => (
                        <TextField
                          key={answerIndex}
                          label={`Possible Answer ${answerIndex + 1}`}
                          value={answer}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handlePossibleAnswerChange(
                              sentenceIndex,
                              answerIndex,
                              e.target.value,
                            )
                          }
                          sx={{ mb: 1, width: "100%" }}
                          required
                        />
                      ),
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      onClick={() => addNewPossibleAnswer(sentenceIndex)}
                      sx={{ mb: 1 }}
                    >
                      Add Possible Answer
                    </Button>
                  </CardActions>
                </Card>
              ),
            )}
            <Button variant="outlined" onClick={addNewSentence}>
              Add New Sentence
            </Button>
          </Box>
        )}

        {newLesson.category === "flashcards" && (
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={cards}
            getOptionLabel={(option) => option.front_text}
            value={cards.filter((card) =>
              newLesson.card_ids?.includes(card._id),
            )}
            onChange={(_event, newValue) => {
              setNewLesson({
                ...newLesson,
                card_ids: newValue.map((card) => card._id),
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Cards" variant="outlined" />
            )}
            sx={{ mb: 2, width: "300px" }}
          />
        )}

        <Button variant="contained" color="primary" onClick={handleAddLesson}>
          Add Lesson
        </Button>
      </Box>
    </Box>
  );
};

export default NewLessonForm;
