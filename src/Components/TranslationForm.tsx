import { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { api } from "@/utils/apiClient";

interface TranslationResponse {
  sourceText: string;
  sourceLanguage: string;
  translatedText: string;
  targetLanguage: string;
}

function TranslationForm() {
  const [srcText, setSrcText] = useState("Hello!");
  const [translatedText, setTranslatedText] = useState("こんにちは！");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const translateText = setTimeout(async () => {
      if (!srcText || srcText.trim() === "") return;

      setIsLoading(true);
      try {
        const response = await api.get<TranslationResponse>(
          `/api/translations/${srcText.replaceAll("?", "%3F")}/en/ja`,
        );
        setTranslatedText(response.data.translatedText);
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(translateText);
  }, [srcText]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSrcText(e.target.value);
  }

  return (
    <>
      <Typography
        variant={"h4"}
        textAlign={"center"}
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
      >
        Translate Text
      </Typography>
      <Typography
        variant={"body1"}
        textAlign={"center"}
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Enter text below to translate between English and Japanese.
      </Typography>
      <Grid
        container
        spacing={3}
        direction={isMobile ? "column" : "row"}
        alignItems="stretch"
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            id={"src-text-input"}
            name={"src-text"}
            label={"Source Text"}
            type={"text"}
            value={srcText}
            onChange={handleInputChange}
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            sx={{ bgcolor: "background.paper" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            id={"translated-text-output"}
            name={"translated-text"}
            label={"Translated Text"}
            type={"text"}
            value={translatedText}
            fullWidth
            multiline
            minRows={4}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: isLoading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={40} />
                  </InputAdornment>
                ) : null,
              },
            }}
            color={"secondary"}
            variant="filled"
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default TranslationForm;
