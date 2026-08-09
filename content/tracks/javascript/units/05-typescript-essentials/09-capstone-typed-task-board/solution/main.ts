interface Task {
  id: number;
  title: string;
  done: boolean;
}

type Action =
  | { kind: "add"; title: string }
  | { kind: "toggle"; id: number }
  | { kind: "remove"; id: number };

function apply(tasks: Task[], action: Action): Task[] {
  switch (action.kind) {
    case "add": {
      const nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
      return [...tasks, { id: nextId, title: action.title, done: false }];
    }
    case "toggle":
      return tasks.map((task) =>
        task.id === action.id ? { ...task, done: !task.done } : task,
      );
    case "remove":
      return tasks.filter((task) => task.id !== action.id);
    default: {
      const impossible: never = action;
      throw new Error(`unhandled action: ${JSON.stringify(impossible)}`);
    }
  }
}

function render(tasks: Task[]): void {
  console.log("== Task Board ==");
  for (const task of tasks) {
    console.log(`${task.done ? "[x]" : "[ ]"} ${task.title}`);
  }
  const doneCount = tasks.filter((task) => task.done).length;
  console.log(`${doneCount} of ${tasks.length} done`);
}

const script1: Action[] = [
  { kind: "add", title: "write types" },
  { kind: "add", title: "narrow unions" },
  { kind: "add", title: "ship the capstone" },
  { kind: "toggle", id: 1 },
];

const script2: Action[] = [
  { kind: "remove", id: 2 },
  { kind: "toggle", id: 3 },
];

let board: Task[] = [];
for (const action of script1) board = apply(board, action);
render(board);
console.log("");
for (const action of script2) board = apply(board, action);
render(board);
