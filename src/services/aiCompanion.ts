/**
 * Near AI Companion Service
 * Provee respuestas reales, dinámicas, verídicas y contextualizadas generadas por IA en vivo.
 * Integra:
 * 1. Protocolo de Seguridad y Crisis (detectCrisis) que intercepta de inmediato cualquier ideación de riesgo.
 * 2. Motor de IA Gratuito en Vivo (OpenAI/Pollinations Cloud LLM + Google Gemini API) con base de conocimiento
 *    de Near y de la Universidad Tecnológica del Valle de Toluca (UTVT).
 * 3. Memoria conversacional completa para mantener el hilo real del diálogo sin repetir respuestas predefinidas.
 */

import type { CompanionStyle } from "@/types";
import { detectCrisis } from "./safety";

export interface AIResponseResult {
  reply: string;
  action?: "respiracion" | "sonidos" | "sos" | null;
  riskScore: number;
  crisisAlert: boolean;
  suggestions?: string[];
  modelUsed: "gemini" | "live-ai" | "safety";
}

export interface ChatHistoryItem {
  role: "user" | "near";
  text: string;
}

const SAFETY_CRISIS_REPLY =
  "Escucho que estás pasando por un momento muy difícil y doloroso. Tu vida y tu tranquilidad son lo más importante. Por favor, comunícate en este instante con un profesional de la Línea de la Vida (800 911 2000). Es gratis y confidencial las 24 horas. No estás solo/a.";

const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

/**
 * Base de Conocimiento de Near y de la Universidad Tecnológica del Valle de Toluca (UTVT)
 */
function buildKnowledgePrompt(style: CompanionStyle, userName?: string): string {
  const styleInstruction =
    style === "directo"
      ? "Adopta un tono directo: práctico, claro, estructurado y enfocado en resolver o dar pasos accionables concretos."
      : style === "silencioso"
        ? "Adopta un tono sereno y breve: pausado, cálido, de pocas palabras pero mucha presencia empática."
        : "Adopta un tono cálido y amigable: cercano, empático, natural y reconfortante, como un compañero comprensivo.";

  return `Eres Near, la inteligencia artificial de apoyo emocional, orientación estudiantil y bienestar preventivo de la Universidad Tecnológica del Valle de Toluca (UTVT, ubicada en Lerma / Santa María Atarasquillo, Estado de México).
El estudiante con quien conversas se llama ${userName || "estudiante"}.

BASE DE CONOCIMIENTO VERÍDICA QUE DOMINAS:
1. Contexto Universitario UTVT:
   - Carreras como TIC (Tecnologías de la Información y Comunicación: Desarrollo de Software Multiplataforma, Infraestructura de Redes Digitales, Entornos Virtuales), Mecatrónica, Negocios, Procesos Industriales, Enfermería, etc.
   - Retos reales de los alumnos: proyectos integradores por cuatrimestre, estadías profesionales, exámenes parciales, depuración de código, bases de datos (MongoDB, SQL), servidores, estrés por entregas, desvelos, transporte y presión académica o familiar.
2. Conocimiento Psicológico y Científico Verídico (Primeros Auxilios Psicológicos - PAP):
   - Fisiología del estrés y ansiedad: activación del sistema nervioso simpático y cómo regularlo activando el sistema parasimpático y el nervio vago.
   - Técnica de respiración 4-7-8 (inhalar 4s, retener 7s, exhalar 8s) disponible en el módulo "Respiración" de Near.
   - Técnica de grounding / enraizamiento sensorial 5-4-3-2-1 para bajar picos de ansiedad.
   - Paisajes sonoros (lluvia, bosque, olas, fogata) disponibles en el módulo "Sonidos" de Near para enfoque o descanso.
   - Hábitos de estudio: técnica Pomodoro, división de tareas complejas en micro-pasos, higiene del sueño y manejo del síndrome del impostor.
3. Líneas Oficiales en México (para casos de crisis):
   - Línea de la Vida: 800 911 2000 (24/7, gratuita).
   - SAPTEL: 55 5259 8121.

REGLAS OBLIGATORIAS PARA RESPONDER:
- ${styleInstruction}
- Responde SIEMPRE de manera específica y directa a lo que el usuario acaba de preguntar o contar. NUNCA uses frases genéricas repetitivas ni plantillas predefinidas.
- Si el usuario te hace una pregunta de conocimiento, técnica, académica o sobre un consejo concreto, dale una respuesta verídica, útil y bien explicada.
- Si el usuario se está desahogando emocionalmente, valida específicamente su situación y hazle una pregunta o sugerencia personalizada sobre lo que mencionó.
- Habla en español de México natural y fluido.
- Mantén una extensión ágil de 2 a 4 oraciones (alrededor de 45 a 85 palabras) para que sea muy cómodo de leer y escuchar por voz.
- NO uses asteriscos de Markdown (**negritas**), ni numerales (#), ni tablas, para que el motor de voz lo lea de forma 100% humana y natural.`;
}

/**
 * Limpia cualquier residuo de markdown para que tanto el chat como la voz se escuchen limpios.
 */
