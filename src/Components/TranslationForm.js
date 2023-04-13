import React, {useEffect} from 'react';
import {useState} from 'react';
import {Button, Grid, TextField} from "@mui/material";
import axios from "axios";
import KanaKeyboard from "./KanaKeyboard";

function TranslationForm() {
    const [srcText, setSrcText] = useState("Hello!")
    const [translatedText, setTranslatedText] = useState("こんにちは！")
    const [useIME, setUseIME] = useState(false)

    useEffect(() => {
        const translateText = setTimeout(async () => {
            const response = await axios.get(`http://127.0.0.1:8000/translate/${srcText.replaceAll("?", "%3F")}/en/ja`)
            setTranslatedText(response.data.translatedText)
        }, 1000)

        return () => clearTimeout(translateText)
    }, [srcText])

    function handleInputChange(e) {
        setSrcText(e.target.value)
    }

    function handleIMEChange() {
        setUseIME(!useIME)
    }

    return (
        <Grid container alignSelf={"center"} justify={"center"} direction={"column"} gap={2} paddingTop={"0.5em"}>
            <Grid item>

                {useIME ?
                        <KanaKeyboard srcText={srcText} setSrcText={setSrcText}/>
                        :
                        <TextField id={"src-text-input"}
                                   name={"src-text"}
                                   label={"Source Text"}
                                   type={"text"}
                                   value={srcText}
                                   onChange={handleInputChange}
                        />
                }
                <Button onClick={handleIMEChange} variant={"outlined"} >{useIME ? "Default Keyboard" : "IME Keyboard"}</Button>
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