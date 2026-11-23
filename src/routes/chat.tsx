import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  AudioLines,
  ChevronDown,
  ChevronLeft,
  History,
  Lock,
  Mic,
  MicOff,
  SendHorizontal,
  SlidersHorizontal,
  Sparkles,
  Square,
  Trash2,
  Volume2,
  Waves,
  Wind,
} from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/near/AppScreen";
import { NearMark } from "@/components/near/Logo";
import { SafetyCard } from "@/components/near/SafetyCard";
import { GeminiConnectDialog } from "@/components/near/GeminiConnectDialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNear } from "@/context/NearContext";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/useSpeech";
import { CHAT_SUGGESTIONS, COMPANION_STYLES } from "@/services/mockData";
import { generateReply } from "@/services/companion";
import { apiService } from "@/services/api";
import { cn } from "@/lib/utils";
import type { ChatMessage, CompanionStyle } from "@/types";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat con Near IA · Apoyo Emocional" },
      { name: "description", content: "Conversa con Near IA. Acompañamiento emocional preventivo, confidencial y personalizado para universitarios." },
      { property: "og:title", content: "Chat con Near IA · Apoyo Emocional" },
      { property: "og:description", content: "Conversa con Near IA. Acompañamiento emocional preventivo y confidencial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppScreen nav={false}>
      <ChatScreen />
    </AppScreen>
  ),
});

const time = (iso: string) => new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

const STYLE_LABELS: Record<CompanionStyle, string> = {
  calido: "Cálido",
  directo: "Directo",
  silencioso: "Silencioso",
};

