import { cn } from "@/lib/utils";

/** Near mark: two hearts intertwined into one. */
export function NearMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-10", className)} aria-hidden="true">
      <path
        d="M17 38c-6-4.6-11-9.4-11-16a7.5 7.5 0 0 1 13.5-4.5"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M24 41c-8-5.6-15-11.2-15-19a8 8 0 0 1 15-3.9A8 8 0 0 1 39 22c0 7.8-7 13.4-15 19Z"
        fill="var(--primary-tint)"
        stroke="var(--primary-soft)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M31 38c6-4.6 11-9.4 11-16a7.5 7.5 0 0 0-13.5-4.5"
        fill="none"
        stroke="var(--secondary)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NearLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <NearMark className="size-9" />
      <div className="leading-none">
        <p className="font-display text-xl font-semibold text-heading">Near</p>
        <p className="text-[11px] tracking-wide text-muted-foreground">Apoyo Emocional</p>
      </div>
    </div>
  );
}
