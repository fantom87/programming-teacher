const ada = { name: "Ada", address: { city: "London" } };
const drifter = { name: "Drifter" };

const post1 = { title: "Hello", tags: ["javascript", "intro"] };
const post2 = { title: "Untitled" };

const veteran = { name: "Vex", score: 0 };
const rookie = { name: "Nia" };

// 1. cityOf(user) — RETURN user's address.city, or "unknown" if any
//    step of the path is missing (even cityOf(null) must be safe).

// 2. firstTag(post) — RETURN the first entry of post.tags, or "untagged".

// 3. scoreLine(player) — RETURN `score: ${...}` — the player's score,
//    falling back to "n/a". A score of 0 is REAL data: ?? not ||.

// 4. Print cityOf(ada), cityOf(drifter), firstTag(post1),
//    firstTag(post2), scoreLine(veteran), scoreLine(rookie).
