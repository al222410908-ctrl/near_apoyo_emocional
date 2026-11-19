import { useCallback, useEffect, useRef, useState } from "react";

/* Minimal typings for the Web Speech API (not in lib.dom for every browser). */
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"] ?? null) as (new () => SpeechRecognitionLike) | null;
}

/** Speech-to-text in Mexican Spanish. */
export function useSpeechRecognition(opts: { onFinal?: (text: string) => void; onError?: (error: string) => void } = {}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef("");
  const onFinalRef = useRef(opts.onFinal);
  onFinalRef.current = opts.onFinal;
  const onErrorRef = useRef(opts.onError);
  onErrorRef.current = opts.onError;

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
    return () => recRef.current?.abort();
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return false;
    const rec = new Ctor();
    rec.lang = "es-MX";
    rec.interimResults = true;
    rec.continuous = false;
    finalRef.current = "";
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i]?.[0]?.transcript ?? "";
      setInterim(text);
      const last = e.results[e.results.length - 1];
      if (last?.isFinal) finalRef.current = text;
    };
    rec.onend = () => {
      setListening(false);
      const text = (finalRef.current || "").trim();
      setInterim("");
      if (text) onFinalRef.current?.(text);
    };
    rec.onerror = (e) => {
      setListening(false);
      if (e.error !== "no-speech" && e.error !== "aborted") onErrorRef.current?.(e.error);
    };
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
      return false;
    }
    return true;
  }, []);

  const stop = useCallback(() => recRef.current?.stop(), []);

  return { supported, listening, interim, start, stop };
}

/** Text-to-speech with a Spanish voice when available. */
export function useSpeechSynthesis(rate = 1) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback(
    (text: string, id = "near", onEnd?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        onEnd?.();
        return false;
      }
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "es-MX";
      u.rate = rate;
      u.pitch = 1.02;
      const voice =
        synth.getVoices().find((v) => v.lang === "es-MX") ?? synth.getVoices().find((v) => v.lang.startsWith("es"));
      if (voice) u.voice = voice;
      u.onend = () => {
        setSpeakingId(null);
        onEnd?.();
      };
      u.onerror = () => {
        setSpeakingId(null);
        onEnd?.();
      };
      setSpeakingId(id);
      synth.speak(u);
      return true;
    },
    [rate],
  );

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  return { speakingId, speak, cancel };
}
