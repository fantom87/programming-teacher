import { totalMinutes, longest } from "./crates.js";

export function crateReport(crate) {
  return [
    `${crate.length} records, ${totalMinutes(crate)} minutes`,
    `longest: ${longest(crate).title}`,
  ];
}
