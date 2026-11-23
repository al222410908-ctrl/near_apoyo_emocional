/**
 * Near AI Companion Service
 * Provee respuestas empáticas, verídicas y contextualizadas para estudiantes universitarios.
 * Integra:
 * 1. Protocolo de Seguridad y Crisis (detectCrisis) que intercepta de inmediato cualquier ideación de riesgo.
 * 2. Conexión nativa con Google Gemini API (Gemini 1.5 Flash / 2.0 Flash) con base de conocimiento institucional de Near y la UTVT.
 * 3. Memoria conversacional para mantener el hilo de la charla y recordar el nombre del estudiante.
 * 4. Motor Empático Autónomo de Near (Simulación Neural Local) para funcionamiento continuo sin internet o sin clave.
 */

import type { CompanionStyle } from "@/types";
import { detectCrisis } from "./safety";

export interface AIResponseResult {
  reply: string;
  action?: "respiracion" | "sonidos" | "sos" | null;
  riskScore: number;
  crisisAlert: boolean;
  suggestions: string[];
  modelUsed: "gemini" | "near-neural";
}

export interface ChatHistoryItem {
  role: "user" | "near";
  text: string;
}

const SAFETY_CRISIS_REPLY =
  "Escucho que estás pasando por un momento muy difícil y doloroso. Tu vida y tu tranquilidad son lo más importante. Por favor, comunícate en este instante con un profesional de la Línea de la Vida (800 911 2000). Es gratis y confidencial las 24 horas. No estás solo/a.";

const CRISIS_SUGGESTIONS = [
  "Llamar a Línea de la Vida (800 911 2000)",
  "Contactar a SAPTEL (55 5259 8121)",
  "Hablar con un tutor o familiar",
];

const GEMINI_MODELS = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

/**
 * Base de Conocimiento de Near y de la Universidad Tecnológica del Valle de Toluca (UTVT)
 */
function buildKnowledgePrompt(style: CompanionStyle, userName?: string): string {
  const styleInstruction =
    style === "directo"
      ? "Adopta un tono directo: conciso, estructurado, enfocado en ordenar los pendientes y dar un micro-paso práctico realizable hoy."
      : style === "silencioso"
        ? "Adopta un tono silencioso: muy breve, pausado, brindando espacio y contención sin saturar."
        : "Adopta un tono cálido: dulce, profundamente empático, validando que lo que siente tiene sentido y acompañando con ternura.";

  return `Eres Near, la inteligencia artificial de apoyo emocional y salud mental preventiva de la Universidad Tecnológica del Valle de Toluca (UTVT) en México.
Tu interlocutor es un estudiante universitario llamado ${userName || "estudiante"}.

CONOCIMIENTO INTEGRAL DE NEAR Y DE LA UTVT:
1. Contexto Académico y Estudiantil:
   - Los estudiantes pertenecen a carreras tecnológicas como TIC (Tecnologías de la Información y Comunicación: Desarrollo de Software, Redes, Ciberseguridad).
   - Suelen enfrentar estrés por exámenes parciales, proyectos integradores de programación, entregas de cuatrimestre, desveladas, presión familiar y miedo a reprobar materias.
2. Módulos y herramientas dentro de la plataforma Near que puedes recomendar cuando sea oportuno:
   - "Laboratorio de Calma": Guía de respiración 4-7-8 (inhalar en 4s, retener en 7s, exhalar en 8s) y enraizamiento somático 5-4-3-2-1 para reducir ansiedad física.
   - "Paisajes Sonoros": Lluvia suave, olas del mar, bosque templado y fogata relajante para estudiar o descansar.
   - "Bitácora Anímica": Registro diario del estado de ánimo con rueda emocional y detonantes.
   - "Cápsulas Preventivas": Micro-aprendizajes para vencer el síndrome del impostor en programación y la parálisis por perfeccionismo.
3. Protocolo Ético de Emergencia:
   - Si detectas intención de autolesión o crisis severa, prioriza la seguridad y refiere a la Línea de la Vida (800 911 2000, 24/7) y a SAPTEL (55 5259 8121).

REGLAS DE COMUNICACIÓN VERÍDICA Y HUMANA:
- ${styleInstruction}
- Habla en español de México natural, empático, sin modismos forzados ni tecnicismos médicos.
- Responde de forma CONCISA: 1 o máximo 2 párrafos breves (máximo 50 a 65 palabras en total). Esto es VITAL porque tu respuesta será leída por un sintetizador de voz amigable.
- Valida la emoción del estudiante antes de ofrecer soluciones.
- NO uses asteriscos de formato markdown (como **negritas** ni *cursivas*) ni listas con viñetas ni emojis excesivos, para que la locución de voz suene completamente natural y fluida.
- Eres un apoyo preventivo entre pares; no diagnostiques enfermedades psiquiátricas ni prometas curas médicas.`;
}

