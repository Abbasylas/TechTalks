"use client";

import { useState } from "react";

const initialTasks = [
  { id: "sword-control", label: "Sword control", complete: false },
  { id: "physical-endurance", label: "Physical endurance", complete: false },
  { id: "team-coordination", label: "Team coordination", complete: false },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const completed = tasks.filter((task) => task.complete).length;
  const percentage = Math.round((completed / tasks.length) * 100);

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, complete: !task.complete } : task,
      ),
    );
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
      <p>Progress resets on refresh.</p>
    </main>
  );
}

