import { JSDOM } from "jsdom";
import type { DomAssertion } from "@teacher/shared";
import { describeAssertion, type DomAssertionOutcome } from "@teacher/shared";

// Canonical dom-check evaluation. jsdom parses HTML + stylesheets but does no
// layout — content authoring rules route visual/layout outcomes to ai-judge.

export function buildDocument(files: Record<string, string>): { html: string; dom: JSDOM } {
  const entry = Object.keys(files).find((f) => f.endsWith(".html")) ?? "index.html";
  let html = files[entry] ?? "";
  // Inline linked local stylesheets so cssRule assertions can see them.
  for (const [name, contents] of Object.entries(files)) {
    if (name.endsWith(".css")) {
      const linkRe = new RegExp(`<link[^>]*href=["']${name.replace(".", "\\.")}["'][^>]*>`, "i");
      if (linkRe.test(html)) html = html.replace(linkRe, `<style>${contents}</style>`);
    }
  }
  return { html, dom: new JSDOM(html) };
}

function cssRuleMatches(dom: JSDOM, selector: string, property: string, equals: string): { ok: boolean; found?: string } {
  const doc = dom.window.document;
  for (const styleEl of Array.from(doc.querySelectorAll("style"))) {
    const sheet = (styleEl as { sheet?: CSSStyleSheet }).sheet;
    if (!sheet) continue;
    for (const rule of Array.from(sheet.cssRules)) {
      const style = (rule as CSSStyleRule).style;
      const selText = (rule as CSSStyleRule).selectorText;
      if (!style || !selText) continue;
      if (selText.split(",").map((s) => s.trim()).includes(selector)) {
        const value = style.getPropertyValue(property).trim();
        if (value) {
          return { ok: value === equals, found: value };
        }
      }
    }
  }
  return { ok: false };
}

export function evaluateDomAssertions(files: Record<string, string>, assertions: DomAssertion[]): {
  outcomes: DomAssertionOutcome[];
  domSnapshot: string;
} {
  const { dom } = buildDocument(files);
  const doc = dom.window.document;

  const outcomes: DomAssertionOutcome[] = assertions.map((a) => {
    try {
      if ("exists" in a) {
        const ok = doc.querySelector(a.selector) !== null;
        return { assertion: a, passed: ok, detail: ok ? undefined : `nothing matches "${a.selector}"` };
      }
      if ("textContains" in a) {
        const els = Array.from(doc.querySelectorAll(a.selector));
        const ok = els.some((el) => (el.textContent ?? "").includes(a.textContains));
        return {
          assertion: a,
          passed: ok,
          detail: ok ? undefined : `no "${a.selector}" contains the text "${a.textContains}"`,
        };
      }
      if ("count" in a) {
        const n = doc.querySelectorAll(a.selector).length;
        return {
          assertion: a,
          passed: n === a.count,
          detail: n === a.count ? undefined : `expected ${a.count} × "${a.selector}", found ${n}`,
        };
      }
      if ("attr" in a) {
        const els = Array.from(doc.querySelectorAll(a.selector));
        const ok = els.some((el) => el.getAttribute(a.attr) === a.equals);
        return {
          assertion: a,
          passed: ok,
          detail: ok ? undefined : `no "${a.selector}" has ${a.attr}="${a.equals}"`,
        };
      }
      const res = cssRuleMatches(dom, a.selector, a.cssRule.property, a.cssRule.equals);
      return {
        assertion: a,
        passed: res.ok,
        detail: res.ok
          ? undefined
          : res.found
            ? `"${a.selector}" has ${a.cssRule.property}: ${res.found}, expected ${a.cssRule.equals}`
            : `no CSS rule sets ${a.cssRule.property} on "${a.selector}"`,
      };
    } catch (err) {
      return { assertion: a, passed: false, detail: `invalid assertion (${describeAssertion(a)}): ${String(err)}` };
    }
  });

  return { outcomes, domSnapshot: doc.documentElement.outerHTML };
}
