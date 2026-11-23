import type {
  AvatarStyleId,
  ChatMessage,
  CompanionStyle,
  GoalId,
  MoodEntry,
  MoodId,
  NearState,
  SoundId,
  TriggerId,
} from "@/types";
import { dayKey } from "./streak";

export const CRISIS_LINES = [
  {
    id: "linea-vida",
    name: "Línea de la Vida",
    description: "Orientación gratuita y confidencial 24/7",
    display: "800 911 2000",
    tel: "8009112000",
  },
  {
    id: "911",
    name: "Emergencias 911",
    description: "Si tu vida o la de alguien más está en riesgo",
    display: "911",
    tel: "911",
  },
] as const;

export const MOODS: { id: MoodId; label: string; emoji: string; score: number }[] = [
  { id: "calmado", label: "Calmado", emoji: "😌", score: 5 },
  { id: "esperanzado", label: "Esperanzado", emoji: "🌱", score: 4 },
  { id: "cansado", label: "Un poco cansado", emoji: "🥱", score: 3 },
  { id: "ansioso", label: "Ansioso", emoji: "😟", score: 2 },
  { id: "abrumado", label: "Abrumado", emoji: "🌊", score: 1 },
];

export const moodById = (id: MoodId) => MOODS.find((m) => m.id === id)!;

export const TRIGGERS: { id: TriggerId; label: string }[] = [
  { id: "tareas", label: "Tareas" },
  { id: "examenes", label: "Exámenes" },
  { id: "descanso", label: "Descanso" },
  { id: "social", label: "Amistades" },
  { id: "familia", label: "Familia" },
];

export const GOALS: { id: GoalId; label: string; description: string; emoji: string }[] = [
  { id: "estres", label: "Manejo de estrés escolar", description: "Entregas, proyectos y ritmo del semestre", emoji: "📚" },
  { id: "examenes", label: "Exámenes", description: "Nervios antes y durante las evaluaciones", emoji: "📝" },
  { id: "desahogo", label: "Desahogo", description: "Un lugar para soltar lo que cargas", emoji: "🫶" },
  { id: "dormir", label: "Dormir mejor", description: "Rutinas para descansar la mente", emoji: "🌙" },
];

export const COMPANION_STYLES: { id: CompanionStyle; label: string; description: string }[] = [
  { id: "calido", label: "Cálido y empático", description: "Palabras suaves, validación y mucha calidez." },
  { id: "directo", label: "Directo y reflexivo", description: "Preguntas claras que te ayudan a ordenar ideas." },
  { id: "silencioso", label: "Escucha silenciosa", description: "Respuestas breves; tú llevas el ritmo." },
];

export const AVATAR_STYLES: { id: AvatarStyleId; label: string; short: string; description: string }[] = [
  { id: "brote", label: "Espíritu Brote", short: "Brote", description: "Compañero cálido de calma y equilibrio" },
  { id: "ondas", label: "Guardián Kitsune", short: "Kitsune", description: "Zorro guardián de enfoque y energía" },
  { id: "geometrico", label: "Mentor Búho", short: "Búho", description: "Sabiduría académica para tus entregas" },
  { id: "constelacion", label: "Nova Astral", short: "Nova", description: "Espíritu estelar para calma nocturna" },
  { id: "oculto", label: "Sin Avatar", short: "Ocultar", description: "Oculta el personaje en toda la app" },
];

export const QUOTES = [
  { id: "q1", text: "No tienes que tenerlo todo resuelto hoy. Basta con dar el siguiente paso con amabilidad.", author: "Near" },
  { id: "q2", text: "Descansar también es avanzar. Tu valor no se mide en entregas.", author: "Near" },
  { id: "q3", text: "Las emociones son como el clima: llegan, se quedan un rato y siempre cambian.", author: "Near" },
  { id: "q4", text: "Hablarte con la ternura con la que hablarías a tu mejor amiga es un acto de valentía.", author: "Near" },
  { id: "q5", text: "Una calificación describe un momento, no a la persona que eres.", author: "Near" },
  { id: "q6", text: "Respira. Estás haciendo lo mejor que puedes con lo que tienes ahora.", author: "Near" },
  { id: "q7", text: "Pedir ayuda no es debilidad; es saber cuidarte.", author: "Near" },
];

