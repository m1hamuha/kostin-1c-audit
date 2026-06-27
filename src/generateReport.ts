import type { Answers, Report, Risk, Stage, Severity } from "./types";

const SEVERITY_PENALTY: Record<Severity, number> = {
  high: 17,
  med: 9,
  low: 5,
};

const CONFIG_LABEL: Record<string, string> = {
  buh: "1С:Бухгалтерия",
  ut: "1С:Управление торговлей",
  unf: "1С:УНФ",
  zup: "1С:ЗУП",
  erp: "1С:ERP / КА",
  custom: "Самописная конфигурация",
  other: "Конфигурация 1С",
};

const VERSION_LABEL: Record<string, string> = {
  "8.3": "8.3",
  "8.2": "8.2",
  other: "—",
};

const USERS_LABEL: Record<string, string> = {
  "1": "1 пользователь",
  "2-5": "2–5 пользователей",
  "6-20": "6–20 пользователей",
  "21-50": "21–50 пользователей",
  "50+": "50+ пользователей",
};

function has(list: string[], id: string): boolean {
  return list.includes(id);
}

export function generateReport(a: Answers): Report {
  const risks: Risk[] = [];
  const manyUsers = a.users === "21-50" || a.users === "50+";
  const bigBase = a.baseSize === "l" || a.baseSize === "xl";

  // --- Платформа ---
  if (a.version === "8.2" || has(a.pains, "old")) {
    risks.push({
      id: "platform",
      title: "Устаревшая платформа 1С",
      severity: "high",
      what: "Вы работаете на старой версии платформы (8.2 или ниже) либо давно не обновлялись.",
      why: "Снятые с поддержки версии не получают обновлений безопасности и законодательства. Растёт риск ошибок в отчётности, несовместимости с банками, ЭДО и маркетплейсами.",
    });
  } else if (a.version === "other") {
    risks.push({
      id: "platform-unknown",
      title: "Версия платформы под вопросом",
      severity: "med",
      what: "Версия платформы не определена — возможно, это 7.7 или нестандартная сборка.",
      why: "Без актуальной поддерживаемой платформы сложно гарантировать корректность учёта и обновлений. Стоит зафиксировать, на чём вы работаете.",
    });
  }

  // --- Конфигурация ---
  if (a.config === "custom") {
    risks.push({
      id: "custom-config",
      title: "Самописная конфигурация",
      severity: "high",
      what: "База сильно доработана или написана с нуля.",
      why: "Обновления ставятся вручную и могут «ломать» доработки. Часто есть зависимость от одного разработчика. Нужны контроль изменений и документация, чтобы не встать при его уходе.",
    });
  }

  // --- Резервные копии (критично) ---
  if (has(a.pains, "backup")) {
    risks.push({
      id: "backup",
      title: "Нет резервных копий",
      severity: "high",
      what: "Регулярное автоматическое резервное копирование не настроено.",
      why: "Это прямой риск потерять всю базу — из-за сбоя диска, вируса-шифровальщика или ошибки сотрудника. Восстановить данные будет неоткуда. Это исправляется в первую очередь.",
    });
  }

  // --- Ошибки и стабильность ---
  if (has(a.pains, "errors")) {
    risks.push({
      id: "errors",
      title: "Нестабильная работа и ошибки",
      severity: "high",
      what: "Сотрудники сталкиваются с ошибками и зависаниями.",
      why: "Простои тормозят работу и могут приводить к порче данных и битым документам. Нужна диагностика причин: блокировки, доработки, нехватка ресурсов сервера.",
    });
  }

  // --- Производительность ---
  if (has(a.pains, "slow")) {
    risks.push({
      id: "performance",
      title: "Низкая производительность",
      severity: bigBase || manyUsers ? "high" : "med",
      what: "База тормозит и медленно отвечает" + (bigBase ? " при большом объёме данных." : "."),
      why: "Каждая минута ожидания — это потерянное время сотрудников. Обычно лечится оптимизацией запросов, настройкой сервера и регламентными операциями.",
    });
  }

  // --- Ручной труд ---
  if (has(a.pains, "manual")) {
    risks.push({
      id: "manual",
      title: "Много ручной работы",
      severity: "med",
      what: "Часть операций сотрудники делают руками — переносят данные, дублируют ввод.",
      why: "Это съедает часы и порождает ошибки. Как правило, большую часть можно автоматизировать или закрыть интеграциями — с быстрой окупаемостью.",
    });
  }

  // --- Отчётность ---
  if (has(a.pains, "reports")) {
    risks.push({
      id: "reports",
      title: "Не хватает нужной аналитики",
      severity: "low",
      what: "Стандартных отчётов недостаточно для управленческих решений.",
      why: "Решения принимаются «вслепую» или по выгрузкам в Excel. Нужные отчёты и дашборды настраиваются под ваши задачи.",
    });
  }

  // --- Закрытие месяца ---
  if (has(a.pains, "close")) {
    risks.push({
      id: "close",
      title: "Тяжёлое закрытие месяца",
      severity: "med",
      what: "Закрытие периода занимает много времени и нервов.",
      why: "Перегрузка бухгалтерии в конце месяца — частый признак накопленных ошибок учёта и незакрытых «хвостов». Регламентная чистка заметно ускоряет закрытие.",
    });
  }

  // --- Интеграции ---
  const noIntegrations = a.integrations.length === 0 || has(a.integrations, "none");
  if (noIntegrations && (has(a.pains, "manual") || a.config === "ut" || a.config === "unf")) {
    risks.push({
      id: "no-integrations",
      title: "Нет интеграций",
      severity: "med",
      what: "1С не связана с банком, маркетплейсами, CRM, ЭДО или сайтом.",
      why: "Данные переносят вручную — это медленно и с ошибками. Подключение обмена убирает двойной ввод и ускоряет работу.",
    });
  }

  // --- Возраст / объём базы ---
  if (a.baseAge === "7+" || (bigBase && a.baseAge === "3-7")) {
    risks.push({
      id: "base-age",
      title: "Старая «тяжёлая» база",
      severity: "med",
      what: "Базе много лет, и в ней накопился большой объём данных.",
      why: "Со временем копятся ошибки, дубли и «мусор», база разрастается и замедляется. Помогает чистка и свёртка — перенос старых периодов в архив.",
    });
  }

  // --- Масштаб без актуальной платформы ---
  if (manyUsers && (a.version === "8.2" || a.config === "custom")) {
    risks.push({
      id: "scale",
      title: "Риск при росте нагрузки",
      severity: "med",
      what: "Много пользователей на устаревшей или сильно доработанной базе.",
      why: "При такой нагрузке узкие места проявляются сильнее: блокировки, очереди, падения. Нужен запас по производительности и контроль доработок.",
    });
  }

  // Sort high → med → low, stable.
  const order: Record<Severity, number> = { high: 0, med: 1, low: 2 };
  risks.sort((x, y) => order[x.severity] - order[y.severity]);

  // ---- Score: «Индекс здоровья базы» ----
  let score = 100;
  for (const r of risks) score -= SEVERITY_PENALTY[r.severity];
  if (a.version === "8.3") score += 3; // small bonus for being current
  score = Math.max(8, Math.min(98, Math.round(score)));

  const zone: Report["zone"] = score >= 75 ? "green" : score >= 50 ? "amber" : "red";
  const zoneLabel =
    zone === "green"
      ? "В целом здоровая база"
      : zone === "amber"
        ? "Есть что улучшить"
        : "Требует внимания";

  const highCount = risks.filter((r) => r.severity === "high").length;

  const verdict =
    zone === "green"
      ? "База в неплохой форме — есть точечные улучшения."
      : zone === "amber"
        ? "База рабочая, но накопились проблемы, которые тормозят и создают риски."
        : "В базе есть серьёзные риски — стоит заняться ими в ближайшее время.";

  // ---- Summary ----
  const cfg = CONFIG_LABEL[a.config] ?? "Ваша 1С";
  const summaryParts: string[] = [];
  summaryParts.push(
    `По вашим ответам мы видим ${cfg.toLowerCase().startsWith("самописная") ? "самописную конфигурацию" : cfg}` +
      (a.version === "8.3" ? " на актуальной платформе 8.3" : a.version === "8.2" ? " на устаревшей платформе 8.2" : "") +
      `, ${USERS_LABEL[a.users]?.toLowerCase() ?? "несколько пользователей"}.`,
  );
  if (risks.length === 0) {
    summaryParts.push(
      "Явных проблем по анкете не выявлено. Это хороший знак — точную картину покажет короткая диагностика вживую.",
    );
  } else {
    summaryParts.push(
      `Мы выделили ${risks.length} ${plural(risks.length, "пункт", "пункта", "пунктов")}, ` +
        (highCount > 0
          ? `из них ${highCount} ${plural(highCount, "требует", "требуют", "требуют")} приоритетного внимания.`
          : "которые стоит проработать."),
    );
  }
  if (has(a.pains, "backup")) {
    summaryParts.push("Самое срочное — настроить резервное копирование: сейчас данные ничем не защищены.");
  }
  const summary = summaryParts.join(" ");

  // ---- План работ ----
  const plan = buildPlan(a, risks);

  // ---- Оценка ----
  const estimate = buildEstimate(score, highCount);

  const configLine = [
    CONFIG_LABEL[a.config] ?? "Конфигурация 1С",
    a.version !== "other" ? VERSION_LABEL[a.version] : null,
    USERS_LABEL[a.users] ?? null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    score,
    zone,
    zoneLabel,
    verdict,
    summary,
    configLine,
    risks,
    plan,
    estimate,
  };
}

