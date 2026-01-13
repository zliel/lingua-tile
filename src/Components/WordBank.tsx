import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Box, Typography, useTheme } from "@mui/material";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Word {
  id: string;
  text: string;
}

interface WordBankProps {
  availableWords: Word[];
  selectedWords: Word[];
  onWordClick: (word: Word, fromBank: boolean) => void;
  onReorder?: (newOrder: Word[]) => void;
  isCorrect: boolean | null;
  showFurigana?: boolean;
}

const WordTileContent = ({
  word,
  onClick,
  isSelected,
  disabled,
  showFurigana = false,
  isOverlay = false,
}: {
  word: Word;
  onClick: () => void;
  isSelected: boolean;
  disabled: boolean;
  showFurigana?: boolean;
  isOverlay?: boolean;
}) => {
  const theme = useTheme();

  // Parse Kanji(Furigana) format
  const match = word.text.match(/^(.*?)\((.*?)\)$/);
  const hasFurigana = !!match;
  const baseText = match ? match[1] : word.text;
  const furigana = match ? match[2] : "";

  return (
    <Box
      onClick={() => !disabled && onClick()}
      sx={{
        px: 1.5,
        py: showFurigana ? 1.5 : 1,
        borderRadius: "8px",
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
        cursor: isOverlay ? "grabbing" : disabled ? "default" : "pointer",
        transition: "transform 0.1s ease, box-shadow 0.1s ease",
        height: "fit-content",
        minWidth: "max-content",
        "&:hover": {
          transform: disabled || isOverlay ? "none" : "translateY(-2px)",
          boxShadow: disabled
            ? "none"
            : isSelected
              ? `0 6px 16px ${theme.palette.primary.main}60`
              : "0 4px 8px rgba(0,0,0,0.1)",
        },
        "&:active": {
          transform: disabled || isOverlay ? "none" : "translateY(0px)",
        },
        textAlign: "center",
      }}
    >
      {showFurigana && hasFurigana ? (
        <ruby style={{ rubyPosition: "over" }}>
          {baseText}
          <rt style={{ fontSize: "0.6em", opacity: 0.8 }}>{furigana}</rt>
        </ruby>
      ) : (
        baseText
      )}
    </Box>
  );
};

const WordTile = ({
  word,
  onClick,
  isSelected,
  disabled,
  showFurigana = false,
  enableLayout = true,
}: {
  word: Word;
  onClick: () => void;
  isSelected: boolean;
  disabled: boolean;
  showFurigana?: boolean;
  enableLayout?: boolean;
}) => {
  return (
    <motion.div
      layoutId={enableLayout ? word.id : undefined}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        display: "inline-block",
        margin: "4px",
        touchAction: "none",
      }}
    >
      <WordTileContent
        word={word}
        onClick={onClick}
        isSelected={isSelected}
        disabled={disabled}
        showFurigana={showFurigana}
      />
    </motion.div>
  );
};

// Wrapper for Sortable functionality
const SortableWordTile = ({
  word,
  onClick,
  disabled,
  showFurigana,
}: {
  word: Word;
  onClick: () => void;
  disabled: boolean;
  showFurigana?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: word.id, disabled });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    display: "inline-block",
    zIndex: isDragging ? 2 : 1, // Keep dragged item on top
    opacity: isDragging ? 0 : 1, // Hide original element while dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <WordTile
        word={word}
        onClick={onClick}
        isSelected={true}
        disabled={disabled}
        showFurigana={showFurigana}
        enableLayout={true}
      />
    </div>
  );
};

const WordBank: React.FC<WordBankProps> = ({
  availableWords,
  selectedWords,
  onWordClick,
  onReorder,
  isCorrect,
  showFurigana = false,
}) => {
  const theme = useTheme();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for snappier dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && onReorder) {
      const oldIndex = selectedWords.findIndex((w) => w.id === active.id);
      const newIndex = selectedWords.findIndex((w) => w.id === over?.id);
      onReorder(arrayMove(selectedWords, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  const activeWord = selectedWords.find((w) => w.id === activeId);

  return (
    <LayoutGroup>
      <Box sx={{ width: "100%", mb: 3 }}>
        {/* Sentence Strip (Selected Words) - Draggable Area */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Box
            component={motion.div}
            layout
            sx={{
              minHeight: 76,
              p: 1,
              px: 2,
              mb: 3,
              borderRadius: 4,
              border: "2px dashed",
              borderColor:
                isCorrect === false
                  ? theme.palette.error.main
                  : theme.palette.divider,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.02)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
              transition: "border-color 0.3s ease",
              position: "relative",
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
                  sx={{ width: "100%" }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontStyle: "italic",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Tap words to build sentence...
                  </Typography>
                </Box>
              )}
            </AnimatePresence>

            <SortableContext
              items={selectedWords}
              strategy={horizontalListSortingStrategy}
            >
              {selectedWords.map((word) => (
                <SortableWordTile
                  key={word.id}
                  word={word}
                  onClick={() => onWordClick(word, false)}
                  disabled={!!isCorrect}
                  showFurigana={showFurigana}
                />
              ))}
            </SortableContext>
          </Box>
          {createPortal(
            <DragOverlay>
              {activeWord ? (
                <WordTileContent
                  word={activeWord}
                  onClick={() => {}}
                  isSelected={true}
                  disabled={false}
                  showFurigana={showFurigana}
                  isOverlay={true}
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>

        {/* Available Words Bank */}
        <Box
          component={motion.div}
          layout
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
            alignContent: "center",
            p: 1,
            borderRadius: 4,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.2)"
                : "rgba(0,0,0,0.03)",
            minHeight: 76,
          }}
        >
          {availableWords.map((word) => (
            <WordTile
              key={word.id}
              word={word}
              onClick={() => onWordClick(word, true)}
              isSelected={false}
              disabled={!!isCorrect}
              showFurigana={showFurigana}
            />
          ))}
        </Box>
      </Box>
    </LayoutGroup>
  );
};

export default WordBank;
