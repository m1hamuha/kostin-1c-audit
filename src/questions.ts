import type { Answers } from "./types";

export interface Option {
  id: string;
  label: string;
  hint?: string;
}

export interface SingleStep {
  kind: "single";
  key: keyof Answers;
  title: string;
  subtitle?: string;
  options: Option[];
}

export interface MultiStep {
  kind: "multi";
  key: keyof Answers;
  title: string;
  subtitle?: string;
  options: Option[];
  noneId?: string; // selecting this clears the others
}

export interface PainStep {
  kind: "pains";
  title: string;
  subtitle?: string;
  options: Option[];
  textKey: "painText";
  textLabel: string;
  textPlaceholder: string;
}

export type Step = SingleStep | MultiStep | PainStep;

export const steps: Step[] = [
  {
    kind: "single",
    key: "version",
    title: "Какая версия платформы 1С?",
    subtitle: "Если не знаете точно — выберите ближайшее.",
    options: [
      { id: "8.3", label: "1С:Предприятие 8.3", hint: "Актуальная платформа" },
      { id: "8.2", label: "1С:Предприятие 8.2", hint: "Старая платформа" },
      { id: "other", label: "Другое / не знаю", hint: "7.7, облако или не уверен" },
    ],
  },
  {
    kind: "single",
    key: "config",
    title: "Какая конфигурация?",
    subtitle: "Главная программа, в которой вы работаете.",
    options: [
      { id: "buh", label: "Бухгалтерия" },
      { id: "ut", label: "Управление торговлей" },
      { id: "unf", label: "Управление нашей фирмой (УНФ)" },
      { id: "zup", label: "Зарплата и управление персоналом (ЗУП)" },
      { id: "erp", label: "ERP / Комплексная автоматизация" },
      { id: "custom", label: "Самописная / сильно доработанная" },
      { id: "other", label: "Другое" },
    ],
  },
  {
    kind: "single",
    key: "users",
    title: "Сколько человек работает в базе?",
    options: [
      { id: "1", label: "1 пользователь" },
      { id: "2-5", label: "2–5" },
      { id: "6-20", label: "6–20" },
      { id: "21-50", label: "21–50" },
      { id: "50+", label: "Больше 50" },
    ],
  },
  {
    kind: "single",
    key: "baseSize",
    title: "Насколько большая база?",
    subtitle: "Примерный размер файла базы — если не знаете, оцените по объёму данных.",
    options: [
      { id: "s", label: "Небольшая", hint: "до ~5 ГБ" },
      { id: "m", label: "Средняя", hint: "~5–20 ГБ" },
      { id: "l", label: "Большая", hint: "~20–50 ГБ" },
      { id: "xl", label: "Очень большая", hint: "больше 50 ГБ" },
      { id: "unknown", label: "Не знаю" },
    ],
  },
  {
    kind: "single",
    key: "baseAge",
    title: "Сколько лет базе?",
    subtitle: "С какого момента в ней копятся данные.",
    options: [
      { id: "new", label: "Меньше года" },
      { id: "1-3", label: "1–3 года" },
      { id: "3-7", label: "3–7 лет" },
      { id: "7+", label: "Больше 7 лет" },
    ],
  },
  {
    kind: "multi",
    key: "integrations",
    title: "Что подключено к 1С?",
    subtitle: "Отметьте всё, что используете.",
    noneId: "none",
    options: [
      { id: "bank", label: "Банк-клиент" },
      { id: "mp", label: "Маркетплейсы", hint: "Wildberries, Ozon и т.п." },
      { id: "crm", label: "CRM" },
      { id: "edo", label: "ЭДО", hint: "электронный документооборот" },
      { id: "site", label: "Сайт / интернет-магазин" },
      { id: "none", label: "Ничего не подключено" },
    ],
  },
  {
    kind: "pains",
    title: "Что сейчас болит сильнее всего?",
    subtitle: "Отметьте проблемы и при желании опишите своими словами.",
    textKey: "painText",
    textLabel: "Опишите проблему своими словами (необязательно)",
    textPlaceholder: "Например: при проведении реализаций база зависает на 2–3 минуты…",
    options: [
      { id: "slow", label: "Тормозит, медленно работает" },
      { id: "errors", label: "Ошибки и зависания" },
      { id: "manual", label: "Много ручной работы" },
      { id: "reports", label: "Не хватает нужных отчётов" },
      { id: "close", label: "Тяжёлое закрытие месяца" },
      { id: "backup", label: "Нет резервных копий" },
      { id: "old", label: "Устаревшая версия / давно не обновляли" },
    ],
  },
];

export const emptyAnswers: Answers = {
  version: "",
  config: "",
  users: "",
  baseSize: "",
  baseAge: "",
  integrations: [],
  pains: [],
  painText: "",
};
