/**
 * Near API Service
 * Centraliza la comunicación con el motor de IA en vivo (Google Gemini / Cloud LLM)
 * y sincroniza opcionalmente con el backend FastAPI / MongoDB.
 */

import type { CompanionStyle, MoodEntry } from "@/types";
import { detectCrisis } from "./safety";
import { generatePrudentAIResponse } from "./aiCompanion";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export interface SendMessagePayload {
  sessionId?: string;
  content: string;
  style: CompanionStyle;
  userId?: string;
  apiKey?: string;
  history?: { role: "user" | "near"; text: string }[];
}

export interface SendMessageResponse {
  reply: string;
  action?: "respiracion" | "sonidos" | "sos" | null;
  riskScore?: number;
  crisisAlert: boolean;
  suggestions?: string[] | undefined;
}

export const apiService = {
  /**
   * Genera una respuesta real de IA en vivo con conocimiento verídico y memoria conversacional.
   */
  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    // 1. Evaluación preventiva de crisis en el cliente (seguridad ante todo)
    if (detectCrisis(payload.content)) {
      return {
        reply:
          "Escucho que estás pasando por un momento muy difícil. No estás solo/a en esto. Por favor, comunícate ahora mismo a una línea de apoyo profesional gratuita y confidencial:",
        action: "sos",
        crisisAlert: true,
        riskScore: 1.0,
      };
    }

    // 2. Motor de IA en vivo (Google Gemini o Cloud LLM gratuito sin respuestas predefinidas)
    const aiResult = await generatePrudentAIResponse(
      payload.content,
      payload.style,
      payload.userId,
      payload.apiKey,
      payload.history,
    );

    // 3. Registro asíncrono opcional en backend MongoDB si está activo (no bloquea ni reemplaza la IA real)
    if (import.meta.env.VITE_API_URL) {
      fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: payload.sessionId,
          contenido: payload.content,
          estilo: payload.style,
        }),
      }).catch(() => {});
    }

    return {
      reply: aiResult.reply,
      action: aiResult.action,
      suggestions: aiResult.suggestions,
      crisisAlert: aiResult.crisisAlert,
      riskScore: aiResult.riskScore,
    };
  },

  /**
   * Sincroniza una entrada de la bitácora anímica con la base de datos
   */
  async syncMood(entry: MoodEntry): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/bitacora/entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      return response.ok;
    } catch {
      return false; // Permanece guardado en localStorage
    }
  },

  /**
   * Obtiene el catálogo de líneas de emergencia desde MongoDB
   */
  async getEmergencyLines() {
    try {
      const response = await fetch(`${API_BASE_URL}/emergencias/lineas`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    return null;
  },

  /**
   * Obtiene métricas consolidadas del sistema para el panel administrativo
   */
  async getAdminMetrics() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    return null;
  },
};
