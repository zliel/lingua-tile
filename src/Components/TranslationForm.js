import React, { useEffect, useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import axios from "axios";

function TranslationForm() {
  const [srcText, setSrcText] = useState("Hello!");
  const [translatedText, setTranslatedText] = useState("こんにちは！");

  useEffect(() => {
    const translateText = setTimeout(async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/translations/${srcText.replaceAll("?", "%3F")}/en/ja`,
      );
      setTranslatedText(response.data.translatedText);
    }, 1000);

    return () => clearTimeout(translateText);
  }, [srcText]);

  function handleInputChange(e) {
    setSrcText(e.target.value);
  }

  return (
    <>
      <Typography variant={"h5"} textAlign={"center"}>
        Translate Text
      </Typography>
      <Typography variant={"body1"} textAlign={"center"}>
        Enter text in the box below to translate it from English to Japanese or
        from Japanese to English
      </Typography>
      <Grid
        container
        alignItems={"center"}
        justifyContent={"center"}
        direction={"row"}
        gap={12}
        paddingTop={"1.5em"}
      >
        <Grid item>
          <TextField
            id={"src-text-input"}
            name={"src-text"}
            label={"Source Text"}
            type={"text"}
            value={srcText}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item>
          <TextField
            id={"translated-text-output"}
            name={"translated-text"}
            label={"Translated Text"}
            type={"text"}
            value={translatedText}
            inputProps={{ readOnly: true }}
            color={"secondary"}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default TranslationForm;
