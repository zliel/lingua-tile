import React, {useEffect} from 'react';
import {useState} from 'react';
import {Grid, TextField} from "@mui/material";
import axios from "axios";

function TranslationForm() {
    const [srcText, setSrcText] = useState("Hello!")
    const [translatedText, setTranslatedText] = useState("")

    useEffect(() => {
        const translateText = async () => {
            const response = await axios.get(`http://translation-project-springboot.herokuapp.com/api/translate/en/ja/${srcText}`)
            setTranslatedText(response.data.translatedText)
        }

        translateText()
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
                           defaultValue={"こんにちは！"}
                           inputProps={{readOnly: true}}
                           color={"secondary"}
                />

            </Grid>
        </Grid>
    );
}

export default TranslationForm;