"use client";

import { useEffect, useState } from "react";

const storageKey = "asta-training-completion-v1";

const initialTasks = [
  { id: "sword-control", label: "Sword control", complete: false },
  { id: "physical-endurance", label: "Physical endurance", complete: false },
  { id: "team-coordination", label: "Team coordination", complete: false },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    // Read browser storage after hydration; never overwrite it with initial state.
    /* eslint-disable react-hooks/set-state-in-effect -- Restore external browser state after server hydration. */
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved)) {
        setTasks(initialTasks.map((task) => ({
          ...task,
          complete: saved.includes(task.id),
        })));
      }
    } catch {
      setStorageAvailable(false);
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  const completed = tasks.filter((task) => task.complete).length;
  const percentage = Math.round((completed / tasks.length) * 100);

  function toggleTask(id: string) {
    const next = tasks.map((task) =>
      task.id === id ? { ...task, complete: !task.complete } : task,
    );
    setTasks(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(
        next.filter((task) => task.complete).map((task) => task.id),
      ));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }

  return (
    <main>
      <h1>Training progress POC</h1>
      <p>A small experiment for Asta’s preparation.</p>
      <section aria-labelledby="progress-heading">
        <h2 id="progress-heading">Preparation progress</h2>
        <p role="status" aria-live="polite" aria-atomic="true">
          <span data-testid="count">{completed} / {tasks.length}</span> completed ·{" "}
          <span data-testid="percentage">{percentage}%</span>
        </p>
      </section>
      <fieldset>
        <legend>Training tasks</legend>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.complete}
                  disabled={!loaded}
                  onChange={() => toggleTask(task.id)}
                  aria-label={task.label}
                />
                <span>{task.label}</span>
                <span>{task.complete ? "Complete" : "Incomplete"}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <p role="status">{!loaded ? "Loading saved progress…" : storageAvailable
        ? "Progress is saved in this browser."
        : "Browser saving is unavailable. Progress may reset on refresh."}</p>
    </main>
  );
}

