import { twMerge } from "tailwind-merge";

export function PixelCard({
  highlight = false,
  className,
  children,
}: {
  highlight?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "bg-panel/95 border border-line p-5 transition duration-200 hover:-translate-y-[3px] hover:border-accent-dim",
        highlight && "border-accent-dim",
        className,
      )}
    >
      {children}
    </div>
  );
}
