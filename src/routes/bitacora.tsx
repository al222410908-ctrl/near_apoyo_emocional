import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronLeft, Lightbulb, PenLine } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, ScreenHeader } from "@/components/near/AppScreen";
import { moodBg } from "@/components/near/MoodChips";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useNear } from "@/context/NearContext";
import { MOODS, TRIGGERS, moodById } from "@/services/mockData";
import { dayKey } from "@/services/streak";
import { cn } from "@/lib/utils";
import type { MoodEntry, MoodId, TriggerId } from "@/types";

export const Route = createFileRoute("/bitacora")({
  head: () => ({
    meta: [
      { title: "Bitácora emocional · Near Apoyo Emocional" },
      { name: "description", content: "Observa tu semana emocional, tus detonantes y tus reflexiones pasadas." },
      { property: "og:title", content: "Bitácora emocional · Near Apoyo Emocional" },
      { property: "og:description", content: "Observa tu semana emocional, tus detonantes y tus reflexiones pasadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppScreen>
      <Journal />
    </AppScreen>
  ),
});

const DAY_SHORT = ["D", "L", "M", "M", "J", "V", "S"];

function lastSevenDays(moods: MoodEntry[]) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = dayKey(d);
    const dayMoods = moods.filter((m) => dayKey(new Date(m.date)) === key);
    const last = dayMoods.at(-1);
    const avg = dayMoods.length ? dayMoods.reduce((a, m) => a + moodById(m.mood).score, 0) / dayMoods.length : 0;
    return { key, label: DAY_SHORT[d.getDay()], date: d, mood: last?.mood, score: Number(avg.toFixed(1)), isToday: i === 6 };
  });
}

