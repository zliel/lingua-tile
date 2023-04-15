import React, {useEffect} from 'react';
import {useState} from 'react';
import {Grid, TextField} from "@mui/material";
import axios from "axios";

function TranslationForm() {
    const [srcText, setSrcText] = useState("Hello!")
    const [translatedText, setTranslatedText] = useState("こんにちは！")

    useEffect(() => {
        const translateText = setTimeout(async () => {
            const response = await axios.get(`http://127.0.0.1:8000/api/translations/${srcText.replaceAll("?", "%3F")}/en/ja`)
            setTranslatedText(response.data.translatedText)
        }, 1000)

        return () => clearTimeout(translateText)
    }, [srcText])

    function handleInputChange(e) {
        setSrcText(e.target.value)
    }

    return (
        <Grid container alignSelf={"center"} justify={"center"} direction={"column"} gap={2} paddingTop={"0.5em"}>
            <Grid item>
                <TextField id={"src-text-input"}
                                   name={"src-text"}
                                   label={"Source Text"}
                                   type={"text"}
                                   value={srcText}
                                   onChange={handleInputChange}
                />
            </Grid>
            <Grid item>
                <TextField id={"translated-text-output"}
                           name={"translated-text"}
                           label={"Translated Text"}
                           type={"text"}
                           value={translatedText}
                           inputProps={{readOnly: true}}
                           color={"secondary"}
                />
            </Grid>
        </Grid>
    );
}

export default TranslationForm;