/**
 * Near API Service
 * Centraliza la comunicación HTTP hacia el backend FastAPI / MongoDB.
 * Si VITE_API_URL no está configurado o falla la red, recurre automáticamente
 * al modo offline / mock local (companion.ts) sin interrumpir al usuario.
 */

import type { ChatMessage, CompanionStyle, MoodEntry } from "@/types";
import { generateReply } from "./companion";
import { detectCrisis } from "./safety";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export interface SendMessagePayload {
  sessionId?: string;
  content: string;
  style: CompanionStyle;
  userId?: string;
}

export interface SendMessageResponse {
  reply: string;
  action?: "respiracion" | "sonidos" | "sos" | null;
  riskScore?: number;
  crisisAlert: boolean;
}

export const apiService = {
  /**
   * Envía un mensaje al backend de FastAPI o ejecuta el fallback local si está offline.
   */
  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    // 1. Evaluación preventiva en el cliente (seguridad ante todo)
    if (detectCrisis(payload.content)) {
      return {
        reply: "Escucho que estás pasando por un momento muy difícil. No estás solo/a en esto. Por favor, comunícate ahora mismo a una línea de apoyo profesional gratuita y confidencial:",
        action: "sos",
        crisisAlert: true,
        riskScore: 1.0,
      };
    }

    // 2. Intento de llamada hacia el backend si hay conectividad
    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}` si se maneja JWT
        },
        body: JSON.stringify({
          session_id: payload.sessionId,
          contenido: payload.content,
          estilo: payload.style,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          reply: data.respuesta_bot || data.reply,
          action: data.accion || null,
          riskScore: data.analisis_ia?.puntaje_riesgo,
          crisisAlert: data.analisis_ia?.alerta_crisis ?? false,
        };
      }
    } catch {
      // Backend no disponible (modo desarrollo local / offline): fallback transparente
    }

    // 3. Fallback inteligente usando el motor local de Near
    const local = generateReply(payload.content, payload.style);
    return {
      reply: local.text,
      action: local.action,
      crisisAlert: false,
      riskScore: 0.1,
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
};
