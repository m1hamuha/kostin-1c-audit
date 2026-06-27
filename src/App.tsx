import { useState } from "react";
import { emptyAnswers } from "./questions";
import type { Answers, Report } from "./types";
import { generateReport } from "./generateReport";
import { Intro } from "./components/Intro";
import { Questionnaire } from "./components/Questionnaire";
import { ReportView } from "./components/Report";

type Screen = "intro" | "quiz" | "report";

export function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [report, setReport] = useState<Report | null>(null);

  function start() {
    setAnswers(emptyAnswers);
    setScreen("quiz");
    window.scrollTo({ top: 0 });
  }

  function finish(final: Answers) {
    setAnswers(final);
    setReport(generateReport(final));
    setScreen("report");
    window.scrollTo({ top: 0 });
  }

  function restart() {
    setReport(null);
    setAnswers(emptyAnswers);
    setScreen("intro");
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader onLogoClick={restart} />
      <main className="flex-1">
        {screen === "intro" && <Intro onStart={start} />}
        {screen === "quiz" && (
          <Questionnaire initial={answers} onSubmit={finish} onExit={restart} />
        )}
        {screen === "report" && report && (
          <ReportView report={report} onRestart={restart} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 text-left"
          aria-label="На главную"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink font-display text-[0.95rem] font-extrabold text-white">
            1С
          </span>
          <span className="font-display text-[1.05rem] font-extrabold leading-tight tracking-tight text-ink">
            Экспресс-аудит
          </span>
        </button>
        <a
          href="#cta"
          className="hidden text-[0.95rem] font-semibold text-accent hover:text-accent-ink sm:inline"
        >
          Бесплатная диагностика
        </a>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className="mx-auto flex max-w-content flex-col gap-1 px-5 py-7 text-[0.95rem] text-ink-2 md:px-8">
        <p className="font-semibold text-ink">Экспресс-аудит 1С</p>
        <p>
          Внедрение, доработка и сопровождение 1С. Связь:{" "}
          <a className="font-semibold text-accent hover:text-accent-ink" href="mailto:kostinmihail40@gmail.com">
            kostinmihail40@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
