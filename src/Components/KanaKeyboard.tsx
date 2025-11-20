import { useEffect } from "react";
import { TextField } from "@mui/material";
import * as wanakana from "wanakana";

export default function KanaKeyboard(props: {
  srcText: string;
  setSrcText: () => (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  useEffect(() => {
    const input = document.getElementById("ime-text-input");
    wanakana.bind(input as HTMLTextAreaElement);

    return () => wanakana.unbind(input as HTMLTextAreaElement);
  }, []);

  return (
    <>
      <TextField
        id={"ime-text-input"}
        name={"src-text"}
        label={"IME Text"}
        type={"text"}
        value={props.srcText}
        onChange={props.setSrcText()}
      />
    </>
  );
}
