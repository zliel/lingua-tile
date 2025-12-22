import React from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  BLUEPRINT_PATH,
  BLUEPRINT_COLOR,
  BLUEPRINT_TRANSFORM,
  TILE_PATHS,
  LOGO_DEFS
} from "./LogoData";

interface AnimatedLogoProps {
  size?: number;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 200 }) => {
  // Phase 1: Draw outlines, then fade in the main background color
  const blueprintVariants: Variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      fillOpacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      fillOpacity: 1,
      transition: {
        pathLength: { duration: 0.6, ease: "easeInOut" },
        opacity: { duration: 0.3 },
        fillOpacity: { delay: 0.5, duration: 0.5 }
      },
    } as any,
  };

  // Phase 2: Tiles assemble with motion
  const tileVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.8 + i * 0.08,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        style={{
          width: size,
          height: size,
          backgroundColor: "white",
          borderRadius: "10%",
          padding: size * 0.1,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <svg
          viewBox="0 0 193.68 193.68"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            overflow: "visible",
          }}
        >
          <defs dangerouslySetInnerHTML={{ __html: LOGO_DEFS }} />

          {/* BLUEPRINT / BACKGROUND BOXES */}
          <g transform={BLUEPRINT_TRANSFORM}>
            <motion.path
              d={BLUEPRINT_PATH}
              fill={BLUEPRINT_COLOR}
              stroke="#6D658E"
              strokeWidth="2"
              variants={blueprintVariants}
              initial="hidden"
              animate="visible"
            />
          </g>

          {/* TILES (Characters and their specific overlays) */}
          {TILE_PATHS.map((tile, i) => (
            <g key={i} transform={tile.transform}>
              <motion.path
                d={tile.d}
                fill={tile.fill}
                custom={i}
                variants={tileVariants}
                initial="hidden"
                animate="visible"
              />
            </g>
          ))}
        </svg>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedLogo;