/**
 * Prueba una clave API de Gemini enviando una consulta mínima de verificación.
 */
export async function testGeminiApiKey(apiKey: string): Promise<{ ok: boolean; message: string }> {
  if (!apiKey || apiKey.trim().length < 15) {
    return { ok: false, message: "La clave debe tener al menos 15 caracteres." };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "Responde únicamente: OK" }],
          },
        ],
        generationConfig: { maxOutputTokens: 10 },
      }),
    });

    if (response.ok) {
      return { ok: true, message: "¡Conexión con Gemini verificada con éxito!" };
    }
    const errData = await response.json().catch(() => null);
    const msg = errData?.error?.message || `Error del servidor (${response.status})`;
    return { ok: false, message: msg };
  } catch (e) {
    return { ok: false, message: "No se pudo conectar con el servidor de Google Gemini." };
  }
}

/**
 * Consulta la API de Google Gemini con memoria y base de conocimiento.
 */
async function callGeminiApi(
  prompt: string,
  style: CompanionStyle,
  apiKey: string,
  userName?: string,
  history: ChatHistoryItem[] = []
): Promise<string | null> {
  const systemInstruction = buildKnowledgePrompt(style, userName);

  // Formatear los últimos 4 mensajes del historial para que Gemini mantenga contexto
  const recentHistory = history.slice(-4).map((item) => ({
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
            temperature: 0.65,
            maxOutputTokens: 160,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && typeof text === "string" && text.trim().length > 0) {
          // Limpiar asteriscos y formato markdown que puedan haber escapado
          return text.replace(/\*+/g, "").replace(/#+/g, "").trim();
        }
      }
    } catch {
      // Intentar con el siguiente modelo si este falla
    }
  }

  return null;
}

/**
 * Motor Empático Autónomo de Near (Simulación Neural Preventiva Local).
 * Responde con conocimiento de la UTVT cuando Gemini no tiene clave o no hay internet.
 */
function generateEmpatheticLocalResponse(
  text: string,
  style: CompanionStyle,
  userName?: string
): { reply: string; action?: "respiracion" | "sonidos" | null; suggestions: string[] } {
  const lower = text.toLowerCase();
  const namePrefix = userName ? `${userName}, ` : "";

  // 1. Exámenes, proyectos de programación, entregas de cuatrimestre
  if (/examen|parcial|final|calificaci|reprobar|estudi|tarea|entrega|proyecto|materia|profesor|profe|programaci|codigo|base de datos/.test(lower)) {
    if (style === "directo") {
      return {
        reply: `${namePrefix}la presión académica en la UTVT puede sentirse muy pesada cuando se juntan los proyectos y parciales. Vamos a ordenar prioridades: ¿cuál es el pendiente que más te preocupa hoy y cómo podemos dividirlo en un solo micro-paso de diez minutos?`,
        action: "respiracion",
        suggestions: ["Dividir pendientes en pasos", "Hacer respiración 4-7-8", "Desahogarme un rato"],
      };
    }
    if (style === "silencioso") {
      return {
        reply: `Esa carga escolar pesa mucho. Respira conmigo un segundo; aquí estoy escuchándote.`,
        action: "respiracion",
        suggestions: ["Hacer pausa de 2 min", "Organizar mis temas"],
      };
    }
    return {
      reply: `${namePrefix}entiendo lo pesado que se siente tener tantas entregas y parciales encima. Recuerda que una nota o un código con errores no define tu capacidad como persona. Tómate un respiro hondo y vamos paso a pasito. ¿Qué parte sientes más difícil ahorita?`,
      action: "respiracion",
      suggestions: ["Hacer respiración 4-7-8", "Contarte qué me preocupa", "Tomar una pausa de calma"],
    };
  }

  // 2. Ansiedad, pánico, pecho apretado, nerviosismo
  if (/ansied|nervio|panico|pecho|asfixi|miedo|desesperad|estres|agobi/.test(lower)) {
    return {
      reply: `${namePrefix}lo que sientes en tu cuerpo en este momento es real, pero estás a salvo aquí. Coloca una mano sobre tu pecho, siente cómo sube y baja, e intentemos juntos una respiración lenta: inhala en cuatro, retén en siete y suelta en ocho.`,
      action: "respiracion",
      suggestions: ["Hacer respiración 4-7-8", "Poner sonidos de lluvia", "Platicar con calma"],
    };
  }

  // 3. Cansancio, agotamiento, sueño, insomnio
  if (/cansad|agotad|no dormi|sueno|insomnio|desvel|noche|exhaust|sin energia/.test(lower)) {
    return {
      reply: `${namePrefix}tu mente y tu cuerpo te están pidiendo una pausa bien merecida. A veces forzarse a seguir solo desgasta más. ¿Qué te parece si ponemos unos minutos de lluvia suave o sonidos de bosque para que descanses la mirada?`,
      action: "sonidos",
      suggestions: ["Poner sonidos de lluvia", "Hacer pausa de relajación", "Registrar en bitácora"],
    };
  }

  // 4. Tristeza, soledad, vacío, desánimo
  if (/triste|sol[oa]\b|llorar|vacio|extran|nadie|desanim/.test(lower)) {
    return {
      reply: `${namePrefix}lamento mucho que estés sintiendo este dolor. No estás solo/a en este momento; permítete sentir sin juzgarte, porque la tristeza también necesita su espacio. Aquí estoy para escucharte con todo el tiempo del mundo.`,
      action: null,
      suggestions: ["Solo quiero desahogarme", "Hacer una pausa tranquila", "Gracias por escucharme"],
    };
  }

  // 5. Saludo inicial
  if (/^(hola|buen[oa]s|hey|que tal)/.test(lower)) {
    return {
      reply: `¡Hola ${namePrefix}! Qué gusto tenerte por aquí en Near. Este es tu espacio seguro y confidencial de la UTVT. ¿Cómo te has sentido el día de hoy?`,
      action: null,
      suggestions: ["Tengo un poco de estrés", "Necesito calmarme", "Solo venía a saludar"],
    };
  }

  // 6. Agradecimiento
  if (/gracias|me ayudo|alivio|muchas gracias/.test(lower)) {
    return {
      reply: `Me alegra mucho acompañarte, ${userName || "amigo/a"}. Recuerda que este refugio siempre está disponible para ti cada vez que necesites un respiro.`,
      action: null,
      suggestions: ["Hacer una respiración", "Ver mi bitácora", "Hasta pronto"],
    };
  }

  // 7. Respuesta empática prudente general
  if (style === "directo") {
    return {
      reply: `${namePrefix}te leo con atención. Si pudieras cambiar una sola cosa de lo que está ocurriendo hoy, ¿cuál sería? A veces nombrarlo claramente ayuda a encontrar claridad.`,
      action: null,
      suggestions: ["Quiero desahogarme más", "Hacer una pausa guiada", "Ordenar mis pendientes"],
    };
  }

  return {
    reply: `${namePrefix}gracias por compartirlo conmigo. Todo lo que sientes importa y no tienes que guardártelo solo/a. Te escucho con calma: ¿quieres contarme un poco más sobre lo que está pasando por tu mente?`,
    action: null,
    suggestions: ["Contarte más a fondo", "Hacer respiración 4-7-8", "Poner sonidos de calma"],
  };
}

