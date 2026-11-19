export type MoodId = "calmado" | "cansado" | "ansioso" | "abrumado" | "esperanzado";
export type CompanionStyle = "calido" | "directo" | "silencioso";
export type GoalId = "estres" | "examenes" | "desahogo" | "dormir";
export type TriggerId = "tareas" | "examenes" | "descanso" | "social" | "familia";
export type ThemeId = "claro" | "noche";
export type SoundId = "lluvia" | "olas" | "fogata" | "bosque";

export interface User {
  name: string;
  email: string;
  school: string;
  major: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  /** ISO timestamp */
  date: string;
  mood: MoodId;
  triggers: TriggerId[];
  note?: string | undefined;
}

export interface ChatMessage {
  id: string;
  role: "user" | "near";
  text: string;
  createdAt: string;
  kind?: "text" | "safety" | undefined;
  action?: "respiracion" | "sonidos" | undefined;
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface Settings {
  companionStyle: CompanionStyle;
  voiceRate: number;
  theme: ThemeId;
  anonymousMode: boolean;
}

export interface NearState {
  user: User | null;
  signedIn: boolean;
  onboarded: boolean;
  goals: GoalId[];
  settings: Settings;
  moods: MoodEntry[];
  /** Local day keys (yyyy-mm-dd) where the user took care of themselves */
  checkIns: string[];
  messages: ChatMessage[];
  favorites: string[];
  emergencyContact: EmergencyContact | null;
}