function sanitizeAIOutput(raw: string): string {
  return raw
    .replace(/\*{1,3}(.*?)\*{1,3}/g, "$1")
    .replace(/#+\s*/g, "")
    .replace(/`{1,3}(.*?)(`{1,3}|$)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Prueba una clave API de Google Gemini enviando una consulta mínima de verificación.
 */
export async function testGeminiApiKey(apiKey: string): Promise<{ ok: boolean; message: string }> {
  if (!apiKey || apiKey.trim().length < 15) {
    return { ok: false, message: "La clave debe tener al menos 15 caracteres." };
  }

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Responde: OK" }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      });

      if (response.ok) {
        return { ok: true, message: `¡Conexión con Google Gemini (${model}) verificada!` };
      }
    } catch {
      // probar siguiente modelo
    }
  }

  return { ok: false, message: "No se pudo validar la clave. Verifica que sea una API Key activa de Google AI Studio." };
}

/**
 * 1. Motor Google Gemini API (cuando el usuario configura su clave de Google AI Studio)
 */
async function callGeminiApi(
  prompt: string,
  style: CompanionStyle,
  apiKey: string,
  userName?: string,
  history: ChatHistoryItem[] = [],
): Promise<string | null> {
  const systemInstruction = buildKnowledgePrompt(style, userName);

  const recentHistory = history
    .filter((item) => item.text && item.text.trim().length > 0)
    .slice(-8)
    .map((item) => ({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.text }],
    }));

  const contents = [
    ...recentHistory,
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && typeof text === "string" && text.trim().length > 0) {
          return sanitizeAIOutput(text);
        }
      }
    } catch {
      // Intentar siguiente modelo de Gemini
    }
  }

  return null;
}

/**
 * 2. Motor de IA Gratuito en Vivo sin necesidad de API Key (Pollinations OpenAI-compatible Cloud LLM)
 * Funciona de inmediato para todos los usuarios con memoria conversacional y conocimiento real.
 */
async function callFreeLiveLLM(
  prompt: string,
  style: CompanionStyle,
  userName?: string,
  history: ChatHistoryItem[] = [],
): Promise<string | null> {
  const systemPrompt = buildKnowledgePrompt(style, userName);

  const recentMessages = history
    .filter((item) => item.text && item.text.trim().length > 0)
    .slice(-8)
    .map((item) => ({
      role: item.role === "user" ? ("user" as const) : ("assistant" as const),
      content: item.text,
    }));

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...recentMessages,
    { role: "user" as const, content: prompt },
  ];

  const modelsToTry = ["openai", "mistral"];

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);

      const response = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content && typeof content === "string" && content.trim().length > 0) {
          return sanitizeAIOutput(content);
        }
      }
    } catch {
      // Probar siguiente modelo en caso de timeout o red
    }
  }

  return null;
}

/**
 * Detecta si la respuesta de la IA sugiere abrir el módulo de respiración o sonidos.
 */
function detectSuggestedAction(replyText: string): "respiracion" | "sonidos" | null {
  const lower = replyText.toLowerCase();
  if (/4-7-8|inhala|exhala|ejercicio de respiraci/.test(lower)) {
    return "respiracion";
  }
  if (/paisaje sonoro|sonidos de lluvia|sonidos de bosque|m[úu]sica de calma/.test(lower)) {
    return "sonidos";
  }
  return null;
}

/**
 * Función principal que genera la respuesta de Near IA:
 * 1. Filtro ético de emergencia (detectCrisis).
 * 2. Google Gemini API si hay clave configurada.
 * 3. Motor de IA Gratuito en Vivo (LLM en la nube sin clave) con historial y conocimiento real.
 */
export async function generatePrudentAIResponse(
  userText: string,
  style: CompanionStyle,
  userName?: string,
  apiKey?: string,
  history: ChatHistoryItem[] = [],
): Promise<AIResponseResult> {
  const trimmed = userText.trim();

  // 1. Verificación de crisis inmediata (Protocolo ético obligatorio)
  if (detectCrisis(trimmed)) {
    return {
      reply: SAFETY_CRISIS_REPLY,
      action: "sos",
      riskScore: 1.0,
      crisisAlert: true,
      modelUsed: "safety",
    };
  }

  // 2. Si el usuario configuró una clave de Google Gemini, usar Gemini API
  const effectiveKey =
    apiKey || (typeof import.meta !== "undefined" ? import.meta.env?.VITE_GEMINI_API_KEY : undefined);

  if (effectiveKey && effectiveKey.trim().length > 10) {
    const geminiReply = await callGeminiApi(trimmed, style, effectiveKey, userName, history);
    if (geminiReply) {
      return {
        reply: geminiReply,
        action: detectSuggestedAction(geminiReply),
        riskScore: 0.1,
        crisisAlert: false,
        modelUsed: "gemini",
      };
    }
  }

  // 3. Motor de IA Gratuito en Vivo (funciona automáticamente sin necesidad de API Key)
  const liveReply = await callFreeLiveLLM(trimmed, style, userName, history);
  if (liveReply) {
    return {
      reply: liveReply,
      action: detectSuggestedAction(liveReply),
      riskScore: 0.1,
      crisisAlert: false,
      modelUsed: "live-ai",
    };
  }

  // 4. Solo si el dispositivo del usuario no tiene conexión a internet en absoluto
  return {
    reply: `Perdona ${userName ? `${userName}, ` : ""}en este instante parece que no hay conexión a internet para procesar tu mensaje con la IA en vivo. Verifica tu red e inténtalo de nuevo; aquí sigo contigo.`,
    action: null,
    riskScore: 0.0,
    crisisAlert: false,
    modelUsed: "live-ai",
  };
}
