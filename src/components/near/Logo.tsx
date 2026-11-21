import { cn } from "@/lib/utils";

/**
 * Near Mark: Isotipo oficial del corazón con cintas entrelazadas en degradado turquesa y coral cálido.
 */
export function NearMark({
  className,
  alt = "Near Logo",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={cn("size-10 object-contain drop-shadow-sm select-none", className)}
      loading="eager"
      width={48}
      height={48}
    />
  );
}

/**
 * Near Logo: Isotipo + Tipografía 'near' en azul pizarra oscuro y subtítulo institucional.
 */
export function NearLogo({
  className,
  showSubtitle = true,
}: {
  className?: string;
  showSubtitle?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <NearMark className="size-9 shrink-0" />
      <div className="leading-tight">
        <p className="font-display text-xl font-bold tracking-tight text-[#1E293B] dark:text-[#F8FAFC] flex items-center gap-1">
          near
          <span className="size-1.5 rounded-full bg-[#0EA5E9] inline-block animate-pulse" />
        </p>
        {showSubtitle && (
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
            Apoyo Emocional
          </p>
        )}
      </div>
    </div>
  );
}
