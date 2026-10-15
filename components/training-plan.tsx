"use client";

import { useEffect, useState } from "react";
import type { TrainingTask } from "@/lib/training-tasks";

const storageKey = "asta-training-completion-v1";

export default function TrainingPlan({ tasks }: { tasks: TrainingTask[] }) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    // Restore only known IDs after hydration, before enabling edits.
    /* eslint-disable react-hooks/set-state-in-effect -- Synchronize external browser storage after server hydration. */
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (!Array.isArray(saved) || !saved.every((id) => typeof id === "string")) {
        throw new Error("Invalid saved completion data");
      }
      setCompletedIds(tasks.filter((task) => saved.includes(task.id)).map((task) => task.id));
    } catch {
      setStorageAvailable(false);
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [tasks]);

  const completed = completedIds.length;
  const percentage = Math.round((completed / tasks.length) * 100);

  function toggleTask(id: string) {
    const next = completedIds.includes(id)
      ? completedIds.filter((savedId) => savedId !== id)
      : [...completedIds, id];
    setCompletedIds(next);
    // Save the new state directly; never persist the initial empty hydration state.
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }

  return (
    <>
      <section className="dashboard-panel p-5 sm:p-7" aria-labelledby="progress-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2 text-gold">Your preparation plan</p>
            <h2 id="progress-heading" className="font-display text-2xl font-semibold tracking-tight">
              Preparation progress
            </h2>
          </div>
          <p className="font-display text-4xl font-bold leading-none tracking-tight text-crimson tabular-nums sm:text-5xl" data-testid="percentage">
            {percentage}%
          </p>
        </div>
        <div
          role="progressbar"
          aria-labelledby="progress-heading"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          aria-valuetext={`${completed} of ${tasks.length} tasks complete, ${percentage}%`}
          className="my-5 h-3 overflow-hidden rounded-full bg-track"
        >
          <div data-testid="progress-fill" className="h-full rounded-full bg-crimson" style={{ width: `${percentage}%` }} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted">
          <p role="status" aria-live="polite" aria-atomic="true">
            <span className="font-semibold text-foreground tabular-nums" data-testid="count">{completed} / {tasks.length}</span> completed
            <span className="sr-only">. {percentage}% preparation-plan completion.</span>
          </p>
          <p>Progress measures preparation-plan completion.</p>
        </div>
      </section>

      <section aria-labelledby="tasks-heading" className="mt-7 sm:mt-8">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg bg-surface px-4 py-3">
          <h2 id="tasks-heading" className="font-display text-2xl font-semibold tracking-tight">Training tasks</h2>
          <p className="text-sm text-muted">One step at a time.</p>
        </div>
        <ul className="space-y-3">
          {tasks.map((task) => {
            const complete = completedIds.includes(task.id);
            return (
              <li key={task.id}>
                <article className="task-card dashboard-panel relative flex gap-2 overflow-hidden p-4 sm:gap-4 sm:p-6" data-complete={complete}>
                  <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] ${task.priority === "High" ? "bg-crimson" : "bg-gold"}`} />
                  <label className="checkbox-target mt-0.5" htmlFor={task.id}>
                    <input
                      id={task.id}
                      type="checkbox"
                      checked={complete}
                      disabled={!loaded}
                      onChange={() => toggleTask(task.id)}
                      aria-labelledby={`${task.id}-name`}
                      aria-describedby={`${task.id}-description ${task.id}-status`}
                      className="task-checkbox"
                    />
                  </label>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="font-display text-lg font-semibold" id={`${task.id}-name`}>
                        <label className="cursor-pointer" htmlFor={task.id}>{task.label}</label>
                      </h3>
                      <span className={`priority-badge ${task.priority === "High" ? "text-crimson" : "text-gold"}`}>
                        {task.priority} priority
                      </span>
                    </div>
                    <p id={`${task.id}-description`} className="text-base leading-relaxed text-muted">{task.description}</p>
                    <p id={`${task.id}-status`} className={`mt-3 flex items-center gap-2 text-sm ${complete ? "text-gold" : "text-muted"}`}>
                      <span aria-hidden="true" className="status-mark">{complete ? "✓" : "○"}</span>
                      {complete ? "Complete" : "Incomplete"}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
      <p role="status" data-testid="saving-status" className="mx-auto mt-6 w-fit rounded-lg bg-surface px-4 py-2 text-center text-sm leading-relaxed text-muted">
        {!loaded ? "Loading saved progress…" : storageAvailable
          ? "Progress is saved in this browser."
          : "Browser saving is unavailable. Progress may reset on refresh."}
      </p>
    </>
  );
}
