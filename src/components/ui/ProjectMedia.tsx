"use client";

import { useEffect, useRef } from "react";
import { isVideo } from "@/lib/media";
import { useMediaQuery } from "@/lib/use-media-query";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Imagem ou vídeo de um projeto. Vídeos tocam mudos só enquanto estão na tela;
// com movimento reduzido não tocam sozinhos e ganham controles.
export function ProjectMedia({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const url = `${basePath}${src}`;

  if (!isVideo(src)) {
    // eslint-disable-next-line @next/next/no-img-element -- export estático com imagens sem otimização
    return <img src={url} alt={alt} loading="lazy" className={className} />;
  }
  return <InViewVideo src={url} label={alt} className={className} />;
}

function InViewVideo({ src, label, className }: { src: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reduced]);

  return (
    <video
      ref={ref}
      // #t=0.1 mostra o primeiro quadro antes de tocar
      src={`${src}#t=0.1`}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reduced}
      className={className}
    />
  );
}
