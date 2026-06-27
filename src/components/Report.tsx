import type { Report, Risk } from "../types";
import { formatRub } from "../generateReport";
import { HealthScore } from "./HealthScore";
import { ContactForm } from "./ContactForm";
import { Button, cx } from "./ui";

const SEV: Record<Risk["severity"], { label: string; dot: string; chip: string }> = {
  high: {
    label: "Высокий приоритет",
    dot: "bg-risk-high",
    chip: "text-risk-high bg-risk-high/10",
  },
  med: {
    label: "Средний приоритет",
    dot: "bg-risk-med",
    chip: "text-risk-med bg-risk-med/10",
  },
  low: {
    label: "Низкий приоритет",
    dot: "bg-risk-low",
    chip: "text-risk-low bg-risk-low/10",
  },
};

export function ReportView({
  report,
  onRestart,
}: {
  report: Report;
  onRestart: () => void;
}) {
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="report-root mx-auto max-w-content px-5 py-8 md:px-8 md:py-12">
      {/* Report header band */}
      <div className="print-block overflow-hidden rounded-xl2 bg-ink text-white shadow-lift">
        <div className="px-6 py-7 md:px-9 md:py-8">
          <p className="font-display text-[0.85rem] font-bold uppercase tracking-wider text-white/60">
            Экспресс-аудит 1С · {today}
          </p>
          <h1 className="mt-2 font-display text-[1.9rem] font-extrabold leading-tight tracking-tight md:text-[2.5rem]">
            Отчёт по вашей базе 1С
          </h1>
          <p className="mt-2 text-[1.05rem] font-medium text-white/80">
            {report.configLine}
          </p>
        </div>
      </div>

      {/* Score + summary */}
      <div className="mt-6 grid gap-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <HealthScore report={report} />
        </div>
        <div className="md:col-span-7">
          <div className="print-block h-full rounded-xl2 border border-line bg-surface p-6 shadow-card md:p-8">
            <h2 className="font-display text-[1.3rem] font-extrabold tracking-tight text-ink">
              Краткое заключение
            </h2>
            <p className="mt-3 text-[1.12rem] leading-relaxed text-ink">
              {report.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Risks */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[1.6rem] font-extrabold tracking-tight text-ink sm:text-[2rem]">
            Выявленные риски
          </h2>
          <span className="tnum shrink-0 text-[1rem] font-semibold text-ink-2">
            {report.risks.length} {report.risks.length === 1 ? "пункт" : "пунктов"}
          </span>
        </div>

        {report.risks.length === 0 ? (
          <div className="mt-5 print-block rounded-xl2 border-2 border-ok/40 bg-surface p-6 text-[1.1rem] leading-relaxed text-ink">
            По анкете явных проблем не видно — это хороший знак. Точную картину
            покажет короткая диагностика по вашей реальной базе.
          </div>
        ) : (
          <ol className="mt-5 grid gap-4">
            {report.risks.map((r, idx) => (
              <RiskRow key={r.id} risk={r} n={idx + 1} />
            ))}
          </ol>
        )}
      </section>

      {/* Plan */}
      <section className="mt-12">
        <h2 className="font-display text-[1.6rem] font-extrabold tracking-tight text-ink sm:text-[2rem]">
          Рекомендованный план работ
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {report.plan.map((s) => (
            <div
              key={s.n}
              className="print-block rounded-xl2 border border-line bg-surface p-6 shadow-card"
            >
              <div className="flex items-center gap-3">
                <span className="tnum grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent font-display text-[1.1rem] font-extrabold text-white">
                  {s.n}
                </span>
                <h3 className="font-display text-[1.2rem] font-bold leading-tight text-ink">
                  {s.title}
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {s.items.map((it, k) => (
                  <li key={k} className="flex gap-2.5 text-[1.02rem] leading-relaxed text-ink">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Estimate */}
      <section className="mt-12">
        <div className="print-block rounded-xl2 border border-line bg-surface p-6 shadow-card md:p-8">
          <h2 className="font-display text-[1.6rem] font-extrabold tracking-tight text-ink sm:text-[1.9rem]">
            Ориентировочная оценка
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-paper p-5">
              <p className="text-[0.95rem] font-semibold text-ink-2">Стоимость работ</p>
              <p className="tnum mt-1 font-display text-[2.2rem] font-extrabold text-ink">
                от {formatRub(report.estimate.priceFrom)}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-5">
              <p className="text-[0.95rem] font-semibold text-ink-2">Сроки</p>
              <p className="mt-1 font-display text-[2.2rem] font-extrabold text-ink">
                {report.estimate.weeks}
              </p>
            </div>
          </div>
          <p className="mt-4 text-[1rem] leading-relaxed text-ink-2">
            {report.estimate.note}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mt-12 scroll-mt-24">
        <div className="print-block rounded-xl2 border-2 border-accent/25 bg-accent-soft p-6 shadow-card md:p-9">
          <div className="max-w-2xl">
            <h2 className="font-display text-[1.7rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2.1rem]">
              Бесплатная 15-минутная диагностика
            </h2>
            <p className="mt-3 text-[1.12rem] leading-relaxed text-ink">
              Разберём ваш отчёт вживую, ответим на вопросы и подскажем, с чего
              начать — без обязательств. Оставьте контакт, и мы свяжемся с вами.
            </p>
          </div>
          <div className="mt-6 rounded-xl2 border border-line bg-surface p-5 md:p-7">
            <ContactForm report={report} />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="ghost" size="md" onClick={() => window.print()}>
          Распечатать / сохранить PDF
        </Button>
        <Button variant="subtle" size="md" onClick={onRestart}>
          Пройти аудит заново
        </Button>
      </div>
    </div>
  );
}

function RiskRow({ risk, n }: { risk: Risk; n: number }) {
  const sev = SEV[risk.severity];
  return (
    <li className="print-block rounded-xl2 border border-line bg-surface p-5 shadow-card md:p-6">
      <div className="flex items-start gap-4">
        <span
          className={cx(
            "mt-1 h-3.5 w-3.5 shrink-0 rounded-full",
            sev.dot,
          )}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h3 className="font-display text-[1.25rem] font-bold leading-tight text-ink">
              {n}. {risk.title}
            </h3>
            <span
              className={cx(
                "rounded-full px-2.5 py-0.5 text-[0.8rem] font-bold",
                sev.chip,
              )}
            >
              {sev.label}
            </span>
          </div>
          <p className="mt-2 text-[1.08rem] font-semibold leading-relaxed text-ink">
            {risk.what}
          </p>
          <p className="mt-1.5 text-[1.05rem] leading-relaxed text-ink-2">
            {risk.why}
          </p>
        </div>
      </div>
    </li>
  );
}
