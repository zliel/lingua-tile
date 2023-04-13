import React from 'react';
import { useEffect} from 'react';
import { TextField } from "@mui/material";
import * as wanakana from "wanakana";


export default function KanaKeyboard(props) {
    useEffect(() => {
        const input = document.getElementById("ime-text-input")
        wanakana.bind(input)

        return () => wanakana.unbind(input)
    }, [])

    return (
        <>
            <TextField id={"ime-text-input"}
                          name={"src-text"}
                            label={"IME Text"}
                            type={"text"}
                            value={props.srcText}
                            onChange={props.setSrcText()}
            />
        </>
    );
}