function buildPlan(a: Answers, risks: Risk[]): Stage[] {
  const ids = new Set(risks.map((r) => r.id));
  const stages: Stage[] = [];
  let n = 1;

  // Этап 1 — стабилизация и безопасность
  const stage1: string[] = [];
  if (ids.has("backup")) stage1.push("Настроить автоматическое резервное копирование и проверку восстановления");
  if (ids.has("errors")) stage1.push("Найти и устранить критичные ошибки и зависания");
  if (ids.has("platform") || ids.has("platform-unknown")) stage1.push("Обновить платформу до актуальной поддерживаемой версии");
  if (stage1.length > 0) stages.push({ n: n++, title: "Стабилизация и безопасность", items: stage1 });

  // Этап 2 — производительность и порядок
  const stage2: string[] = [];
  if (ids.has("performance") || ids.has("scale")) stage2.push("Оптимизировать производительность: запросы, сервер, блокировки");
  if (ids.has("base-age")) stage2.push("Почистить и свернуть базу, убрать дубли и «мусор»");
  if (ids.has("close")) stage2.push("Разобрать «хвосты» учёта и ускорить закрытие месяца");
  if (ids.has("custom-config")) stage2.push("Навести порядок в доработках: контроль изменений и документация");
  if (stage2.length > 0) stages.push({ n: n++, title: "Производительность и порядок", items: stage2 });

  // Этап 3 — автоматизация и интеграции
  const stage3: string[] = [];
  if (ids.has("manual") || ids.has("no-integrations")) stage3.push("Автоматизировать ручные операции и убрать двойной ввод");
  if (a.integrations.length === 0 || a.integrations.includes("none")) {
    stage3.push("Подключить нужные обмены: банк, маркетплейсы, CRM, ЭДО, сайт");
  }
  if (ids.has("reports")) stage3.push("Настроить отчёты и дашборды под ваши решения");
  if (stage3.length > 0) stages.push({ n: n++, title: "Автоматизация и интеграции", items: stage3 });

  // Финальный этап — всегда
  stages.push({
    n: n++,
    title: "Сопровождение и развитие",
    items: [
      "Регламентное обслуживание: бэкапы, обновления, мониторинг",
      "Обучение сотрудников и быстрая поддержка по вопросам",
    ],
  });

  return stages;
}

function buildEstimate(score: number, highCount: number): Report["estimate"] {
  const note = "Ориентировочно. Точную оценку дадим после короткой диагностики — по вашей реальной базе.";
  if (score >= 75 && highCount === 0) {
    return { priceFrom: 15000, weeks: "от 2–5 дней", note };
  }
  if (score < 50 || highCount >= 2) {
    return { priceFrom: 80000, weeks: "от 3 недель, поэтапно", note };
  }
  return { priceFrom: 40000, weeks: "1–3 недели", note };
}

function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

export function formatRub(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽";
}
