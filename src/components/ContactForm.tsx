import { useState } from "react";
import type { Report } from "../types";
import { formatRub } from "../generateReport";
import { Button, CheckIcon } from "./ui";

const OWNER_EMAIL = "kostinmihail40@gmail.com";

type Status = "idle" | "sending" | "ok" | "error";

function buildSummary(report: Report): string {
  const lines = [
    `Индекс здоровья базы: ${report.score}/100 (${report.zoneLabel})`,
    `Конфигурация: ${report.configLine}`,
    "",
    "Выявленные риски:",
    ...report.risks.map(
      (r) => `- [${sevRu(r.severity)}] ${r.title}`,
    ),
    "",
    `Ориентировочная оценка: от ${formatRub(report.estimate.priceFrom)}, ${report.estimate.weeks}`,
  ];
  return lines.join("\n");
}

function sevRu(s: Report["risks"][number]["severity"]): string {
  return s === "high" ? "высокий" : s === "med" ? "средний" : "низкий";
}

export function ContactForm({ report }: { report: Report }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const summary = buildSummary(report);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "Заявка на диагностику 1С (экспресс-аудит)",
          Имя: name || "—",
          Контакт: contact,
          Комментарий: comment || "—",
          Результат_аудита: summary,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="print-block rounded-xl2 border-2 border-ok/40 bg-surface p-6 text-center md:p-8">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ok text-white">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-[1.45rem] font-extrabold text-ink">
          Заявка отправлена
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[1.05rem] leading-relaxed text-ink">
          Свяжемся с вами в ближайшее время и согласуем удобное время
          15-минутной диагностики. Спасибо!
        </p>
      </div>
    );
  }

  const mailtoHref =
    `mailto:${OWNER_EMAIL}?subject=` +
    encodeURIComponent("Заявка на диагностику 1С") +
    "&body=" +
    encodeURIComponent(`Имя: ${name}\nКонтакт: ${contact}\nКомментарий: ${comment}\n\n${summary}`);

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Как к вам обращаться"
          value={name}
          onChange={setName}
          placeholder="Имя"
          autoComplete="name"
        />
        <Field
          label="Телефон или e-mail"
          required
          value={contact}
          onChange={setContact}
          placeholder="+7 999 000-00-00"
          autoComplete="tel"
        />
      </div>
      <label className="block">
        <span className="mb-1.5 block font-display text-[1rem] font-bold text-ink">
          Комментарий{" "}
          <span className="font-medium text-ink-2">(необязательно)</span>
        </span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Удобное время, дополнительные детали…"
          className="w-full resize-y rounded-xl border-2 border-line bg-paper px-4 py-3 text-[1.05rem] text-ink placeholder:text-ink-2/70 focus:border-accent focus:outline-none"
        />
      </label>

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={!contact.trim() || status === "sending"}>
          {status === "sending" ? "Отправляем…" : "Записаться на диагностику"}
        </Button>
        {status === "error" && (
          <p className="text-[0.98rem] font-medium text-risk-high">
            Не удалось отправить. Напишите напрямую:{" "}
            <a className="font-bold underline" href={mailtoHref}>
              отправить письмом
            </a>
            .
          </p>
        )}
        <p className="text-center text-[0.9rem] text-ink-2">
          Нажимая кнопку, вы соглашаетесь на обработку контактных данных для связи.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-[1rem] font-bold text-ink">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        type="text"
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-line bg-paper px-4 py-3 text-[1.05rem] text-ink placeholder:text-ink-2/70 focus:border-accent focus:outline-none"
      />
    </label>
  );
}