function Journal() {
  const { moods } = useNear();
  const [view, setView] = useState<"animo" | "detonantes">("animo");
  const week = useMemo(() => lastSevenDays(moods), [moods]);
  const triggerData = useMemo(() => {
    const weekStart = week[0]?.key ?? "";
    const recent = moods.filter((m) => dayKey(new Date(m.date)) >= weekStart);
    return TRIGGERS.map((t) => ({ label: t.label, id: t.id, count: recent.filter((m) => m.triggers.includes(t.id)).length }));
  }, [moods, week]);
  const topTrigger = [...triggerData].sort((a, b) => b.count - a.count)[0];
  const entries = [...moods].reverse();

  return (
    <div className="bg-sanctuary pb-6">
      <ScreenHeader
        title="Bitácora"
        subtitle="Tu semana emocional, sin juicios."
        back={
          <Link to="/inicio" className="mt-0.5 grid size-10 place-items-center rounded-full bg-background/70 text-heading" aria-label="Volver">
            <ChevronLeft className="size-5" />
          </Link>
        }
        right={<NewEntrySheet />}
      />

      <div className="space-y-5 px-5">
        <section className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
          <h2 className="mb-3 font-sans text-sm font-semibold text-heading">Últimos 7 días</h2>
          <div className="flex justify-between">
            {week.map((d) => (
              <div key={d.key} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-2xl text-lg",
                    d.mood ? moodBg[d.mood] : "border border-dashed border-input",
                    d.isToday && "ring-2 ring-primary ring-offset-2 ring-offset-surface",
                  )}
                  title={d.mood ? moodById(d.mood).label : "Sin registro"}
                >
                  {d.mood ? moodById(d.mood).emoji : ""}
                </span>
                <span className={cn("text-[11px]", d.isToday ? "font-bold text-primary" : "text-muted-foreground")}>{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sans text-sm font-semibold text-heading">Patrones</h2>
            <div className="flex rounded-full bg-surface-2 p-1 text-xs font-medium">
              {(["animo", "detonantes"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setView(v)} className={cn("rounded-full px-3 py-1.5 transition-colors", view === v ? "bg-background text-heading shadow-sm" : "text-muted-foreground")}>
                  {v === "animo" ? "Ánimo" : "Detonantes"}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              {view === "animo" ? (
                <BarChart data={week} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis domain={[0, 5]} ticks={[1, 3, 5]} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "var(--surface-2)" }} content={<MoodTooltip />} />
                  <Bar dataKey="score" radius={[10, 10, 10, 10]} maxBarSize={28}>
                    {week.map((d) => (
                      <Cell key={d.key} fill={d.score >= 4 ? "var(--secondary)" : d.score >= 2.5 ? "var(--primary-soft)" : "var(--primary)"} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={triggerData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} interval={0} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "var(--surface-2)" }} contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} ${v === 1 ? "vez" : "veces"}`, "Esta semana"]} />
                  <Bar dataKey="count" radius={[10, 10, 10, 10]} maxBarSize={32} fill="var(--secondary)" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          {topTrigger && topTrigger.count > 0 && (
            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-primary-tint p-3 text-sm text-heading">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>
                Esta semana, <strong>{topTrigger.label.toLowerCase()}</strong> apareció más seguido en tus registros. Darte cuenta ya es un gran paso.
              </p>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Reflexiones</h2>
          <div className="space-y-3">
            {entries.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay registros. Empieza con “Escribir”.</p>}
            {entries.map((m, i) => (
              <motion.article key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 6) * 0.04 }} className="rounded-3xl border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <span className={cn("grid size-10 place-items-center rounded-2xl text-lg", moodBg[m.mood])}>{moodById(m.mood).emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-heading">{moodById(m.mood).label}</p>
                    <p className="text-xs text-muted-foreground first-letter:uppercase">
                      {new Date(m.date).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short" })} · {new Date(m.date).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                {m.note && <p className="mt-3 text-sm leading-relaxed text-heading">{m.note}</p>}
                {m.triggers.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.triggers.map((t) => (
                      <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium">
                        {TRIGGERS.find((x) => x.id === t)?.label}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MoodTooltip({ active, payload }: { active?: boolean; payload?: { payload: { mood?: MoodId | undefined; date: Date } }[] }) {
  const d = payload?.[0]?.payload;
  if (!active || !d) return null;
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2 text-xs shadow-soft">
      <p className="font-semibold text-heading first-letter:uppercase">{d.date.toLocaleDateString("es-MX", { weekday: "long" })}</p>
      <p>{d.mood ? `${moodById(d.mood).emoji} ${moodById(d.mood).label}` : "Sin registro"}</p>
    </div>
  );
}

function NewEntrySheet() {
  const { logMood } = useNear();
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<MoodId | null>(null);
  const [triggers, setTriggers] = useState<TriggerId[]>([]);
  const [note, setNote] = useState("");

  const save = () => {
    if (!mood) { toast.error("Elige cómo te sientes"); return; }
    logMood(mood, { triggers, note: note.trim() || undefined });
    toast.success("Reflexión guardada 📝");
    setOpen(false);
    setMood(null);
    setTriggers([]);
    setNote("");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="clay" size="pill">
          <PenLine /> Escribir
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-h-[90vh] max-w-md overflow-y-auto rounded-t-3xl bg-background">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display">Nueva reflexión</SheetTitle>
          <SheetDescription>Escribe sin filtro. Solo tú puedes leerlo.</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 px-4 pb-6">
          <div>
            <p className="mb-2 text-sm font-semibold text-heading">¿Cómo te sientes?</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button key={m.id} type="button" onClick={() => setMood(m.id)} className={cn("rounded-full border px-3 py-1.5 text-sm", mood === m.id ? cn(moodBg[m.id], "border-heading/20 text-heading") : "border-border bg-surface")}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-heading">¿Qué influyó?</p>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((t) => {
                const on = triggers.includes(t.id);
                return (
                  <button key={t.id} type="button" onClick={() => setTriggers((s) => (on ? s.filter((x) => x !== t.id) : [...s, t.id]))} className={cn("rounded-full border px-3 py-1.5 text-sm", on ? "border-secondary bg-secondary-tint text-heading" : "border-border bg-surface")}>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Hoy noté que…" className="min-h-28 rounded-2xl bg-surface text-heading" />
          <Button variant="clay" size="xl" className="w-full" onClick={save}>
            Guardar reflexión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
