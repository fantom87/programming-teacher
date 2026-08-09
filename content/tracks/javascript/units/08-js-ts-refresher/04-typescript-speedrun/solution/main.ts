interface Player {
  name: string;
  score: number;
  badge?: string;
}

function describePlayer(p: Player): string {
  return `${p.name} — ${p.score}${p.badge ? ` [${p.badge}]` : ""}`;
}

type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.r ** 2;
    case "rect":
      return shape.w * shape.h;
    default: {
      const impossible: never = shape;
      throw new Error(`unhandled shape: ${JSON.stringify(impossible)}`);
    }
  }
}

function firstOr<T>(items: T[], fallback: T): T {
  return items.length > 0 ? items[0] : fallback;
}

// Drill — leave these prints exactly as they are:
console.log(describePlayer({ name: "Ada", score: 120, badge: "pro" }));
console.log(describePlayer({ name: "Lin", score: 80 }));
console.log(area({ kind: "circle", r: 2 }).toFixed(2));
console.log(area({ kind: "rect", w: 3, h: 4 }).toFixed(2));
console.log(firstOr(["a", "b"], "?"));
console.log(firstOr([], "empty"));
