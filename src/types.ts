// Domain model for the 1C express-audit.

export type Severity = "high" | "med" | "low";

export interface Answers {
  version: string; // "8.3" | "8.2" | "other"
  config: string; // see questions.ts
  users: string; // bucket id
  baseSize: string; // bucket id
  baseAge: string; // bucket id
  integrations: string[]; // ids; may include "none"
  pains: string[]; // ids
  painText: string; // free text
}

export interface Risk {
  id: string;
  title: string;
  severity: Severity;
  what: string; // plain-language: what it means
  why: string; // why it matters / the consequence
}

export interface Stage {
  n: number;
  title: string;
  items: string[];
}

export interface Estimate {
  priceFrom: number; // RUB
  weeks: string; // human range
  note: string;
}

export interface Report {
  score: number; // 0..100 "Индекс здоровья базы"
  zone: "red" | "amber" | "green";
  zoneLabel: string;
  verdict: string; // one-line headline verdict
  summary: string; // 2-4 sentence summary
  configLine: string; // "1С:Бухгалтерия 8.3 · 6–20 польз."
  risks: Risk[]; // sorted high → low
  plan: Stage[];
  estimate: Estimate;
}
