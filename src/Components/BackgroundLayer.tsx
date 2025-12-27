import { Box, useTheme } from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const BackgroundLayer = () => {
  const theme = useTheme();
  const location = useLocation();

  // Mouse position state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for mouse movement
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized position (-1 to 1)
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax transforms for each blob (reacting differently to creating depth)
  const x1 = useTransform(smoothX, [-1, 1], [-20, 20]);
  const y1 = useTransform(smoothY, [-1, 1], [-20, 20]);

  const x2 = useTransform(smoothX, [-1, 1], [30, -30]); // Moves opposite
  const y2 = useTransform(smoothY, [-1, 1], [30, -30]);

  const x3 = useTransform(smoothX, [-1, 1], [-10, 10]); // Slower movement
  const y3 = useTransform(smoothY, [-1, 1], [-10, 10]);

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
        zIndex: -1, // Behind everything
        overflow: "hidden",
        pointerEvents: "none", // Don't block clicks
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Container for the blobs - fades out in Focus Mode */}
      <motion.div
        animate={{ opacity: isFocusMode ? 0 : 0.6 }}
        transition={{ duration: 1 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Blob 1: Primary Color - Top Left Corner */}
        <motion.div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "50vw",
            height: "50vw",
            maxWidth: 700,
            maxHeight: 700,
            borderRadius: "50%",
            background: theme.palette.primary.main,
            filter: "blur(100px)",
            opacity: 0.5,
            x: x1,
            y: y1,
          }}
          animate={{
            scale: [1, 1.1, 0.9, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blob 2: Secondary Color - Bottom Right Corner */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "45vw",
            height: "45vw",
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: "50%",
            background: theme.palette.secondary.main,
            filter: "blur(90px)",
            opacity: 0.4,
            x: x2,
            y: y2,
          }}
          animate={{
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blob 3: Grammar Color - Top Right (Spread out) */}
        <motion.div
          style={{
            position: "absolute",
            top: "10%",
            right: "-5%",
            width: "40vw",
            height: "40vw",
            maxWidth: 500,
            maxHeight: 500,
            borderRadius: "50%",
            background: theme.palette.grammar?.main || "#0288d1",
            filter: "blur(80px)",
            opacity: 0.4,
            x: x3,
            y: y3,
          }}
          animate={{
            scale: [1, 1.15, 0.85, 1],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blob 4: Warm/Accent Color - Bottom Left (Fills the gap) */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "-5%",
            left: "-5%",
            width: "35vw",
            height: "35vw",
            maxWidth: 450,
            maxHeight: 450,
            borderRadius: "50%",
            background: "#FFC107", // Amber/Gold for warmth
            filter: "blur(90px)",
            opacity: 0.3,
            x: x1, // Reuse x1/y1 for organic movement
            y: y1,
          }}
          animate={{
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </Box>
  );
};

export default BackgroundLayer;
