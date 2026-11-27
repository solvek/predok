#!/usr/bin/env node
// Weigh two competing genealogical hypotheses: an ACH matrix plus Bayesian odds with a sensitivity range.
// Needs the `yaml` package: run `npm install yaml` in the research folder.
//
//   node weigh.mjs hypotheses/<name>.yaml   ->  writes hypotheses/<name>.report.md   [--lang uk|en]
//
// YAML format:
//   question: text            date: 'YYYY-MM-DD'
//   hypotheses: { H1: {label, assertion}, H2: {...} }     exactly two (odds form); `assertion` is the id of the
//                                                         assertion on the parent link, so from-glx.mjs can show the probability
//   prior: { H1: p, H2: p }
//   arguments: [{ id, text, kind, evidence, citations, ach: { H1: C|N|I|CC|II, H2: ... },
//                 lr: likelihood ratio H1:H2 (>1 favours H1), lr_low, lr_high, why }]
//   levels: { high: p, medium: p }                        thresholds for the report line; defaults 0.95 and 0.75
//
// ACH (Heuer): C/CC consistent, N neutral, I/II inconsistent. The hypothesis with fewer inconsistencies is preferred;
// the Bayesian part turns the same arguments into odds. The level never rises above "probable" by counting alone.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { report } from "./i18n.mjs";

async function loadYaml() {
  try {
    return await import("yaml");
  } catch {
    try {
      return createRequire(join(process.cwd(), "noop.js"))("yaml");
    } catch {
      throw new Error("The `yaml` package is missing: run `npm install yaml` in the research folder and repeat the command.");
    }
  }
}

const ACH_SCORE = { CC: 0, C: 0, N: 0, I: -1, II: -2 };
const posterior = (priorOdds, lrs) => {
  const odds = lrs.reduce((o, x) => o * x, priorOdds);
  return odds / (1 + odds);
};

async function main() {
  const args = process.argv.slice(2);
  const li = args.indexOf("--lang");
  const lang = li >= 0 ? args.splice(li, 2)[1] : "uk";
  const [file] = args;
  const R = report[lang];
  if (!file || !R) {
    console.error("Usage: node weigh.mjs hypotheses/<name>.yaml [--lang uk|en]");
    process.exit(2);
  }
  const { parse } = await loadYaml();
  const path = resolve(file);
  const d = parse(readFileSync(path, "utf8"));
  const [h1, h2] = Object.keys(d.hypotheses);
  const args_ = d.arguments;
  const priorOdds = d.prior[h1] / d.prior[h2];
  const p = posterior(priorOdds, args_.map((a) => a.lr ?? 1));
  const pLow = posterior(priorOdds, args_.map((a) => a.lr_low ?? a.lr ?? 1));
  const pHigh = posterior(priorOdds, args_.map((a) => a.lr_high ?? a.lr ?? 1));
  const th = d.levels ?? {};
  const level = (x) => (x >= (th.high ?? 0.95) ? R.levels.high : x >= (th.medium ?? 0.75) ? R.levels.medium : R.levels.low);
  const f2 = (x) => x.toFixed(2);

  const out = [`# ${R.title(d.question)}`, "", R.note(basename(path), d.date ?? ""), "", `## ${R.hypotheses}`, ""];
  for (const [k, h] of Object.entries(d.hypotheses)) out.push(`- **${k}** — ${h.label} (\`${h.assertion ?? ""}\`), ${R.prior} ${f2(d.prior[k])}`);
  out.push("", `## ${R.ach}`, "", `| ${R.argument} | ${R.kind} | ${h1} | ${h2} | LR ${h1}:${h2} | ${R.range} |`, "|---|---|---|---|---|---|");
  const score = { [h1]: 0, [h2]: 0 };
  for (const a of args_) {
    for (const h of [h1, h2]) score[h] += ACH_SCORE[a.ach[h]];
    out.push(`| ${a.text} | ${a.kind ?? ""}, ${a.evidence ?? ""} | ${a.ach[h1]} | ${a.ach[h2]} | ${a.lr ?? 1} | ${a.lr_low ?? a.lr ?? 1}–${a.lr_high ?? a.lr ?? 1} |`);
  }
  out.push(
    "",
    R.inconsistencies(h1, h2, score[h1], score[h2]),
    "",
    `## ${R.bayes}`,
    "",
    `- P(${h1}) = **${f2(p)}**, P(${h2}) = ${f2(1 - p)}`,
    `- ${R.sensitivity(h1, f2(pLow), f2(pHigh))}`,
    `- ${R.levelFor(h1, level(p))}; ${R.levelOf(h2, level(1 - p))}`,
    "",
    `## ${R.why}`,
    "",
  );
  for (const a of args_) out.push(`- **${a.id}**: ${String(a.why ?? "").split(/\s+/).filter(Boolean).join(" ")}`);
  out.push("");
  const dest = path.slice(0, path.length - extname(path).length) + ".report.md";
  writeFileSync(dest, out.join("\n"));
  console.log(`P(${h1})=${f2(p)} [${f2(pLow)}–${f2(pHigh)}]  ACH ${h1}=${score[h1]} ${h2}=${score[h2]}  -> ${dest}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
