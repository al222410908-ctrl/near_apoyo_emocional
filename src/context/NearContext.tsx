import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  ChatMessage,
  CompanionStyle,
  EmergencyContact,
  GoalId,
  MoodEntry,
  MoodId,
  NearState,
  PillNotification,
  Settings,
  TriggerId,
  User,
} from "@/types";
import { DEFAULT_STATE, newId, seedHistory, welcomeMessage } from "@/services/mockData";
import { computeStreak, dayKey } from "@/services/streak";

const STORAGE_KEY = "near:v1";

interface NearContextValue extends NearState {
  hydrated: boolean;
  streak: number;
  displayName: string;
  todayMood: MoodEntry | undefined;
  activePill: PillNotification | null;
  showPill: (notif: Omit<PillNotification, "id">) => void;
  dismissPill: () => void;
  login: (email: string, name?: string) => void;
  loginDemo: () => void;
  register: (data: { name: string; email: string }) => void;
  logout: () => void;
  completeOnboarding: (data: { goals: GoalId[]; mood: MoodId | null; style: CompanionStyle }) => void;
  logMood: (mood: MoodId, extra?: { triggers?: TriggerId[] | undefined; note?: string | undefined }) => void;
  checkInToday: () => void;
  addMessage: (msg: Omit<ChatMessage, "id" | "createdAt">) => ChatMessage;
  clearMessages: () => void;
  restoreMessages: (msgs: ChatMessage[]) => void;
  toggleFavorite: (quoteId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  updateUser: (patch: Partial<User>) => void;
  setEmergencyContact: (c: EmergencyContact | null) => void;
  exportData: () => string;
}

const NearContext = createContext<NearContextValue | null>(null);

function nameFromEmail(email: string) {
  const raw = email.split("@")[0]?.split(/[._-]/)[0] ?? "";
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "Estudiante";
}

function buildUser(name: string, email: string): User {
  return {
    name,
    email,
    school: "Universidad Tecnológica del Valle de Toluca (UTVT)",
    major: "Tecnologías de la Información y Comunicación",
    createdAt: new Date().toISOString(),
  };
}

export function NearProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NearState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [activePill, setActivePill] = useState<PillNotification | null>(null);

  const showPill = useCallback((notif: Omit<PillNotification, "id">) => {
    const id = newId();
    setActivePill({ ...notif, id });
  }, []);

  const dismissPill = useCallback(() => {
    setActivePill(null);
  }, []);

  useEffect(() => {
    if (!activePill) return;
    const t = window.setTimeout(() => {
      setActivePill((current) => (current?.id === activePill.id ? null : current));
    }, 3600);
    return () => window.clearTimeout(t);
  }, [activePill]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<NearState>;
        setState({ ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_STATE.settings, ...parsed.settings } });
      }
    } catch {
      /* corrupted storage: start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.settings.theme === "noche");
    document.documentElement.classList.toggle("theme-salvia", state.settings.theme === "salvia");
  }, [state.settings.theme]);

  const startSession = useCallback((user: User, onboarded: boolean) => {
    setState((s) => {
      if (s.user?.email === user.email) return { ...s, signedIn: true };
      const { moods, checkIns } = seedHistory();
      return {
        ...DEFAULT_STATE,
        settings: s.settings,
        user,
        signedIn: true,
        onboarded,
        moods,
        checkIns,
        messages: [welcomeMessage(user.name)],
      };
    });
  }, []);

  const login = useCallback(
    (email: string, name?: string) => {
      startSession(buildUser(name ?? nameFromEmail(email), email.trim().toLowerCase()), true);
    },
    [startSession],
  );

  const loginDemo = useCallback(() => {
    startSession(buildUser("Sofía", "sofia.demo@alumnos.utvt.edu.mx"), true);
  }, [startSession]);

  const register = useCallback(({ name, email }: { name: string; email: string }) => {
    const { moods, checkIns } = seedHistory();
    setState((s) => ({
      ...DEFAULT_STATE,
      settings: s.settings,
      user: buildUser(name, email.trim().toLowerCase()),
      signedIn: true,
      onboarded: false,
      moods,
      checkIns,
      messages: [welcomeMessage(name)],
    }));
  }, []);

  const logout = useCallback(() => setState((s) => ({ ...s, signedIn: false })), []);

  const checkInToday = useCallback(() => {
    const key = dayKey(new Date());
    setState((s) => (s.checkIns.includes(key) ? s : { ...s, checkIns: [...s.checkIns, key] }));
  }, []);

  const logMood = useCallback((mood: MoodId, extra?: { triggers?: TriggerId[] | undefined; note?: string | undefined }) => {
    const key = dayKey(new Date());
    setState((s) => {
      const entry: MoodEntry = {
        id: newId(),
        date: new Date().toISOString(),
        mood,
        triggers: extra?.triggers ?? [],
        note: extra?.note,
      };
      return {
        ...s,
        moods: [...s.moods, entry],
        checkIns: s.checkIns.includes(key) ? s.checkIns : [...s.checkIns, key],
      };
    });
  }, []);

  const completeOnboarding = useCallback(
    ({ goals, mood, style }: { goals: GoalId[]; mood: MoodId | null; style: CompanionStyle }) => {
      setState((s) => ({ ...s, goals, onboarded: true, settings: { ...s.settings, companionStyle: style } }));
      if (mood) logMood(mood);
    },
    [logMood],
  );

  const addMessage = useCallback((msg: Omit<ChatMessage, "id" | "createdAt">) => {
    const full: ChatMessage = { ...msg, id: newId(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, messages: [...s.messages, full] }));
    return full;
  }, []);

  const clearMessages = useCallback(() => {
    setState((s) => ({ ...s, messages: [welcomeMessage(s.settings.anonymousMode ? "" : (s.user?.name ?? ""))] }));
  }, []);

  const restoreMessages = useCallback((msgs: ChatMessage[]) => setState((s) => ({ ...s, messages: msgs })), []);

  const toggleFavorite = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s));
  }, []);

  const setEmergencyContact = useCallback((c: EmergencyContact | null) => {
    setState((s) => ({ ...s, emergencyContact: c }));
  }, []);

  const exportData = useCallback(
    () => JSON.stringify({ exportedAt: new Date().toISOString(), app: "Near Apoyo Emocional", data: state }, null, 2),
    [state],
  );

  const value = useMemo<NearContextValue>(() => {
    const today = dayKey(new Date());
    const todayMood = [...state.moods].reverse().find((m) => dayKey(new Date(m.date)) === today);
    return {
      ...state,
      hydrated,
      streak: computeStreak(state.checkIns),
      displayName: state.settings.anonymousMode ? "" : (state.user?.name ?? ""),
      todayMood,
      activePill,
      showPill,
      dismissPill,
      login,
      loginDemo,
      register,
      logout,
      completeOnboarding,
      logMood,
      checkInToday,
      addMessage,
      clearMessages,
      restoreMessages,
      toggleFavorite,
      updateSettings,
      updateUser,
      setEmergencyContact,
      exportData,
    };
  }, [state, hydrated, activePill, showPill, dismissPill, login, loginDemo, register, logout, completeOnboarding, logMood, checkInToday, addMessage, clearMessages, restoreMessages, toggleFavorite, updateSettings, updateUser, setEmergencyContact, exportData]);

  return <NearContext.Provider value={value}>{children}</NearContext.Provider>;
}

export function useNear() {
  const ctx = useContext(NearContext);
  if (!ctx) throw new Error("useNear must be used inside <NearProvider>");
  return ctx;
}
