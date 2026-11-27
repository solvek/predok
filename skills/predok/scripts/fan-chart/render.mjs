#!/usr/bin/env node
// Fan chart page from chart data. No dependencies; the data may come from any source (see SKILL.md, "Confidence fan chart").
//
//   node render.mjs <data.json> [out.html] [--lang uk|en] [--show 5] [--title "…"] [--date YYYY-MM-DD]
//
// data.json: { "rows": Row[], "forks": Fork[] }  (`forks` may be omitted)
//   Row  = { n, name, b?, d?, l?, s?, t?, alt?, skip? }
//     n     sector number by Sosa–Stradonitz: 1 is the root, 2n the father of n, 2n+1 the mother (always counted from the root)
//     name  short name; b / d  dates ("1836-04-02", "ABT 1836", "BET 1867 AND 1868")
//     l     level of the link to the child: 3 confirmed, 2 probable, 1 conjecture, 0 no assertion (the root has none)
//     s     state of the link: "disputed" | "ambiguous"
//     t     short note on what the link rests on; alt  line about other candidates
//     skip  sector number of an ambiguous link that this common ancestor goes around
//   Fork = { n, who, labels: string[], probs: ({p, lo, hi, date} | null)[], alts: Row[][] }
//     n     sector of the child whose parents are uncertain; labels[0] is the main version, labels[i] the i-th alternative
//     alts  for each alternative the rows that replace everything above the child
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chart, serialise } from "./i18n.mjs";

const here = dirname(fileURLToPath(import.meta.url));

/** Page HTML for the data; pure, so other scripts can call it. */
export function renderPage({ rows, forks = [] }, { lang = "uk", show = 5, title = "", date = new Date().toLocaleDateString("sv-SE") } = {}) {
  if (!chart[lang]) throw new Error(`Unknown language "${lang}": ${Object.keys(chart).join(", ")}`);
  if (!Number.isInteger(show) || show < 1 || show > 5) throw new Error("--show must be an integer from 1 to 5");
  return readFileSync(join(here, "template.html"), "utf8")
    .replace("__DATA__", () => JSON.stringify(rows))
    .replace("__FORKS__", () => JSON.stringify(forks))
    .replace("__I18N__", () => serialise(lang))
    .replace("__TITLE__", () => JSON.stringify(title))
    .replace("__SHOW__", () => String(show))
    .replaceAll("__LANG__", lang)
    .replaceAll("__DATE__", date);
}

function main() {
  const args = process.argv.slice(2);
  const opt = (name, fallback) => {
    const i = args.indexOf(`--${name}`);
    if (i < 0) return fallback;
    const [, v] = args.splice(i, 2);
    return v ?? fallback;
  };
  const lang = opt("lang", "uk");
  const show = Number(opt("show", "5"));
  const title = opt("title", "");
  const date = opt("date", undefined);
  const [input, output = "confidence-fan.html"] = args;
  if (!input) {
    console.error("Usage: node render.mjs <data.json> [out.html] [--lang uk|en] [--show 5] [--title …] [--date YYYY-MM-DD]");
    process.exit(2);
  }
  const data = JSON.parse(readFileSync(resolve(input), "utf8"));
  if (!Array.isArray(data.rows) || !data.rows.some((r) => r.n === 1)) throw new Error('data.rows must hold the root, sector n = 1');
  const out = resolve(output);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, renderPage(data, { lang, show, title, ...(date ? { date } : {}) }));
  console.log(`${data.rows.length} rows, ${(data.forks ?? []).length} forks -> ${out}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
