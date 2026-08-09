// Deterministic tabular rendering for SQL result sets. Both the server's
// in-process sql.js runner and the browser SQL runner format through here, so
// a lesson's stdout check byte-matches whichever side produced the output.

export interface SqlResultSet {
  columns: string[];
  values: unknown[][];
}

/** Structural subset of sql.js — shared must not depend on sql.js itself. */
export interface SqlStatementLike {
  step(): boolean;
  get(): unknown[];
  getColumnNames(): string[];
}

export interface SqlDatabaseLike {
  iterateStatements(sql: string): Iterable<SqlStatementLike>;
}

function cell(v: unknown): string {
  return v === null || v === undefined ? "NULL" : String(v);
}

/**
 * Format result sets as text tables: header row joined with " | ", a
 * separator line of dashes, then one line per row. Result sets are separated
 * by a blank line; a row-less SELECT renders "(no rows)" under its header.
 */
export function formatSqlResults(results: SqlResultSet[]): string {
  const blocks = results.map((r) => {
    const header = r.columns.join(" | ");
    const lines = [header, "-".repeat(header.length)];
    if (r.values.length === 0) lines.push("(no rows)");
    else for (const row of r.values) lines.push(row.map(cell).join(" | "));
    return lines.join("\n");
  });
  return blocks.length > 0 ? `${blocks.join("\n\n")}\n` : "";
}

/**
 * Execute every statement in `sql`, collecting one result set per
 * row-returning statement. Statements that return no columns (CREATE, INSERT,
 * …) still execute; a SELECT that matches nothing still yields its header
 * with zero rows (so the formatter can print "(no rows)").
 */
export function executeSqlScript(db: SqlDatabaseLike, sql: string): SqlResultSet[] {
  const out: SqlResultSet[] = [];
  for (const stmt of db.iterateStatements(sql)) {
    const columns = stmt.getColumnNames();
    if (columns.length === 0) {
      stmt.step(); // executes the statement even though it yields no rows
      continue;
    }
    const values: unknown[][] = [];
    while (stmt.step()) values.push(stmt.get());
    out.push({ columns, values });
  }
  return out;
}

/**
 * The shared run semantics for a SQL lesson: execute every non-entry .sql
 * file first (seed data, in files order), then the entry, returning all
 * result sets in execution order.
 */
export function runSqlProgram(db: SqlDatabaseLike, files: Record<string, string>, entry: string): SqlResultSet[] {
  const results: SqlResultSet[] = [];
  for (const [name, sql] of Object.entries(files)) {
    if (name !== entry && name.endsWith(".sql")) results.push(...executeSqlScript(db, sql));
  }
  results.push(...executeSqlScript(db, files[entry] ?? ""));
  return results;
}