function ChatScreen() {
  const { user, messages, addMessage, clearMessages, restoreMessages, settings, updateSettings, addXp, showPill } = useNear();
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [showToneBar, setShowToneBar] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [rewardedSession, setRewardedSession] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const tts = useSpeechSynthesis(settings.voiceRate, settings.voiceEngine ?? "natural");
  const stt = useSpeechRecognition({ onFinal: (t) => setText((prev) => (prev ? `${prev} ${t}` : t)) });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, typing]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const send = async (raw: string) => {
    const value = raw.trim();
    if (!value || typing) return;
    addMessage({ role: "user", text: value });
    setText("");
    setTyping(true);

    if (!rewardedSession) {
      setRewardedSession(true);
      addXp(20);
      showPill({
        emoji: "💬",
        title: "Diálogo con Near IA",
        subtitle: "+20 XP por expresar lo que sientes",
        tone: "primary",
      });
    }

    try {
      const response = await apiService.sendMessage({
        content: value,
        style: settings.companionStyle,
        userId: user?.name,
        apiKey: settings.geminiApiKey,
        history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
      });
      if (response.crisisAlert) {
        addMessage({ role: "near", text: response.reply, kind: "safety" });
      } else {
        addMessage({
          role: "near",
          text: response.reply,
          action: response.action ?? undefined,
          suggestions: response.suggestions ?? undefined,
        });
      }
    } catch {
      const fallback = generateReply(value, settings.companionStyle);
      addMessage({
        role: "near",
        text: fallback.text,
        action: fallback.action,
        suggestions: fallback.suggestions,
      });
    } finally {
      setTyping(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(text);
  };

  const clear = () => {
    const snapshot = messages;
    clearMessages();
    tts.cancel();
    toast("Conversación reiniciada", {
      description: "Tu historial se limpió de este dispositivo.",
      action: { label: "Deshacer", onClick: () => restoreMessages(snapshot) },
    });
  };

  const toggleMic = () => {
    if (stt.listening) return stt.stop();
    if (!stt.start()) toast("Tu navegador no permite dictado por voz", { description: "Prueba en Chrome o escribe tu mensaje." });
  };

  const lastNearMessage = [...messages].reverse().find((m) => m.role === "near");
  const activeSuggestions =
    lastNearMessage?.suggestions && lastNearMessage.suggestions.length > 0
      ? lastNearMessage.suggestions
      : CHAT_SUGGESTIONS;

  return (
    <div className="flex min-h-screen flex-col bg-sanctuary">
      {/* Sticky Tactile AI Studio Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-3 py-3">
          <Link
            to="/inicio"
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-b-[3px] border-border bg-background text-heading transition-transform active:translate-y-0.5"
            aria-label="Volver al inicio"
          >
            <ChevronLeft className="size-4.5" />
          </Link>

          {/* Living Near AI Orb Avatar */}
          <div className="relative grid size-10 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary-tint/70 shadow-xs">
            <NearMark className="size-6" />
            <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-surface bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-display text-base font-bold text-heading">Near IA</p>
              <button
                type="button"
                onClick={() => setShowToneBar((s) => !s)}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-0.5 text-[10px] font-bold text-primary transition-colors hover:bg-primary-tint/50"
                title="Cambiar personalidad de la IA"
              >
                <SlidersHorizontal className="size-2.5" />
                <span>{STYLE_LABELS[settings.companionStyle]}</span>
              </button>
            </div>
            <p className="truncate text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              {typing ? "Analizando con empatía…" : "IA Preventiva · Sesión confidencial"}
            </p>
          </div>

          <GeminiConnectDialog />

          <Link
            to="/voz"
            className="flex items-center gap-1 rounded-xl border border-b-[3px] border-secondary/30 border-b-secondary/60 bg-secondary-tint/70 px-2.5 py-1.5 text-xs font-bold text-secondary transition-transform active:translate-y-0.5"
            aria-label="Modo de voz"
          >
            <AudioLines className="size-4" />
            <span className="hidden sm:inline">Voz</span>
          </Link>

          <HistorySheet messages={messages} onClear={clear} />

          <button
            type="button"
            onClick={clear}
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-b-[3px] border-border bg-background text-muted-foreground hover:text-sos active:translate-y-0.5"
            aria-label="Borrar conversación"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        {/* Collapsible AI Personality Switcher */}
        <AnimatePresence>
          {showToneBar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/70 bg-background/90 px-3 py-2.5"
            >
              <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Personalidad de Near IA en esta conversación:
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {COMPANION_STYLES.map((st) => {
                  const active = settings.companionStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        updateSettings({ companionStyle: st.id });
                        setShowToneBar(false);
                        toast.success(`Modo de IA cambiado a: ${st.label}`);
                      }}
                      className={cn(
                        "rounded-xl border border-b-[3px] px-2.5 py-2 text-left transition-all",
                        active
                          ? "border-primary border-b-primary bg-primary-tint/60 text-heading"
                          : "border-border bg-surface text-muted-foreground hover:text-heading",
                      )}
                    >
                      <span className="block text-xs font-bold text-heading">{STYLE_LABELS[st.id]}</span>
                      <span className="block truncate text-[10px] opacity-80">{st.description}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Message Stream */}
      <div className="flex-1 space-y-3.5 px-4 py-4">
        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface/90 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs">
          <Lock className="size-3 text-emerald-600" /> Espacio privado · Sin diagnósticos clínicos
        </div>

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              speaking={tts.speakingId === m.id}
              onSpeak={() => (tts.speakingId === m.id ? tts.cancel() : tts.speak(m.text, m.id))}
            />
          ))}
        </AnimatePresence>

        {typing && (
          <div className="flex w-fit items-center gap-2 rounded-3xl rounded-tl-md border border-b-[3px] border-border bg-surface px-4 py-3 shadow-xs">
            <NearMark className="size-4 animate-spin" />
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-2 rounded-full bg-primary"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Bottom Sticky AI Command Dock */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-surface/95 px-3 pt-2 pb-3 backdrop-blur-xl">
        {/* Collapsible Suggestions Header + Chips */}
        {!typing && activeSuggestions.length > 0 && (
          <div className="mb-2">
            <div className="mb-1.5 flex items-center justify-between px-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="size-3 text-primary" /> Respuestas sugeridas
              </span>
              <button
                type="button"
                onClick={() => setShowPrompts((p) => !p)}
                className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-heading"
              >
                <span>{showPrompts ? "Ocultar" : "Mostrar"}</span>
                <ChevronDown className={cn("size-3 transition-transform", !showPrompts && "rotate-180")} />
              </button>
            </div>

            <AnimatePresence>
              {showPrompts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="no-scrollbar -mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1"
                >
                  {activeSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="shrink-0 rounded-xl border border-b-[3px] border-border border-b-neutral-300 bg-background px-3 py-1.5 text-xs font-semibold text-heading transition-all hover:border-primary/40 hover:bg-primary-tint/30 active:translate-y-0.5 dark:border-b-neutral-700"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {stt.listening && (
          <p className="mb-2 rounded-xl bg-secondary-tint/60 px-3 py-1.5 text-xs font-medium text-secondary">
            🎙️ Escuchando tu voz… {stt.interim && <span className="text-heading italic">“{stt.interim}”</span>}
          </p>
        )}

        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <button
            type="button"
            onClick={toggleMic}
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-2xl border border-b-[3px] transition-all active:translate-y-0.5",
              stt.listening
                ? "border-secondary border-b-secondary bg-secondary text-secondary-foreground"
                : "border-border border-b-neutral-300 bg-background text-secondary dark:border-b-neutral-700",
            )}
            aria-label={stt.listening ? "Detener dictado" : "Dictar por voz"}
          >
            {stt.listening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </button>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(text);
              }
            }}
            rows={1}
            placeholder="Cuéntale a Near qué tienes en mente…"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-b-[3px] border-border border-b-neutral-300 bg-background px-4 py-2.5 text-sm text-heading placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:border-b-neutral-700"
            aria-label="Mensaje"
          />

          <button
            type="submit"
            disabled={!text.trim() || typing}
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-b-[3px] border-primary border-b-[#693222] bg-clay text-primary-foreground shadow-sm transition-all active:translate-y-0.5 disabled:opacity-40"
            aria-label="Enviar"
          >
            <SendHorizontal className="size-5" />
          </button>
        </form>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          Near IA brinda orientación preventiva; no realiza diagnósticos clínicos.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  speaking,
  onSpeak,
}: {
  message: ChatMessage;
  speaking: boolean;
  onSpeak: () => void;
}) {
  const mine = message.role === "user";
  if (message.kind === "safety") {
    return (
      <div className="pr-4">
        <SafetyCard />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col", mine ? "items-end pl-10" : "items-start pr-8")}
    >
      <div
        className={cn(
          "rounded-3xl border border-b-[3px] px-4 py-3 text-sm leading-relaxed shadow-xs",
          mine
            ? "rounded-br-md border-primary/80 border-b-[#693222] bg-clay text-primary-foreground"
            : "rounded-bl-md border-border border-b-neutral-300 bg-surface text-heading dark:border-b-neutral-800",
        )}
      >
        {!mine && (
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
            <span>Near IA</span>
          </div>
        )}
        <p>{message.text}</p>

        {message.action && (
          <Link
            to={message.action === "respiracion" ? "/respiracion" : "/sonidos"}
            className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-b-[3px] border-primary/30 border-b-primary/60 bg-background px-3.5 py-2.5 text-xs font-bold text-primary transition-transform active:translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              {message.action === "respiracion" ? <Wind className="size-4" /> : <Waves className="size-4" />}
              {message.action === "respiracion"
                ? "Iniciar respiración guiada 4-7-8"
                : "Abrir paisajes sonoros de calma"}
            </span>
            <span>→</span>
          </Link>
        )}
      </div>

      <div className="mt-1 flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
        <span>{time(message.createdAt)}</span>
        {!mine && (
          <button
            type="button"
            onClick={onSpeak}
            className="flex items-center gap-1 rounded-full px-2 py-0.5 font-medium hover:bg-surface"
            aria-label={speaking ? "Detener audio" : "Escuchar respuesta"}
          >
            {speaking ? <Square className="size-3 fill-current text-primary" /> : <Volume2 className="size-3.5" />}
            {speaking ? "Detener" : "Escuchar"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function HistorySheet({ messages, onClear }: { messages: ChatMessage[]; onClear: () => void }) {
  const mine = messages.filter((m) => m.role === "user");
  const groups = mine.reduce<Record<string, ChatMessage[]>>((acc, m) => {
    const k = new Date(m.createdAt).toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    (acc[k] ??= []).push(m);
    return acc;
  }, {});
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-b-[3px] border-border bg-background text-muted-foreground hover:text-heading active:translate-y-0.5"
          aria-label="Ver historial"
        >
          <History className="size-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-h-[80vh] max-w-md overflow-y-auto rounded-t-3xl bg-background">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display">Tu historial con Near IA</SheetTitle>
          <SheetDescription>
            {mine.length} {mine.length === 1 ? "mensaje guardado" : "mensajes guardados"} localmente en tu dispositivo.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          {Object.keys(groups).length === 0 && (
            <p className="text-sm text-muted-foreground">Aún no hay mensajes. Cuando escribas, aparecerán aquí.</p>
          )}
          {Object.entries(groups).map(([day, list]) => (
            <section key={day}>
              <h3 className="mb-2 font-sans text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {day}
              </h3>
              <ul className="space-y-2">
                {list.map((m) => (
                  <li key={m.id} className="rounded-2xl border border-border bg-surface px-3 py-2 text-sm text-heading">
                    <span className="mr-2 text-xs text-muted-foreground">{time(m.createdAt)}</span>
                    {m.text}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="p-4">
          <Button variant="outline" className="w-full rounded-2xl border-sos/30 text-sos" onClick={onClear}>
            <Trash2 /> Borrar todo el historial
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
