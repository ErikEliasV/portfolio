"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/lib/use-media-query";

export function MouseFollower() {
  const isDesktop = useMediaQuery("(min-width: 1024px)"); // Disable on touch devices
  const [isHovering, setIsHovering] = useState(false);
  
  // High performance motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring config for the elastic follow
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20); // offset by half width (40/2)
      cursorY.set(e.clientY - 20);
      
      const target = e.target as HTMLElement;
      // Triggers hovering state if interacting with an active element
      if (target.closest('a, button, [role="button"]') || window.getComputedStyle(target).cursor === 'pointer') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  if (!isDesktop) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] flex items-center justify-center will-change-transform"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <motion.div 
        animate={{ 
          scale: isHovering ? 2.2 : 0.8,
          backgroundColor: isHovering ? "rgba(181, 245, 98, 0.08)" : "rgba(181, 245, 98, 0.4)",
          borderColor: isHovering ? "rgba(181, 245, 98, 0.4)" : "rgba(181, 245, 98, 0)",
          backdropFilter: isHovering ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-full rounded-full border shadow-[0_0_20px_rgba(181,245,98,0.3)] glass-panel"
      />
    </motion.div>
  );
}
