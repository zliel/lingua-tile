import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Typography,
} from "@mui/material";

const NewLessonForm = ({ cards, sections, onSubmit }) => {
  const [newLesson, setNewLesson] = useState({
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

  const handleSentenceChange = (index, field, value) => {
    const updatedSentences = [...newLesson.sentences];
    updatedSentences[index][field] = value;
    setNewLesson({ ...newLesson, sentences: updatedSentences });
  };

  const handlePossibleAnswerChange = (sentenceIndex, answerIndex, value) => {
    const updatedSentences = [...newLesson.sentences];
    updatedSentences[sentenceIndex].possible_answers[answerIndex] = value;
    setNewLesson({ ...newLesson, sentences: updatedSentences });
  };

  const addNewSentence = () => {
    setNewLesson({
      ...newLesson,
      sentences: [
        ...newLesson.sentences,
        { full_sentence: "", possible_answers: [""] },
      ],
    });
  };

  const addNewPossibleAnswer = (sentenceIndex) => {
    const updatedSentences = [...newLesson.sentences];
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
          onChange={(event, newValue) => {
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
          options={["grammar", "flashcards", "practice"]}
          value={newLesson.category}
          onChange={(event, newValue) => {
            setNewLesson({ ...newLesson, category: newValue });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Category" variant="outlined" />
          )}
          sx={{ mb: 2, width: "300px" }}
        />

        {newLesson.category === "grammar" && (
          <TextField
            label="Content"
            value={newLesson.content}
            onChange={(e) =>
              setNewLesson({ ...newLesson, content: e.target.value })
            }
            sx={{ mb: 2, width: "300px" }}
            required
            multiline
          />
        )}

        {newLesson.category === "practice" && (
          <Box sx={{ mb: 2, width: "300px" }}>
            {newLesson.sentences.map((sentence, sentenceIndex) => (
              <Card key={sentenceIndex} sx={{ mb: 2 }}>
                <CardContent>
                  <TextField
                    label="Full Sentence"
                    value={sentence.full_sentence}
                    onChange={(e) =>
                      handleSentenceChange(
                        sentenceIndex,
                        "full_sentence",
                        e.target.value,
                      )
                    }
                    sx={{ mb: 1, width: "100%" }}
                    required
                  />
                  {sentence.possible_answers.map((answer, answerIndex) => (
                    <TextField
                      key={answerIndex}
                      label={`Possible Answer ${answerIndex + 1}`}
                      value={answer}
                      onChange={(e) =>
                        handlePossibleAnswerChange(
                          sentenceIndex,
                          answerIndex,
                          e.target.value,
                        )
                      }
                      sx={{ mb: 1, width: "100%" }}
                      required
                    />
                  ))}
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
            ))}
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
            onChange={(event, newValue) => {
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
