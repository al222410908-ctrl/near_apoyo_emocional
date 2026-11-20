import { useEffect, useState } from "react";

export type CircadianPeriod = "manana" | "tarde" | "noche";

export interface CircadianTheme {
  period: CircadianPeriod;
  greeting: string;
  label: string;
  icon: string;
  skyGradient: string;
  cardBg: string;
  accentPill: string;
  ambientNote: string;
}

export function useCircadianTheme(): CircadianTheme {
  const [period, setPeriod] = useState<CircadianPeriod>(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "manana";
    if (hour >= 12 && hour < 19) return "tarde";
    return "noche";
  });

  useEffect(() => {
    const checkHour = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setPeriod("manana");
      else if (hour >= 12 && hour < 19) setPeriod("tarde");
      else setPeriod("noche");
    };

    const interval = setInterval(checkHour, 60000);
    return () => clearInterval(interval);
  }, []);

  if (period === "manana") {
    return {
      period: "manana",
      greeting: "Buenos días",
      label: "Mañana serena",
      icon: "☀️",
      skyGradient: "from-[#FDFBF7] via-[#F7EFE5] to-[#EFE2D3]",
      cardBg: "bg-[#FFFDF9]/95 border-amber-900/10",
      accentPill: "bg-amber-100 text-amber-900 border-amber-300/60",
      ambientNote: "Empieza la jornada a tu propio ritmo, sin prisas.",
    };
  }

  if (period === "tarde") {
    return {
      period: "tarde",
      greeting: "Buenas tardes",
      label: "Tarde cálida",
      icon: "🌤️",
      skyGradient: "from-[#FBF7F0] via-[#F3ECE1] to-[#E8DDD0]",
      cardBg: "bg-[#FFFDF9]/95 border-stone-800/10",
      accentPill: "bg-orange-100 text-orange-950 border-orange-300/60",
      ambientNote: "Toma un respiro profundo para soltar la carga del día.",
    };
  }

  return {
    period: "noche",
    greeting: "Buenas noches",
    label: "Noche estrellada",
    icon: "🌙",
    skyGradient: "from-[#1A1E24] via-[#14181D] to-[#0E1114]",
    cardBg: "bg-[#1E232B]/95 border-indigo-400/15 text-[#E6EDF5]",
    accentPill: "bg-indigo-950/80 text-indigo-300 border-indigo-700/50",
    ambientNote: "La universidad puede esperar; este momento es para que descanses.",
  };
}