/**
 * Función principal que orquesta la generación de respuesta:
 * 1. Filtro estricto de crisis / autolesión.
 * 2. Consulta a Google Gemini con Base de Conocimiento UTVT (si hay API Key).
 * 3. Fallback inteligente al Motor Empático de Near.
 */
export async function generatePrudentAIResponse(
  userText: string,
  style: CompanionStyle,
  userName?: string,
  apiKey?: string,
  history: ChatHistoryItem[] = []
): Promise<AIResponseResult> {
  const trimmed = userText.trim();

  // 1. Verificación de crisis inmediata (Protocolo ético obligatorio)
  if (detectCrisis(trimmed)) {
    return {
      reply: SAFETY_CRISIS_REPLY,
      action: "sos",
      riskScore: 1.0,
      crisisAlert: true,
      suggestions: CRISIS_SUGGESTIONS,
      modelUsed: "near-neural",
    };
  }

  // 2. Si hay clave de Gemini (proporcionada en settings o en env), usar Gemini
  const effectiveKey =
    apiKey || (typeof import.meta !== "undefined" ? import.meta.env?.VITE_GEMINI_API_KEY : undefined);

  if (effectiveKey && effectiveKey.trim().length > 10) {
    const geminiReply = await callGeminiApi(trimmed, style, effectiveKey, userName, history);
    if (geminiReply) {
      const lower = geminiReply.toLowerCase();
      const action = lower.includes("respir")
        ? "respiracion"
        : lower.includes("sonido") || lower.includes("lluvia") || lower.includes("bosque")
          ? "sonidos"
          : null;

      return {
        reply: geminiReply,
        action,
        riskScore: 0.1,
        crisisAlert: false,
        suggestions: [
          action === "respiracion" ? "Hacer respiración 4-7-8" : "Contarte un poco más",
          "Poner sonidos de calma",
          "Me siento un poco mejor",
        ],
        modelUsed: "gemini",
      };
    }
  }

  // 3. Motor Empático Autónomo de Near (Fallback con conocimiento UTVT)
  const local = generateEmpatheticLocalResponse(trimmed, style, userName);
  return {
    reply: local.reply,
    action: local.action,
    riskScore: 0.1,
    crisisAlert: false,
    suggestions: local.suggestions,
    modelUsed: "near-neural",
  };
}
