export function addRecord(crate, title, minutes) {
  return [...crate, { title, minutes }];
}

export function totalMinutes(crate) {
  return crate.reduce((sum, record) => sum + record.minutes, 0);
}

export function longest(crate) {
  return crate.reduce((best, record) => (record.minutes > best.minutes ? record : best));
}
