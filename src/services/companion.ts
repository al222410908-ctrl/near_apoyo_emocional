import type { ChatMessage, CompanionStyle } from "@/types";
import { normalize } from "./safety";

type Topic = "examen" | "calma" | "sueno" | "tristeza" | "cansancio" | "desahogo" | "gracias" | "saludo" | "general";

const TOPICS: { topic: Topic; pattern: RegExp }[] = [
  { topic: "examen", pattern: /examen|parcial|final|calificaci|reprobar|estudi|tarea|entrega|proyecto|escuela|clase|profe/ },
  { topic: "calma", pattern: /calm|ansie|nervio|panico|estres|presion|respirar|tension|agobi/ },
  { topic: "sueno", pattern: /dormir|sueno|insomnio|desvel|noche/ },
  { topic: "tristeza", pattern: /triste|sol[oa]\b|llorar|vacio|extran|nadie/ },
  { topic: "cansancio", pattern: /cansad|agotad|sin energia|exhaust/ },
  { topic: "desahogo", pattern: /desahog|hablar|contar|escuch/ },
  { topic: "gracias", pattern: /gracias|me ayudo|mejor ahora/ },
  { topic: "saludo", pattern: /^(hola|buen[oa]s|hey|que tal)/ },
];

const REPLIES: Record<Topic, Record<CompanionStyle, string[]>> = {
  examen: {
    calido: [
      "Se escucha que esa presión te está pesando mucho, y tiene todo el sentido: te importa hacerlo bien. ¿Qué parte del examen te inquieta más ahora mismo?",
      "Gracias por contármelo. Antes de un examen la mente suele imaginar lo peor. Vamos paso a paso: ¿qué sí tienes bajo control hoy?",
    ],
    directo: [
      "Ordenemos un poco: ¿cuándo es el examen y qué temas sientes menos claros? A veces nombrarlos ya baja la tensión.",
      "Si dividieras lo que falta en tres bloques pequeños, ¿cuál sería el primero que podrías hacer hoy?",
    ],
    silencioso: ["Te escucho. Esa presión es real.", "Aquí estoy. Cuéntame más, si quieres."],
  },
  calma: {
    calido: [
      "Lo que sientes es válido y no tienes que apurarte a que se vaya. Si quieres, probemos juntos una respiración 4-7-8: inhala 4, retén 7, exhala 8.",
      "Estoy contigo. Pon una mano en tu pecho y nota cómo sube y baja. ¿Te gustaría una pausa guiada de respiración?",
    ],
    directo: [
      "Del 1 al 10, ¿qué tan intensa es la sensación ahora? Hagamos tres ciclos de respiración 4-7-8 y lo volvemos a medir.",
      "Identifiquemos el detonante: ¿pasó algo concreto hoy o es una acumulación de días?",
    ],
    silencioso: ["Respira conmigo. Sin prisa.", "Estoy aquí. Inhala… y suelta."],
  },
  sueno: {
    calido: [
      "Cuando la mente no se apaga, la noche se hace larga. ¿Qué pensamientos aparecen cuando intentas dormir? Los sonidos de lluvia pueden acompañarte.",
      "Mereces descansar. Una idea suave: escribe en papel lo que te ronda antes de acostarte, para que tu mente no tenga que sostenerlo.",
    ],
    directo: [
      "¿A qué hora sueles dormir y despertar? Un horario constante y dejar el celular 30 minutos antes suele marcar la diferencia.",
      "¿Qué te mantiene despierto: pendientes, preocupaciones o simplemente no tienes sueño?",
    ],
    silencioso: ["Las noches así cansan. Te acompaño.", "Aquí estoy, aunque sea tarde."],
  },
  tristeza: {
    calido: [
      "Siento mucho que estés pasando por esto. No estás solo/a en este momento: estoy aquí para escucharte. ¿Quieres contarme qué pasó?",
      "Esa tristeza merece espacio. Llorar o sentirse vacío no te hace débil; te hace humano. ¿Hay alguien de confianza con quien podrías hablar hoy?",
    ],
    directo: [
      "¿Desde cuándo te sientes así? Saber si es algo de hoy o de varias semanas nos ayuda a ver qué tipo de apoyo te serviría.",
      "¿Qué solía hacerte sentir un poco mejor en días difíciles?",
    ],
    silencioso: ["Lo siento mucho. Te escucho.", "Estoy aquí contigo."],
  },
  cansancio: {
    calido: [
      "Suena a que has estado dando mucho. Descansar también es avanzar. ¿Qué podrías soltar hoy, aunque sea un poquito?",
      "Tu cuerpo te está pidiendo pausa. ¿Te regalas cinco minutos de sonidos de calma?",
    ],
    directo: [
      "¿El cansancio es más físico o mental? Según eso podemos pensar en una pausa distinta.",
      "¿Cuántas horas has dormido estos días? Empecemos por ahí.",
    ],
    silencioso: ["Se oye agotador.", "Descansa aquí un momento."],
  },
  desahogo: {
    calido: ["Claro que sí. Este espacio es tuyo; escribe todo lo que necesites, sin filtros. Te leo con atención."],
    directo: ["Adelante. Cuéntame desde el principio; después, si quieres, ordenamos juntos lo que surja."],
    silencioso: ["Te escucho."],
  },
  gracias: {
    calido: ["Me alegra mucho acompañarte. Recuerda que puedes volver cuando lo necesites 💛"],
    directo: ["Qué bueno. ¿Qué te llevas de esta conversación para el resto del día?"],
    silencioso: ["Aquí estaré."],
  },
  saludo: {
    calido: ["¡Hola! Qué gusto que estés aquí. ¿Cómo te sientes en este momento?"],
    directo: ["Hola. ¿Qué te gustaría trabajar hoy?"],
    silencioso: ["Hola. Te escucho."],
  },
  general: {
    calido: [
      "Gracias por compartirlo conmigo. Lo que sientes importa. ¿Cómo está tu cuerpo ahora mismo?",
      "Te leo con atención. Si tuvieras que ponerle un nombre a lo que sientes, ¿cuál sería?",
      "Tiene sentido que te sientas así. ¿Qué necesitarías en este momento para estar un poquito mejor?",
    ],
    directo: [
      "Entiendo. ¿Qué es lo que más te gustaría que cambiara de esta situación?",
      "Si lo vieras desde fuera, como si le pasara a una amiga, ¿qué le dirías?",
    ],
    silencioso: ["Mm, te escucho.", "Sigue, estoy aquí."],
  },
};

export function detectTopic(text: string): Topic {
  const t = normalize(text);
  return TOPICS.find((x) => x.pattern.test(t))?.topic ?? "general";
}

export function generateReply(
  text: string,
  style: CompanionStyle,
  rand: () => number = Math.random,
): Pick<ChatMessage, "text" | "action"> {
  const topic = detectTopic(text);
  const options = REPLIES[topic][style];
  const reply = options[Math.floor(rand() * options.length)] ?? options[0] ?? "";
  const action =
    topic === "calma" ? "respiracion" : topic === "sueno" || topic === "cansancio" ? "sonidos" : undefined;
  return { text: reply, action };
}

export const SAFETY_MESSAGE =
  "Lo que me compartes es muy importante y me preocupa cómo te sientes. No tienes que pasar por esto a solas. Por favor, habla ahora con una persona capacitada: la llamada es gratuita, confidencial y está disponible 24/7.";
