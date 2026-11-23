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

/**
 * Limpia el texto de emojis y formato Markdown para que la voz no deletree
 * asteriscos, corchetes o símbolos extraños, logrando una locución natural y fluida.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return "";
  return text
    // Eliminar emojis
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/gu, "")
    // Eliminar formato Markdown (**negrita**, *cursiva*, # titulos)
    .replace(/\*{1,3}(.*?)\*{1,3}/g, "$1")
    .replace(/_{1,3}(.*?)_{1,3}/g, "$1")
    .replace(/`{1,3}(.*?)(`{1,3}|$)/g, "$1")
    .replace(/#+\s*/g, "")
    // Eliminar corchetes y URLs de enlaces
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    // Limpiar signos excesivos y espacios
    .replace(/!{2,}/g, "!")
    .replace(/\?{2,}/g, "?")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Divide el texto en fragmentos naturales basados en puntuación (puntos, comas, etc.)
 * para que el motor de voz neural en streaming suene continuo y sin latencia.
 */
export function splitIntoSpeechChunks(text: string, maxLen = 140): string[] {
  const clean = cleanTextForSpeech(text);
  if (!clean) return [];
  const parts = clean.split(/(?<=[.?!,;:\n])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const part of parts) {
    if (!part.trim()) continue;
    if ((current + " " + part).trim().length <= maxLen) {
      current = (current + " " + part).trim();
    } else {
      if (current) chunks.push(current);
      if (part.length > maxLen) {
        const words = part.split(/\s+/);
        let subCurrent = "";
        for (const w of words) {
          if ((subCurrent + " " + w).trim().length <= maxLen) {
            subCurrent = (subCurrent + " " + w).trim();
          } else {
            if (subCurrent) chunks.push(subCurrent);
            subCurrent = w;
          }
        }
        current = subCurrent;
      } else {
        current = part;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [clean];
}

/**
 * Reproduce audio natural en español de México (es-MX) con entonación humana real
 * a través del streaming de voz neural de Google en HTML5 Audio.
 */
export function playNaturalSpeechAudio(
  text: string,
  onEnd?: () => void,
  onError?: () => void,
): { stop: () => void } {
  if (typeof window === "undefined") {
    onEnd?.();
    return { stop: () => {} };
  }

  const chunks = splitIntoSpeechChunks(text);
  if (chunks.length === 0) {
    onEnd?.();
    return { stop: () => {} };
  }

  let currentIndex = 0;
  let currentAudio: HTMLAudioElement | null = null;
  let stopped = false;

  const playNext = () => {
    if (stopped) return;
    if (currentIndex >= chunks.length) {
      onEnd?.();
      return;
    }

    const chunk = chunks[currentIndex++];
    const encoded = encodeURIComponent(chunk);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es-MX&client=tw-ob&q=${encoded}`;

    try {
      const audio = new Audio();
      currentAudio = audio;
      audio.preload = "auto";
      audio.src = url;

      audio.onended = () => {
        playNext();
      };

      audio.onerror = () => {
        if (!stopped) {
          stopped = true;
          onError?.();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (!stopped) {
            stopped = true;
            onError?.();
          }
        });
      }
    } catch {
      if (!stopped) {
        stopped = true;
        onError?.();
      }
    }
  };

  playNext();

  return {
    stop: () => {
      stopped = true;
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.src = "";
        } catch {
          // ignore
        }
      }
    },
  };
}

/**
 * Selecciona la voz en español más dulce, cálida y amigable disponible en el dispositivo.
 * Prioriza voces neuronales/naturales de México (como Microsoft Sabina, Dalia, Paulina o Google).
 */
export function pickFriendlyVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1. Voces mexicanas de alta calidez (Microsoft Sabina, Dalia, Paulina, Google)
  const mxPreferred = [
    /Sabina/i,                         // Microsoft Sabina (Online/Natural - México)
    /Dalia/i,                          // Microsoft Dalia (Online/Natural - México)
    /Paulina/i,                        // Apple Paulina (México)
    /Google.*español.*(m[ée]x|mexico)/i,
    /es-MX.*natural/i,
    /Natural.*es-MX/i,
  ];

  for (const pat of mxPreferred) {
    const found = voices.find((v) => pat.test(v.name) && (v.lang.includes("MX") || v.lang.startsWith("es")));
    if (found) return found;
  }

  // 2. Voces naturales/neurales en español (Microsoft Online, Google)
  const naturalVoices = voices.filter(
    (v) => v.lang.startsWith("es") && (/natural/i.test(v.name) || /neural/i.test(v.name) || /online/i.test(v.name))
  );
  if (naturalVoices.length > 0) return naturalVoices[0];

  // 3. Voces de Google en español (muy fluidas y no robóticas en Chrome y Android)
  const googleVoices = voices.filter((v) => v.lang.startsWith("es") && /google/i.test(v.name));
  if (googleVoices.length > 0) return googleVoices[0];

  // 4. Cualquier voz es-MX o es-419 (Latinoamérica)
  const esMxVoices = voices.filter(
    (v) => v.lang === "es-MX" || v.lang === "es_MX" || v.lang === "es-419" || v.lang.includes("MX")
  );
  if (esMxVoices.length > 0) return esMxVoices[0];

  // 5. Cualquier voz en español
  const anySpanish = voices.filter((v) => v.lang.startsWith("es"));
  if (anySpanish.length > 0) return anySpanish[0];

  return null;
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

/**
 * Text-to-speech híbrido de alta fidelidad:
 * - Modo "natural" (predeterminado): Usa streaming neural en español mexicano con tono cálido,
 *   y conmuta automáticamente a la voz de sistema si la red no estuviera disponible.
 * - Modo "browser": Utiliza la síntesis interna del navegador seleccionando la voz más humana.
 */
export function useSpeechSynthesis(rate = 1, engine: "natural" | "browser" = "natural") {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const heartbeatRef = useRef<number | null>(null);
  const naturalAudioRef = useRef<{ stop: () => void } | null>(null);

  // Precarga asíncrona de voces para evitar que devuelva array vacío en Chrome/Edge/Safari
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const v = synth.getVoices();
      if (v && v.length > 0) {
        voicesRef.current = v;
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      synth.cancel();
      if (naturalAudioRef.current) {
        naturalAudioRef.current.stop();
        naturalAudioRef.current = null;
      }
    };
  }, []);

  const speakBrowser = useCallback(
    (cleanText: string, id: string, onEnd?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        onEnd?.();
        return false;
      }

      const synth = window.speechSynthesis;
      synth.cancel();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);

      const u = new SpeechSynthesisUtterance(cleanText);
      u.lang = "es-MX";
      u.rate = Math.max(0.7, Math.min(1.2, rate * 0.93));
      u.pitch = 1.05;

      const currentVoices = voicesRef.current.length > 0 ? voicesRef.current : synth.getVoices();
      const bestVoice = pickFriendlyVoice(currentVoices);
      if (bestVoice) {
        u.voice = bestVoice;
      }

      const cleanup = () => {
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
          heartbeatRef.current = null;
        }
        setSpeakingId(null);
      };

      u.onend = () => {
        cleanup();
        onEnd?.();
      };

      u.onerror = () => {
        cleanup();
        onEnd?.();
      };

      setSpeakingId(id);

      heartbeatRef.current = window.setInterval(() => {
        if (synth.speaking && !synth.paused) {
          synth.pause();
          synth.resume();
        } else if (!synth.speaking) {
          cleanup();
        }
      }, 7000);

      window.setTimeout(() => {
        try {
          synth.speak(u);
        } catch {
          cleanup();
          onEnd?.();
        }
      }, 40);

      return true;
    },
    [rate],
  );

  const speak = useCallback(
    (text: string, id = "near", onEnd?: () => void) => {
      // Detener cualquier audio previo
      if (naturalAudioRef.current) {
        naturalAudioRef.current.stop();
        naturalAudioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }

      const cleanText = cleanTextForSpeech(text);
      if (!cleanText) {
        onEnd?.();
        return false;
      }

      setSpeakingId(id);

      // Si el motor seleccionado es "natural", intentamos reproducción neural es-MX
      if (engine === "natural") {
        naturalAudioRef.current = playNaturalSpeechAudio(
          cleanText,
          () => {
            setSpeakingId(null);
            naturalAudioRef.current = null;
            onEnd?.();
          },
          () => {
            // Fallback transparente a síntesis del navegador si falla la red
            naturalAudioRef.current = null;
            speakBrowser(cleanText, id, onEnd);
          },
        );
        return true;
      }

      // Motor del navegador directo
      return speakBrowser(cleanText, id, onEnd);
    },
    [engine, speakBrowser],
  );

  const cancel = useCallback(() => {
    if (naturalAudioRef.current) {
      naturalAudioRef.current.stop();
      naturalAudioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    setSpeakingId(null);
  }, []);

  return { speakingId, speak, cancel };
}
