import { addRecord } from "./crates.js";
import { crateReport } from "./report.js";

let crate = [];
crate = addRecord(crate, "Blue in Green", 37);
crate = addRecord(crate, "Aurora Suite", 52);
crate = addRecord(crate, "Night Drive", 41);

for (const line of crateReport(crate)) console.log(line);
