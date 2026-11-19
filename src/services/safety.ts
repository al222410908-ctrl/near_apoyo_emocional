/**
 * Crisis detection. When any of these phrases appear, Near stops the normal
 * conversation and shows the emergency lines (Línea de la Vida, 911).
 * Near never diagnoses — it only routes the person to human help.
 */
const CRISIS_PATTERNS: RegExp[] = [
  /\bcrisis\b/,
  /no quiero vivir/,
  /ya no quiero (seguir|estar aqui|existir)/,
  /hacerme (dano|algo)/,
  /lastimarme/,
  /autolesion/,
  /cortarme/,
  /suicid/,
  /quitarme la vida/,
  /matarme/,
  /quiero morir/,
  /(me quiero|quisiera) morir/,
  /acabar con (todo|mi vida)/,
];

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectCrisis(text: string): boolean {
  const t = normalize(text);
  return CRISIS_PATTERNS.some((p) => p.test(t));
}
