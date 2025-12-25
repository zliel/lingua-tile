import { Box, Typography, useMediaQuery } from "@mui/material";
import { useJourneyData, JourneyRow } from "./useJourneyData";
import { JourneyNode } from "./JourneyNode";
import { useTheme } from "@mui/material/styles";

const JourneyMap = () => {
  const { journeyRows, extraRows, isLoading, getLessonReviewStatus } = useJourneyData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Loading your journey...</Typography>
      </Box>
    );
  }

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

        targets.forEach(targetIndex => {
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
  const totalHeight = allRows.length > 0 ? allRows[allRows.length - 1].offsetY + 100 : 800;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        pt: isMobile ? 4 : 2,
        pb: isMobile ? 10 : 2,
        bgcolor: theme.palette.background.default,
        overflowX: "hidden",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: CONTAINER_WIDTH,
          minHeight: Math.max(totalHeight, 600)
        }}
      >
        {/* SVG Background Layer, paths */}
        <Box
          component="svg"
          width="100%"
          height="100%"
          // NOTE: Removing viewBox to use raw pixel coordinates matching the layout
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <path
            d={generateOrganicPath(journeyRows)}
            fill="none"
            stroke={theme.palette.divider}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="12 12"
          />
        </Box>

        {/* Extras Header */}
        {extraRows.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: extraRows[0].offsetY - 100, // Place above first extra row
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              textAlign: "center"
            }}
          >
            <Typography variant="h5" sx={{ opacity: 0.7, fontWeight: 'bold' }}>
              Extras
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.5 }}>
              Additional content
            </Typography>
          </Box>
        )}

        {/* Nodes Layer - Note the absolute positioning */}
        {allRows.map((row) => (
          <Box key={row.index}>
            {/* Section Heading */}
            {row.sectionStartTitle && (
              <Box
                sx={{
                  position: "absolute",
                  top: row.offsetY,
                  left: 0,
                  transform: "translateY(-50%)",
                  width: 150,
                  textAlign: "right",
                  pr: 2,
                  display: { xs: "none", sm: "block" }
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: "bold", lineHeight: 1.2 }}
                >
                  {row.sectionStartTitle}
                </Typography>
              </Box>
            )}

            {/* Mobile Section Heading */}
            {row.sectionStartTitle && (
              <Box
                sx={{
                  position: "absolute",
                  top: row.offsetY - 60,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  textAlign: "center",
                  display: { xs: "block", sm: "none" }
                }}
              >
                <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                  {row.sectionStartTitle}
                </Typography>
              </Box>
            )}

            {row.lessons.map((lesson, i) => {
              const centerX = getNodeCenterX(row.lessons.length, i);
              return (
                <Box
                  key={lesson._id}
                  sx={{
                    position: "absolute",
                    top: row.offsetY,
                    left: centerX,
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                    width: NODE_WIDTH,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <JourneyNode
                    lesson={lesson}
                    review={getLessonReviewStatus(lesson._id)}
                  />
                </Box>
              )
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default JourneyMap;
