import { describe, expect, it } from "vitest";
import { formatSqlResults, runSqlProgram, type SqlDatabaseLike, type SqlStatementLike } from "./sqlFormat.js";

describe("formatSqlResults", () => {
  it("renders a header, dash separator, and pipe-joined rows", () => {
    const out = formatSqlResults([
      { columns: ["id", "name"], values: [[1, "Ada"], [2, "Grace"]] },
    ]);
    expect(out).toBe("id | name\n---------\n1 | Ada\n2 | Grace\n");
  });

  it("renders NULL for null values and separates result sets with a blank line", () => {
    const out = formatSqlResults([
      { columns: ["a"], values: [[null]] },
      { columns: ["b"], values: [[2]] },
    ]);
    expect(out).toBe("a\n-\nNULL\n\nb\n-\n2\n");
  });

  it("renders (no rows) for an empty SELECT", () => {
    const out = formatSqlResults([{ columns: ["id", "name"], values: [] }]);
    expect(out).toBe("id | name\n---------\n(no rows)\n");
  });

  it("returns an empty string when no statement produced rows", () => {
    expect(formatSqlResults([])).toBe("");
  });
});

// A minimal scripted fake of sql.js: each "statement" is pre-baked. Lets us
// pin the seed-before-entry execution order without loading wasm.
function fakeDb(log: string[]): SqlDatabaseLike {
  return {
    iterateStatements(sql: string): Iterable<SqlStatementLike> {
      log.push(sql);
      const isSelect = /^select/i.test(sql.trim());
      let stepped = false;
      const stmt: SqlStatementLike = {
        getColumnNames: () => (isSelect ? ["n"] : []),
        step: () => {
          if (stepped) return false;
          stepped = true;
          return isSelect; // SELECT yields one row; DDL/DML yields none
        },
        get: () => [42],
      };
      return [stmt];
    },
  };
}

describe("runSqlProgram", () => {
  it("executes seed files before the entry and collects entry results", () => {
    const log: string[] = [];
    const results = runSqlProgram(
      fakeDb(log),
      { "query.sql": "SELECT n FROM t", "seed.sql": "CREATE TABLE t(n)", "notes.txt": "ignored" },
      "query.sql",
    );
    expect(log).toEqual(["CREATE TABLE t(n)", "SELECT n FROM t"]);
    expect(results).toEqual([{ columns: ["n"], values: [[42]] }]);
  });
});
