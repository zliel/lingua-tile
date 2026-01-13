import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";

interface FuriganaWordProps {
  text: string;
}

const FuriganaWord = ({ text }: FuriganaWordProps) => {
  const theme = useTheme();

  const { base, reading, hasFurigana } = useMemo(() => {
    // Regex matches "Base(Reading)" format
    const match = text.match(/^(.*)\((.*)\)$/);
    if (match) {
      return { base: match[1], reading: match[2], hasFurigana: true };
    }
    return { base: text, reading: "", hasFurigana: false };
  }, [text]);

  if (!hasFurigana) {
    return <span>{text}</span>;
  }

  return (
    <Box
      component="span"
      sx={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        verticalAlign: "bottom",
        mx: 0.2,
        cursor: "help",
        borderBottom: `1px dashed ${theme.palette.text.secondary}`,
        "&:hover .furigana-reading": {
          opacity: 1,
          transform: "translate(-50%, 0)",
        },
      }}
    >
      <Typography
        className="furigana-reading"
        component="span"
        sx={{
          position: "absolute",
          bottom: "100%",
          left: "50%",
          transform: "translate(-50%, 5px)",
          opacity: 0,
          transition: "opacity 0.2s ease, transform 0.2s ease",
          fontSize: "50%",
          whiteSpace: "nowrap",
          color: theme.palette.text.secondary,
          pointerEvents: "none",
          userSelect: "none",
          mb: -0.5,
        }}
      >
        {reading}
      </Typography>
      <span>{base}</span>
    </Box>
  );
};

export default FuriganaWord;
