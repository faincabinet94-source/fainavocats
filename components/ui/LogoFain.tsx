interface LogoFainProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LogoFain({ className = "", size = "md" }: LogoFainProps) {
  const sizes = {
    sm: { fain: "text-2xl", avocats: "text-xs", lineW: "w-full", gap: "gap-1.5" },
    md: { fain: "text-3xl", avocats: "text-sm", lineW: "w-full", gap: "gap-2" },
    lg: { fain: "text-5xl", avocats: "text-base", lineW: "w-full", gap: "gap-3" },
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center ${s.gap} ${className}`}>
      <span
        className={`font-serif font-normal tracking-[0.25em] text-[#1A1A1A] leading-none ${s.fain}`}
      >
        FAIN
      </span>
      <div className={`${s.lineW} h-px bg-[#1A1A1A]`} />
      <span
        className={`font-sans font-normal tracking-[0.4em] text-[#1A1A1A] leading-none ${s.avocats}`}
      >
        AVOCATS
      </span>
    </div>
  );
}
