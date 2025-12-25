import { Box, Skeleton, useTheme, useMediaQuery } from "@mui/material";
import { useMemo } from "react";

export const JourneySkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const NODE_WIDTH = isMobile ? 160 : 180;
  const ROW_GAP = isMobile ? 10 : 20;
  const CONTAINER_WIDTH = isMobile ? 350 : 600;

  const dummyRows = [
    { id: 1, nodes: [1] },
    { id: 2, nodes: [1] },
    { id: 3, nodes: [1] },
    { id: 4, nodes: [1, 2] },
    { id: 5, nodes: [1, 2] },
    { id: 6, nodes: [1] },
  ];

  const generatePath = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    const deltaY = endY - startY;
    const midY = startY + deltaY * 0.5;

    return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
  };

  const calculatedPaths = useMemo(() => {
    const paths: string[] = [];
    let currentY = 0;

    dummyRows.forEach((row, rowIndex) => {
      const nextRow = dummyRows[rowIndex + 1];

      if (nextRow) {
        const rowWidth = row.nodes.length * NODE_WIDTH + (row.nodes.length - 1) * ROW_GAP;
        const rowStartX = (CONTAINER_WIDTH - rowWidth) / 2;

        const nextRowWidth = nextRow.nodes.length * NODE_WIDTH + (nextRow.nodes.length - 1) * ROW_GAP;
        const nextRowStartX = (CONTAINER_WIDTH - nextRowWidth) / 2;

        // Simple 1-to-N or N-to-N logic simplified for skeleton
        row.nodes.forEach((_, nodeIndex) => {
          const nodeX = rowStartX + nodeIndex * (NODE_WIDTH + ROW_GAP) + NODE_WIDTH / 2;
          const nodeY = currentY + 78; // Bottom of current node (approx)

          nextRow.nodes.forEach((_, nextNodeIndex) => {
            // Connect if indices logically match (simplified)
            const shouldConnect =
              (row.nodes.length === 1) || // 1 connects to all
              (nextRow.nodes.length === 1) || // All connect to 1
              (nodeIndex === nextNodeIndex); // Parallel

            if (shouldConnect) {
              const nextNodeX = nextRowStartX + nextNodeIndex * (NODE_WIDTH + ROW_GAP) + NODE_WIDTH / 2;
              const nextNodeY = currentY + 120; // Top of next node (approx gap)
              paths.push(generatePath(nodeX, nodeY, nextNodeX, nextNodeY));
            }
          });
        });
      }
      currentY += 120;
    });
    return paths;
  }, [NODE_WIDTH, ROW_GAP, CONTAINER_WIDTH]);


  return (
    <Box
      sx={{
        position: "relative",
        width: CONTAINER_WIDTH,
        margin: "0 auto",
        py: 4,
        opacity: 0.5,
        animation: "pulse 1.5s ease-in-out infinite",
        "@keyframes pulse": {
          "0%": { opacity: 0.3 },
          "50%": { opacity: 0.6 },
          "100%": { opacity: 0.3 },
        },
      }}
    >
      {/* Render SVG Paths */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {calculatedPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={theme.palette.divider}
            strokeWidth="4"
            fill="none"
            strokeDasharray="5,5"
          />
        ))}
      </svg>

      {/* Render Nodes */}
      {dummyRows.map((row, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: `${ROW_GAP}px`,
            mb: "70px", // 120 (total row height) - 44 (node height)
            position: "relative",
            zIndex: 1,
          }}
        >
          {row.nodes.map((_, j) => (
            <Skeleton
              key={j}
              variant="rectangular"
              width={NODE_WIDTH}
              height={44}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

