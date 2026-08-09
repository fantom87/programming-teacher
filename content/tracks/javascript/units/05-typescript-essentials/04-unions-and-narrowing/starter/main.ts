// 1. type Id = string | number;

// 2. normalizeId(id: Id): string — typeof is the fork in the road:
//    number  -> "#" + String(id).padStart(4, "0")     42 -> "#0042"
//    string  -> "#" + id.toUpperCase()                "order-9" -> "#ORDER-9"

// 3. type Level = "low" | "medium" | "high";

// 4. alarm(level: Level): string -> "volume 2" / "volume 5" / "volume 10"

// 5. Then uncomment:
// console.log(normalizeId(42));
// console.log(normalizeId("order-9"));
// console.log(alarm("low"));
// console.log(alarm("medium"));
// console.log(alarm("high"));
