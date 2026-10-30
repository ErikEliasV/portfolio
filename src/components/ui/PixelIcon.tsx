import { twMerge } from "tailwind-merge";

const SHAPES = {
  plus: "polygon(0 30%,30% 30%,30% 0,70% 0,70% 30%,100% 30%,100% 70%,70% 70%,70% 100%,30% 100%,30% 70%,0 70%)",
  corner: "polygon(0 0,100% 0,100% 100%,0 100%,0 70%,70% 70%,70% 30%,0 30%)",
  cross: "polygon(40% 0,60% 0,60% 40%,100% 40%,100% 60%,60% 60%,60% 100%,40% 100%,40% 60%,0 60%,0 40%,40% 40%)",
} as const;

export type PixelIconVariant = keyof typeof SHAPES;

export function PixelIcon({ variant, className }: { variant: PixelIconVariant; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={twMerge("block size-[18px] flex-none bg-accent", className)}
      style={{ clipPath: SHAPES[variant] }}
    />
  );
}
