"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MouseFollower() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  
  // High performance motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring config for the elastic follow
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 1024); // Disable on touch devices
    
    // Check resizing
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    
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
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!mounted || isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] flex items-center justify-center will-change-transform"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <motion.div 
        animate={{ 
          scale: isHovering ? 2.2 : 0.8,
          backgroundColor: isHovering ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.4)",
          borderColor: isHovering ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0)",
          backdropFilter: isHovering ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-full rounded-full border shadow-[0_0_20px_rgba(16,185,129,0.3)] glass-panel"
      />
    </motion.div>
  );
}
