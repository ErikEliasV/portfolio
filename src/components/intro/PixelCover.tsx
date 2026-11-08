"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { ditherPixelSize } from "@/lib/dither/pixel-size";
import { COVER_CELL_SCALE, paintCover } from "@/lib/intro/pixel-cover";
import { getIntroState } from "@/lib/intro/timeline";

const ACCENT_RGB = [181, 245, 98] as const; // --color-accent

// Tela verde do fim da intro: cobre tudo (inclusive a barra) e se desfaz em pixels
// conforme o scroll. 1 px do canvas = 1 célula; o CSS amplia sem suavizar.
export function PixelCover({ progress }: { progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let image: ImageData | null = null;
    let lastCover = -1;

    const viewport = () => ({ width: window.innerWidth, height: window.innerHeight });

    const draw = (force = false) => {
      const { cover } = getIntroState(progress.get(), viewport(), mobileQuery.matches);
      if (!force && cover === lastCover) return;
      lastCover = cover;
      canvas.style.visibility = cover > 0 ? "visible" : "hidden";
      if (cover === 0 || !image) return;
      paintCover(image.data, image.width, image.height, cover, ACCENT_RGB);
      ctx.putImageData(image, 0, 0);
    };

    const resize = () => {
      const isMobile = mobileQuery.matches;
      const vp = viewport();
      const planetDiameter = 2 * getIntroState(0, vp, isMobile).planet.radius * vp.height;
      const cell = ditherPixelSize(planetDiameter, isMobile) * COVER_CELL_SCALE;
      canvas.width = Math.ceil(vp.width / cell);
      canvas.height = Math.ceil(vp.height / cell);
      // Células inteiras: o canvas passa um pouco da tela e o pai corta
      canvas.style.width = `${canvas.width * cell}px`;
      canvas.style.height = `${canvas.height * cell}px`;
      image = ctx.createImageData(canvas.width, canvas.height);
      draw(true);
    };

    resize();
    const unsubscribe = progress.on("change", () => draw());
    window.addEventListener("resize", resize);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, [progress]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <canvas ref={canvasRef} className="invisible [image-rendering:pixelated]" />
    </div>
  );
}
