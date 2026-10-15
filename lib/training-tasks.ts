export type TrainingTask = {
  id: string;
  label: string;
  description: string;
  priority: "High" | "Medium";
};

export const trainingTasks: TrainingTask[] = [
  {
    id: "sword-control",
    label: "Sword control",
    description: "Practise precise anti-magic sword movements.",
    priority: "High",
  },
  {
    id: "physical-endurance",
    label: "Physical endurance",
    description: "Complete a focused strength and stamina session.",
    priority: "Medium",
  },
  {
    id: "team-coordination",
    label: "Team coordination",
    description: "Review a preparation plan with the Black Bulls.",
    priority: "High",
  },
];
