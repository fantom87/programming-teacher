type Id = string | number;

function normalizeId(id: Id): string {
  if (typeof id === "number") {
    return "#" + String(id).padStart(4, "0");
  }
  return "#" + id.toUpperCase();
}

type Level = "low" | "medium" | "high";

function alarm(level: Level): string {
  if (level === "low") return "volume 2";
  if (level === "medium") return "volume 5";
  return "volume 10";
}

console.log(normalizeId(42));
console.log(normalizeId("order-9"));
console.log(alarm("low"));
console.log(alarm("medium"));
console.log(alarm("high"));
