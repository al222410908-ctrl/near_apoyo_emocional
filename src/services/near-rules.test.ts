import { describe, expect, it } from "vitest";
import { detectCrisis } from "./safety";
import { computeStreak, currentWeek, dayKey } from "./streak";
import { generateReply } from "./companion";
import { CRISIS_LINES } from "./mockData";

describe("crisis protocol", () => {
  it("intercepts 'crisis'", () => expect(detectCrisis("Estoy en crisis")).toBe(true));
  it("intercepts 'no quiero vivir' with accents/caps", () => expect(detectCrisis("Ya NO QUIERO VIVIR así")).toBe(true));
  it("intercepts 'hacerme daño'", () => expect(detectCrisis("tengo ganas de hacerme daño")).toBe(true));
  it("does not intercept ordinary stress", () => expect(detectCrisis("Siento mucha presión por un examen")).toBe(false));
  it("offers Línea de la Vida 800 911 2000 and 911", () => {
    expect(CRISIS_LINES.map((l) => l.tel)).toEqual(["8009112000", "911"]);
  });
});

describe("racha de calma", () => {
  const today = new Date(2026, 10, 19); // Thu
  const ago = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return dayKey(d);
  };
  it("counts consecutive days including today", () => expect(computeStreak([ago(0), ago(1), ago(2)], today)).toBe(3));
  it("stays alive from yesterday when today is not logged yet", () => expect(computeStreak([ago(1), ago(2)], today)).toBe(2));
  it("breaks after a full missed day", () => expect(computeStreak([ago(2), ago(3)], today)).toBe(0));
  it("week starts on Monday (L M M J V S D)", () => {
    const week = currentWeek([], today);
    expect(week.map((d) => d.label).join("")).toBe("LMMJVSD");
    expect(week[3]?.isToday).toBe(true);
  });
});

describe("companion", () => {
  it("suggests breathing when the user needs to calm down", () => {
    expect(generateReply("Necesito calmarme", "calido", () => 0).action).toBe("respiracion");
  });
});
