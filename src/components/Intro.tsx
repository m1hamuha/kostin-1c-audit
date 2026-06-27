import { Button, Chip, ArrowIcon, CheckIcon } from "./ui";

const getItems = [
  {
    t: "Индекс здоровья базы",
    d: "Одна понятная оценка состояния вашей 1С от 0 до 100.",
  },
  {
    t: "Список рисков по приоритету",
    d: "Что и почему важно — простыми словами, без технического жаргона.",
  },
  {
    t: "План работ по этапам",
    d: "С чего начать и что делать дальше, чтобы навести порядок.",
  },
  {
    t: "Оценка по срокам и цене",
    d: "Ориентир «от» — чтобы понимать порядок вложений.",
  },
];

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-content px-5 md:px-8">
      {/* Hero */}
      <section className="grid items-center gap-10 py-12 md:grid-cols-12 md:py-20">
        <div className="md:col-span-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[0.9rem] font-semibold text-ink">
            <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />
            Бесплатно · без регистрации
          </div>
          <h1 className="font-display text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-[3.1rem] md:text-[3.6rem]">
            Проверим вашу 1С
            <br />
            за 3 минуты
          </h1>
          <p className="mt-5 max-w-xl text-[1.15rem] leading-relaxed text-ink">
            Ответьте на несколько простых вопросов — и получите готовый отчёт:
            где база теряет время, какие есть риски и что чинить в первую
            очередь.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={onStart} className="w-full sm:w-auto">
              Начать аудит
              <ArrowIcon className="h-5 w-5" />
            </Button>
            <span className="text-[0.95rem] font-medium text-ink-2">
              Готовый отчёт сразу на экране
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Chip>≈ 3 минуты</Chip>
            <Chip>7 коротких шагов</Chip>
            <Chip>Понятный отчёт</Chip>
          </div>
        </div>

        {/* Signature preview: the deliverable */}
        <div className="md:col-span-5">
          <PreviewCard />
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-line py-12 md:py-16">
        <h2 className="font-display text-[1.6rem] font-extrabold tracking-tight text-ink sm:text-[2rem]">
          Что вы получите
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {getItems.map((it) => (
            <div
              key={it.t}
              className="rounded-xl2 border border-line bg-surface p-5 shadow-card"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-[1.15rem] font-bold text-ink">
                    {it.t}
                  </h3>
                  <p className="mt-1 text-[1.02rem] leading-relaxed text-ink">
                    {it.d}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-9">
          <Button onClick={onStart} className="w-full sm:w-auto">
            Начать аудит
            <ArrowIcon className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="rounded-xl2 border border-line bg-surface p-6 shadow-lift">
      <p className="font-display text-[0.85rem] font-bold uppercase tracking-wider text-ink-2">
        Пример отчёта
      </p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[0.95rem] font-semibold text-ink">
            Индекс здоровья базы
          </p>
          <p className="mt-1 text-[0.92rem] text-ink-2">Есть что улучшить</p>
        </div>
        <div className="tnum font-display text-[3.2rem] font-extrabold leading-none text-risk-med">
          62
        </div>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-risk-med"
          style={{ width: "62%" }}
        />
      </div>
      <ul className="mt-5 space-y-2.5">
        <PreviewRisk color="bg-risk-high" label="Нет резервных копий" tag="высокий" />
        <PreviewRisk color="bg-risk-med" label="Низкая производительность" tag="средний" />
        <PreviewRisk color="bg-risk-low" label="Не хватает отчётов" tag="низкий" />
      </ul>
    </div>
  );
}

function PreviewRisk({
  color,
  label,
  tag,
}: {
  color: string;
  label: string;
  tag: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-line px-3.5 py-2.5">
      <span className="flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} aria-hidden="true" />
        <span className="text-[1rem] font-semibold text-ink">{label}</span>
      </span>
      <span className="text-[0.82rem] font-semibold text-ink-2">{tag}</span>
    </li>
  );
}
