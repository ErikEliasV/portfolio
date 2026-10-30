"use client";

import { motion } from "framer-motion";

// Entrada suave dos cards quando aparecem na tela
export function Reveal({
  index = 0,
  className,
  children,
}: {
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
