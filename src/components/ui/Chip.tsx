export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-[7px] border border-line bg-ink px-2.5 py-1 text-[11.5px] text-fg before:block before:size-1.5 before:flex-none before:bg-accent before:content-['']">
      {children}
    </span>
  );
}
