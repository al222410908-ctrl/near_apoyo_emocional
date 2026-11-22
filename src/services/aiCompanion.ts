/**
 * Near AI Companion Service
 * Provee respuestas empáticas, prudentes y personalizadas para estudiantes universitarios.
 * Integra:
 * 1. Protocolo de Seguridad y Crisis (detectCrisis) que intercepta de inmediato cualquier ideación suicida.
 * 2. Conexión con modelos gratuitos de IA (Google Gemini 1.5 Flash / OpenRouter) para pruebas dinámicas.
 * 3. Motor Empático Autónomo de Near (Simulación Neural Local) con primeros auxilios psicológicos y validación emocional.
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

const SAFETY_CRISIS_REPLY =
  "Escucho que estás pasando por un momento muy difícil y doloroso. Tu vida y tu tranquilidad son lo más importante. Por favor, comunícate en este instante con un profesional de la Línea de la Vida (800 911 2000). Es gratis y confidencial las 24 horas. No estás solo/a.";

const CRISIS_SUGGESTIONS = [
  "Llamar a Línea de la Vida (800 911 2000)",
  "Contactar a SAPTEL (55 5259 8121)",
  "Hablar con un tutor o familiar",
];

/**
 * Consulta la API gratuita de Google Gemini 1.5 Flash si hay una API Key configurada.
 */
async function callGeminiApi(
  prompt: string,
  style: CompanionStyle,
  apiKey: string,
  userName?: string
): Promise<string | null> {
  try {
    const styleInstruction =
      style === "directo"
        ? "Sé conciso, estructurado y enfocado en micro-pasos prácticos."
        : style === "silencioso"
          ? "Sé muy breve, pausado, brindando espacio y silencio comprensivo."
          : "Sé cálido, dulce, muy empático y validante.";

    const systemPrompt = `Eres Near, una IA de apoyo emocional y salud mental preventiva para estudiantes universitarios de la Universidad Tecnológica del Valle de Toluca (UTVT) en México.
Tu usuario se llama ${userName || "estudiante"}.
Instrucciones obligatorias:
1. Sé prudente, respetuoso, empático y compasivo. ${styleInstruction}
2. Responde en 1 o máximo 2 párrafos breves (máximo 50 palabras en total) para que la respuesta sea óptima para lectura y síntesis de voz amigable.
3. Valida la emoción del estudiante antes de aconsejar.
4. Si hay estrés, sugiere con calidez una breve pausa o ejercicio de respiración 4-7-8.
5. No uses lenguaje clínico, no diagnostiques y no des promesas mágicas. Eres un refugio preventivo seguro.
6. NO uses emojis excesivos ni asteriscos de markdown para que la voz no se trabe al leerlo.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nMensaje del estudiante: "${prompt}"\nRespuesta de Near:` }],
            },
          ],
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 150,
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && typeof text === "string" && text.trim().length > 0) {
        return text.trim();
      }
    }
  } catch {
    // Si falla la llamada a Gemini, recurre al motor autónomo sin interrumpir la experiencia
  }
  return null;
}

/**
 * Motor Empático Autónomo de Near (Simulación Neural Preventiva).
 * Genera respuestas contextuales, prudentes y personalizadas basadas en Primeros Auxilios Psicológicos (PAP).
 */
function generateEmpatheticLocalResponse(
  text: string,
  style: CompanionStyle,
  userName?: string
): { reply: string; action?: "respiracion" | "sonidos" | null; suggestions: string[] } {
  const lower = text.toLowerCase();
  const namePrefix = userName ? `${userName}, ` : "";

  // 1. Exámenes, proyectos, reprobar, escuela
  if (/examen|parcial|final|calificaci|reprobar|estudi|tarea|entrega|proyecto|materia|profesor|profe/.test(lower)) {
    if (style === "directo") {
      return {
        reply: `${namePrefix}la presión académica puede sentirse abrumadora cuando se juntan las entregas. Vamos a ordenar prioridades: ¿cuál es el pendiente que más te preocupa hoy y cómo podemos dividirlo en un paso de diez minutos?`,
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
      reply: `${namePrefix}entiendo lo pesado que se siente tener tantas entregas encima. Recuerda que una nota o un examen no define tu valor ni tu capacidad. Tómate un respiro hondo y vamos paso a pasito. ¿Qué parte sientes más difícil ahorita?`,
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

  // 4. Tristeza, soledad, vacío, ganas de llorar
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
      reply: `¡Hola ${namePrefix}! Qué gusto tenerte por aquí en Near. Este es tu espacio seguro y confidencial. ¿Cómo te has sentido el día de hoy?`,
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
 * 2. Modelo de IA gratuito (Gemini si hay key o fallback local).
 * 3. Formateo y detección de acciones interactivas.
 */
export async function generatePrudentAIResponse(
  userText: string,
  style: CompanionStyle,
  userName?: string,
  apiKey?: string
): Promise<AIResponseResult> {
  const trimmed = userText.trim();

  // 1. Verificación de crisis inmediata (Protocolo ético)
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

  // 2. Si hay clave de Gemini (o variable de entorno), intentar con Gemini 1.5 Flash
  const effectiveKey = apiKey || (typeof import.meta !== "undefined" ? import.meta.env?.VITE_GEMINI_API_KEY : undefined);
  if (effectiveKey && effectiveKey.length > 10) {
    const geminiReply = await callGeminiApi(trimmed, style, effectiveKey, userName);
    if (geminiReply) {
      const lower = geminiReply.toLowerCase();
      const action = lower.includes("respir") ? "respiracion" : lower.includes("sonido") || lower.includes("lluvia") ? "sonidos" : null;
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

  // 3. Motor Empático Autónomo de Near
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
