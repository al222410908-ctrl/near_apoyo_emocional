import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronLeft, History, Lock, Mic, MicOff, SendHorizontal, Square, Trash2, Volume2, Wind, Waves, AudioLines } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/near/AppScreen";
import { NearMark } from "@/components/near/Logo";
import { SafetyCard } from "@/components/near/SafetyCard";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNear } from "@/context/NearContext";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/useSpeech";
import { CHAT_SUGGESTIONS } from "@/services/mockData";
import { detectCrisis } from "@/services/safety";
import { generateReply, SAFETY_MESSAGE } from "@/services/companion";
import { apiService } from "@/services/api";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat con Near · Apoyo Emocional" },
      { name: "description", content: "Escribe con calma. Near te escucha con respeto, sin juicios y de forma confidencial." },
      { property: "og:title", content: "Chat con Near · Apoyo Emocional" },
      { property: "og:description", content: "Escribe con calma. Near te escucha con respeto, sin juicios y de forma confidencial." },
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

function ChatScreen() {
  const { messages, addMessage, clearMessages, restoreMessages, settings } = useNear();
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const tts = useSpeechSynthesis(settings.voiceRate);
  const stt = useSpeechRecognition({ onFinal: (t) => setText((prev) => (prev ? `${prev} ${t}` : t)) });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, typing]);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const send = async (raw: string) => {
    const value = raw.trim();
    if (!value || typing) return;
    addMessage({ role: "user", text: value });
    setText("");
    setTyping(true);

    try {
      const response = await apiService.sendMessage({
        content: value,
        style: settings.companionStyle,
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
    toast("Conversación borrada", {
      description: "Tu historial se eliminó de este dispositivo.",
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
      : messages.filter((m) => m.role === "user").length === 0
        ? CHAT_SUGGESTIONS
        : [];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/90 px-3 py-3 backdrop-blur-xl">
        <Link to="/inicio" className="grid size-9 shrink-0 place-items-center rounded-full text-heading hover:bg-surface" aria-label="Volver al inicio">
          <ChevronLeft className="size-5" />
        </Link>
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-primary-tint">
          <NearMark className="size-7" />
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-success" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-display text-base font-semibold text-heading">Chat con Near</p>
          <p className="truncate text-xs text-success">{typing ? "Escribiendo con cuidado…" : "Escuchando con respeto"}</p>
        </div>
        <Link to="/voz" className="grid size-9 shrink-0 place-items-center rounded-full text-secondary hover:bg-surface" aria-label="Modo de voz">
          <AudioLines className="size-5" />
        </Link>
        <HistorySheet messages={messages} onClear={clear} />
        <button type="button" onClick={clear} className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-surface" aria-label="Borrar conversación">
          <Trash2 className="size-5" />
        </button>
      </header>

      <div className="flex-1 space-y-3 px-4 py-4">
        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-[11px] text-muted-foreground">
          <Lock className="size-3" /> Cifrado de extremo a extremo
        </div>
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} speaking={tts.speakingId === m.id} onSpeak={() => (tts.speakingId === m.id ? tts.cancel() : tts.speak(m.text, m.id))} />
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex w-fit items-center gap-1 rounded-3xl rounded-bl-md bg-surface px-4 py-3">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="size-2 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border bg-background/95 px-3 pt-2 pb-3 backdrop-blur-xl">
        {!typing && activeSuggestions.length > 0 && (
          <div className="no-scrollbar -mx-3 mb-2 flex gap-2 overflow-x-auto px-3">
            {activeSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="shrink-0 rounded-full border border-primary/20 bg-primary-tint/60 px-3.5 py-1.5 text-xs font-medium text-heading transition-all hover:bg-primary-tint active:scale-95"
              >
                ✨ {s}
              </button>
            ))}
          </div>
        )}
        {stt.listening && (
          <p className="mb-2 px-2 text-xs text-secondary">
            🎙️ Escuchando… {stt.interim && <span className="text-foreground italic">“{stt.interim}”</span>}
          </p>
        )}
        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <button
            type="button"
            onClick={toggleMic}
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-full transition-colors",
              stt.listening ? "bg-secondary text-secondary-foreground" : "bg-surface-2 text-secondary",
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
            placeholder="Escribe lo que sientes…"
            className="max-h-32 min-h-12 flex-1 resize-none rounded-3xl border border-input bg-surface px-4 py-3 text-[15px] text-heading placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            aria-label="Mensaje"
          />
          <Button type="submit" variant="clay" size="icon" className="size-12 shrink-0 rounded-full" disabled={!text.trim() || typing} aria-label="Enviar">
            <SendHorizontal className="size-5" />
          </Button>
        </form>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">Near acompaña, no diagnostica ni sustituye a un profesional.</p>
      </div>
    </div>
  );
}

function MessageBubble({ message, speaking, onSpeak }: { message: ChatMessage; speaking: boolean; onSpeak: () => void }) {
  const mine = message.role === "user";
  if (message.kind === "safety") {
    return (
      <div className="pr-6">
        <SafetyCard />
      </div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex flex-col", mine ? "items-end pl-10" : "items-start pr-10")}>
      <div className={cn("rounded-3xl px-4 py-3 text-[15px] leading-relaxed", mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-surface text-heading")}>
        {message.text}
        {message.action && (
          <Link
            to={message.action === "respiracion" ? "/respiracion" : "/sonidos"}
            className="mt-3 flex items-center gap-2 rounded-2xl bg-background px-3 py-2 text-sm font-semibold text-primary"
          >
            {message.action === "respiracion" ? <Wind className="size-4" /> : <Waves className="size-4" />}
            {message.action === "respiracion" ? "Abrir respiración 4-7-8" : "Escuchar sonidos de calma"}
          </Link>
        )}
      </div>
      <div className="mt-1 flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
        <span>{time(message.createdAt)}</span>
        {!mine && (
          <button type="button" onClick={onSpeak} className="flex items-center gap-1 rounded-full px-1.5 py-0.5 hover:bg-surface" aria-label={speaking ? "Detener audio" : "Escuchar respuesta"}>
            {speaking ? <Square className="size-3 fill-current" /> : <Volume2 className="size-3.5" />}
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
    const k = new Date(m.createdAt).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
    (acc[k] ??= []).push(m);
    return acc;
  }, {});
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button type="button" className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-surface" aria-label="Ver historial">
          <History className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-h-[80vh] max-w-md overflow-y-auto rounded-t-3xl bg-background">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display">Tu historial</SheetTitle>
          <SheetDescription>
            {mine.length} {mine.length === 1 ? "mensaje" : "mensajes"} guardados solo en este dispositivo.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          {Object.keys(groups).length === 0 && <p className="text-sm text-muted-foreground">Aún no hay mensajes. Cuando escribas, aparecerán aquí.</p>}
          {Object.entries(groups).map(([day, list]) => (
            <section key={day}>
              <h3 className="mb-2 font-sans text-xs font-semibold tracking-wide text-muted-foreground uppercase">{day}</h3>
              <ul className="space-y-2">
                {list.map((m) => (
                  <li key={m.id} className="rounded-2xl bg-surface px-3 py-2 text-sm text-heading">
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
