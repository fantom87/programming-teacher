// Three tickets to triage:
//   "Server down"      -> Priority.High
//   "Slow search"      -> Priority.Medium
//   "Typo on homepage" -> Priority.Low
//
// Print one line each:  {title}: {priority} - respond {ResponseTime(priority)}
//   Server down: High - respond within 1 hour
//   Slow search: Medium - respond within 1 day
//   Typo on homepage: Low - respond within 1 week

// Below the statements, define:
//   string ResponseTime(Priority p) — a switch expression:
//     High -> "within 1 hour", Medium -> "within 1 day",
//     Low -> "within 1 week", _ -> "someday"

// And at the very bottom, the enum itself:
//   enum Priority { Low, Medium, High }