export const quoteOfTheDay = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return QUOTES[day % QUOTES.length] ?? QUOTES[0]!;
};

export const CHAT_SUGGESTIONS = [
  "Siento mucha presión por un examen",
  "Necesito calmarme",
  "No puedo dormir",
  "Solo quiero desahogarme",
];

export const SOUNDS: { id: SoundId; label: string; description: string; emoji: string }[] = [
  { id: "lluvia", label: "Lluvia suave", description: "Gotas constantes sobre la ventana", emoji: "🌧️" },
  { id: "olas", label: "Olas de mar", description: "Marea lenta que va y viene", emoji: "🌊" },
  { id: "fogata", label: "Fogata", description: "Leña crujiendo en una noche tranquila", emoji: "🔥" },
  { id: "bosque", label: "Bosque sereno", description: "Viento entre árboles y aves lejanas", emoji: "🌲" },
];

export const PRIVACY_NOTICE = [
  {
    title: "Responsable",
    body: "Near Apoyo Emocional es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).",
  },
  {
    title: "Datos que tratamos",
    body: "Nombre, correo institucional, registros de ánimo, reflexiones y conversaciones con Near. No solicitamos datos financieros ni diagnósticos clínicos.",
  },
  {
    title: "Finalidades",
    body: "Brindarte un espacio de acompañamiento emocional, mostrarte tu progreso y personalizar a tu acompañante. Near no diagnostica, no receta y no sustituye la atención psicológica profesional.",
  },
  {
    title: "Derechos ARCO",
    body: "Puedes Acceder, Rectificar, Cancelar u Oponerte al uso de tus datos en cualquier momento desde Perfil → Privacidad: descarga tu información o elimina tu historial con un toque.",
  },
  {
    title: "Seguridad",
    body: "En este prototipo tu información se guarda solo en tu dispositivo. Nadie más puede leer tus conversaciones.",
  },
];

const uid = () => Math.random().toString(36).slice(2, 10);
export const newId = uid;

export const DEFAULT_STATE: NearState = {
  user: null,
  signedIn: false,
  onboarded: false,
  goals: [],
  settings: { companionStyle: "calido", voiceRate: 1, theme: "claro", anonymousMode: false, avatarId: "brote", voiceEngine: "natural" },
  moods: [],
  checkIns: [],
  messages: [],
  favorites: [],
  emergencyContact: null,
  xp: 140,
  completedLessons: ["u1"],
};

export const welcomeMessage = (name: string): ChatMessage => ({
  id: uid(),
  role: "near",
  text: `Hola${name ? `, ${name}` : ""}. Este es tu espacio seguro. Puedes escribir lo que sientas, sin prisa y sin juicios. ¿Cómo llegas hoy?`,
  createdAt: new Date().toISOString(),
});

/** Demo history so the prototype shows a living streak, chart and journal right away. */
export function seedHistory(today = new Date()) {
  const plan: { daysAgo: number; mood: MoodId; triggers: TriggerId[]; note?: string }[] = [
    { daysAgo: 6, mood: "ansioso", triggers: ["examenes"], note: "Mañana tengo parcial de Cálculo y siento el pecho apretado." },
    { daysAgo: 5, mood: "abrumado", triggers: ["tareas", "examenes"] },
    { daysAgo: 4, mood: "cansado", triggers: ["descanso"], note: "Dormí 5 horas. Hoy me di permiso de ir más lento." },
    { daysAgo: 3, mood: "esperanzado", triggers: ["social"], note: "Estudié con amigas y me sentí acompañada." },
    { daysAgo: 2, mood: "ansioso", triggers: ["tareas"] },
    { daysAgo: 1, mood: "calmado", triggers: ["descanso"], note: "La respiración 4-7-8 antes de dormir sí me ayudó." },
  ];
  const moods: MoodEntry[] = plan.map((p) => {
    const d = new Date(today);
    d.setDate(d.getDate() - p.daysAgo);
    d.setHours(20, 15, 0, 0);
    return { id: uid(), date: d.toISOString(), mood: p.mood, triggers: p.triggers, note: p.note };
  });
  // Streak: the last 4 days in a row (today adds the 5th when they check in).
  const checkIns = [4, 3, 2, 1].map((n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return dayKey(d);
  });
  return { moods, checkIns };
}
