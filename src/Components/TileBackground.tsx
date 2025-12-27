import { Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const TileBackground = () => {
  const theme = useTheme();
  const location = useLocation();
  const [tiles, setTiles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      duration: number;
      delay: number;
    }>
  >([]);

  // Initialize tiles
  useEffect(() => {
    const tileCount = 25;
    const newTiles = Array.from({ length: tileCount }).map((_, i) => ({
      id: i,
      x: ((Math.random() * window.innerWidth) / window.innerWidth) * 100,
      y: ((Math.random() * window.innerHeight) / window.innerHeight) * 110,
      size: Math.random() * 60 + 40,
      duration: Math.random() * 20 + 10, // 10s to 30s
      delay: Math.random() * 5,
    }));
    setTiles(newTiles);
  }, []);

  // Define routes where the background should be hidden (Focus Mode)
  const isFocusMode =
    location.pathname.startsWith("/flashcards") ||
    location.pathname.startsWith("/practice") ||
    location.pathname.startsWith("/grammar");

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <motion.div
        animate={{ opacity: isFocusMode ? 0 : 1 }}
        transition={{ duration: 1 }}
        style={{ width: "100%", height: "100%" }}
      >
        {tiles.map((tile) => (
          <motion.div
            key={tile.id}
            style={{
              position: "absolute",
              left: `${tile.x}%`,
              top: `${tile.y}%`,
              width: tile.size,
              height: tile.size,
              borderRadius: 12,
              border: `2px solid ${theme.palette.primary.main}`,
              backgroundColor: "transparent",
              opacity: 0.3,
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: tile.duration,
              repeat: Infinity,
              ease: "linear",
              delay: tile.delay,
            }}
          />
        ))}
        {/* Secondary colored filled tiles for variety */}
        {tiles.slice(0, 10).map((tile) => (
          <motion.div
            key={`filled-${tile.id}`}
            style={{
              position: "absolute",
              right: `${tile.x}%`,
              bottom: `${tile.y}%`,
              width: tile.size * 0.6,
              height: tile.size * 0.6,
              borderRadius: 8,
              backgroundColor: theme.palette.secondary.main,
              opacity: 0.05,
            }}
            animate={{
              y: [0, -80, 0],
              rotate: [360, 270, 180, 90, 0],
            }}
            transition={{
              duration: tile.duration * 1.2,
              repeat: Infinity,
              ease: "linear",
              delay: tile.delay + 2,
            }}
          />
        ))}
      </motion.div>
    </Box>
  );
};

export default TileBackground;
