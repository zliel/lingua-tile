import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useJourneyData, JourneyRow } from "./useJourneyData";
import { JourneyNode } from "./JourneyNode";
import { JourneySkeleton } from "@/Components/skeletons/JourneyMapSkeleton";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import { useOffline } from "@/Contexts/OfflineContext";
import { useOfflineData } from "@/hooks/useOfflineData";
import { IconButton, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const JourneyMap = () => {
  const { journeyRows, extraRows, isLoading, getLessonReviewStatus } =
    useJourneyData();
  const { isPending } = useOffline();
  const { downloadSection, downloadingSections } = useOfflineData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Layout Constants
  const CONTAINER_WIDTH = isMobile ? 350 : 600;
  const NODE_WIDTH = isMobile ? 160 : 180;
  const ROW_GAP = isMobile ? 10 : 20;

  // Helper function to calculate center X for a node, given its row count and index
  const getNodeCenterX = (count: number, index: number) => {
    const totalRowWidth = count * NODE_WIDTH + (count - 1) * ROW_GAP;
    const startX = (CONTAINER_WIDTH - totalRowWidth) / 2;

    // Center of the node
    return startX + index * (NODE_WIDTH + ROW_GAP) + NODE_WIDTH / 2;
  };

  const generateOrganicPath = (rows: JourneyRow[]) => {
    let path = "";

    rows.forEach((row, rowIndex) => {
      const nextRow = rows[rowIndex + 1];
      if (!nextRow) return;

      const currentY = row.offsetY;
      const nextY = nextRow.offsetY;

      const BUTTON_HALF_HEIGHT = 22;
      const startY = currentY + BUTTON_HALF_HEIGHT;
      const endY = nextY - BUTTON_HALF_HEIGHT;

      const verticalGap = endY - startY;

      row.lessons.forEach((_, i) => {
        const startX = getNodeCenterX(row.lessons.length, i);

        let targets: number[] = [];

        if (row.lessons.length === 1) {
          targets = nextRow.lessons.map((_, idx) => idx);
        } else if (nextRow.lessons.length === 1) {
          targets = [0];
        } else if (row.lessons.length === nextRow.lessons.length) {
          targets = [i];
        } else {
          const ratio = i / (row.lessons.length - 1 || 1);
          const targetIndex = Math.round(ratio * (nextRow.lessons.length - 1));
          targets = [targetIndex];
        }

        targets.forEach((targetIndex) => {
          const endX = getNodeCenterX(nextRow.lessons.length, targetIndex);
          const cpY1 = startY + verticalGap * 0.5;
          const cpY2 = endY - verticalGap * 0.5;
          path += `M ${startX} ${startY} C ${startX} ${cpY1}, ${endX} ${cpY2}, ${endX} ${endY} `;
        });
      });
    });

    return path;
  };

  const allRows = [...journeyRows, ...extraRows];
  const totalHeight =
    allRows.length > 0 ? allRows[allRows.length - 1].offsetY + 100 : 800;

  // --- ANIMATION VARIANTS ---
  // Container: Controls orchestration
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const commonTransition = {
    type: "spring",
    stiffness: 300,
    damping: 20,
  } as Transition;

  const centerVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      x: "-50%",
      y: "-50%",
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: "-50%",
      y: "-50%",
      transition: commonTransition,
    },
  };

  const centerXVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      x: "-50%",
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: "-50%",
      y: 0,
      transition: commonTransition,
    },
  };

  const centerYVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      x: 0,
      y: "-50%",
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: "-50%",
      transition: commonTransition,
    },
  };

  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.25, ease: "easeInOut" },
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        pt: isMobile ? 4 : 2,
        pb: isMobile ? 10 : 2,
        overflowX: "hidden",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <JourneySkeleton key="skeleton" />
        ) : (
          <Box
            component={motion.div}
            key="content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: CONTAINER_WIDTH,
              minHeight: Math.max(totalHeight, 600),
            }}
          >
            {/* SVG Background Layer */}
            <Box
              component={motion.svg}
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <defs>
                <mask id="path-mask">
                  <motion.path
                    d={generateOrganicPath(journeyRows)}
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    variants={pathVariants}
                  />
                </mask>
              </defs>
              {/* Visible Dashed Path (Masked) */}
              <path
                d={generateOrganicPath(journeyRows)}
                fill="none"
                stroke={theme.palette.divider}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="12 12"
                mask="url(#path-mask)"
              />
            </Box>

            {/* Extras Header */}
            {extraRows.length > 0 && (
              <Box
                component={motion.div}
                variants={centerXVariants}
                sx={{
                  position: "absolute",
                  top: extraRows[0].offsetY - 100, // Place above first extra row
                  left: "50%",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ opacity: 0.7, fontWeight: "bold" }}
                >
                  Extras
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>
                  Additional content
                </Typography>
              </Box>
            )}

            {/* Nodes Layer - Note the absolute positioning */}
            {allRows.map((row) => (
              <Box key={(row.index ?? "") + row.offsetY}>
                {/* Section Heading */}
                {row.sectionStartTitle && (
                  <Box
                    component={motion.div}
                    variants={centerYVariants}
                    sx={{
                      position: "absolute",
                      top: row.offsetY,
                      left: 0,
                      width: 150,
                      textAlign: "right",
                      pr: 2,
                      display: { xs: "none", sm: "flex" },
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: "bold", lineHeight: 1.2 }}
                    >
                      {row.sectionStartTitle}
                    </Typography>

                    {row.sectionId && (
                      <IconButton
                        onClick={() => {
                          if (row.sectionId) {
                            downloadSection(row.sectionId);
                          }
                        }}
                        disabled={downloadingSections[row.sectionId]}
                        size="small"
                        sx={{ ml: 1, verticalAlign: "middle" }}
                      >
                        {downloadingSections[row.sectionId] ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DownloadIcon fontSize="small" />
                        )}
                      </IconButton>
                    )}
                  </Box>
                )}

                {/* Mobile Section Heading */}
                {row.sectionStartTitle && (
                  <Box
                    component={motion.div}
                    variants={centerXVariants}
                    sx={{
                      position: "absolute",
                      top: row.offsetY - 60,
                      left: "50%",
                      width: "100%",
                      textAlign: "center",
                      display: { xs: "block", sm: "none" },
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {row.sectionStartTitle}
                    </Typography>
                  </Box>
                )}

                {row.lessons.map((lesson, i) => {
                  const centerX = getNodeCenterX(row.lessons.length, i);
                  return (
                    <Box
                      key={lesson._id}
                      component={motion.div}
                      variants={centerVariants}
                      sx={{
                        position: "absolute",
                        top: row.offsetY,
                        left: centerX,
                        zIndex: 1,
                        width: NODE_WIDTH,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <JourneyNode
                        lesson={lesson}
                        review={getLessonReviewStatus(lesson._id)}
                        pending={isPending(lesson._id)}
                      />
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default JourneyMap;
