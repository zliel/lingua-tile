import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";

interface Word {
  id: string;
  text: string;
}

interface WordBankProps {
  availableWords: Word[];
  selectedWords: Word[];
  onWordClick: (word: Word, fromBank: boolean) => void;
  isCorrect: boolean | null;
}

const WordTile = ({
  word,
  onClick,
  isSelected,
  disabled,
}: {
  word: Word;
  onClick: () => void;
  isSelected: boolean;
  disabled: boolean;
}) => {
  const theme = useTheme();

  return (
    <motion.div
      layoutId={word.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={() => !disabled && onClick()}
      style={{
        display: "inline-block",
        margin: "4px",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          borderRadius: "12px",
          backgroundColor: isSelected
            ? theme.palette.primary.main
            : theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "#f5f5f5",
          color: isSelected
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
          boxShadow: isSelected
            ? `0 4px 12px ${theme.palette.primary.main}40`
            : "0 2px 4px rgba(0,0,0,0.05)",
          border: `1px solid ${isSelected
            ? theme.palette.primary.main
            : theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)"
            }`,
          fontWeight: 500,
          userSelect: "none",
          transition: "transform 0.1s ease, box-shadow 0.1s ease",
          "&:hover": {
            transform: disabled ? "none" : "translateY(-2px)",
            boxShadow: disabled
              ? "none"
              : isSelected
                ? `0 6px 16px ${theme.palette.primary.main}60`
                : "0 4px 8px rgba(0,0,0,0.1)",
          },
          "&:active": {
            transform: disabled ? "none" : "translateY(0px)",
          }
        }}
      >
        {word.text}
      </Box>
    </motion.div>
  );
};

const WordBank: React.FC<WordBankProps> = ({
  availableWords,
  selectedWords,
  onWordClick,
  isCorrect,
}) => {
  const theme = useTheme();

  return (
    <LayoutGroup>
      <Box sx={{ width: "100%", mb: 3 }}>
        {/* Sentence Strip (Selected Words) */}
        <Box
          sx={{
            minHeight: 72,
            p: 2,
            mb: 3,
            borderRadius: 4,
            border: "2px dashed",
            borderColor: theme.palette.divider,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.02)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
            transition: "border-color 0.3s ease",
          }}
        >
          <AnimatePresence mode="popLayout">
            {selectedWords.length === 0 && (
              <Box
                key="placeholder"
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                sx={{ width: '100%' }}
              >
                <Typography
                  color="text.secondary"
                  sx={{ fontStyle: "italic", textAlign: "center", width: "100%" }}
                >
                  Tap words to build sentence...
                </Typography>
              </Box>
            )}
          </AnimatePresence>
          {selectedWords.map((word) => (
            <WordTile
              key={word.id}
              word={word}
              onClick={() => onWordClick(word, false)}
              isSelected={true}
              disabled={!!isCorrect}
            />
          ))}
        </Box>

        {/* Available Words Bank */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
            p: 2,
            borderRadius: 4,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
            minHeight: 100,
          }}
        >
          {availableWords.map((word) => (
            <WordTile
              key={word.id}
              word={word}
              onClick={() => onWordClick(word, true)}
              isSelected={false}
              disabled={!!isCorrect}
            />
          ))}
        </Box>
      </Box>
    </LayoutGroup>
  );
};

export default WordBank;


