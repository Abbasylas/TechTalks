// These are our English fan notes, not text returned by JSONPlaceholder.
const notes = [
  {
    title: "Thorfinn and the search for a different life",
    body: "Thorfinn grows up surrounded by violence. His journey asks whether someone shaped by conflict can choose a more peaceful future.",
  },
  {
    title: "What makes a true warrior?",
    body: "Thors gives the story a different idea of strength. Protecting others can take more courage than winning a fight.",
  },
  {
    title: "Vinland is more than a destination",
    body: "For Thorfinn, Vinland begins as a distant dream. It also becomes a way to imagine life beyond the battlefield.",
  },
  {
    title: "Why Askeladd is hard to forget",
    body: "Askeladd combines charm, cruelty, and careful planning. His choices make him a difficult character to trust and an interesting one to watch.",
  },
  {
    title: "Canute and the weight of power",
    body: "Canute offers another view of change. His story raises questions about leadership and the cost of trying to build a better world.",
  },
  {
    title: "Einar and the value of friendship",
    body: "Einar brings a farmer’s perspective to a story full of warriors. His connection with Thorfinn makes everyday kindness feel important.",
  },
  {
    title: "A quieter kind of struggle",
    body: "The farm setting shifts attention toward work, responsibility, and reflection. Small decisions begin to matter as much as battles.",
  },
  {
    title: "Leif and the promise of adventure",
    body: "Leif’s stories give young Thorfinn a glimpse of a wider world. Exploration offers a different purpose from fighting.",
  },
  {
    title: "The cost of revenge",
    body: "Vinland Saga asks what happens when anger becomes someone’s only reason to keep going. The emotional damage reaches far beyond a single fight.",
  },
  {
    title: "Finding hope beyond the battlefield",
    body: "The anime leaves room for hope alongside its harsh setting. Learning to care for another person can be the start of real change.",
  },
];

// Keep the API record ID, but give its placeholder text an English display version.
export function vinlandNote(id: number) {
  return notes[id - 1] ?? {
    title: "Another step toward Vinland",
    body: "A fan note on the choices, friendships, and hopes that shape Thorfinn’s journey.",
  };
}
