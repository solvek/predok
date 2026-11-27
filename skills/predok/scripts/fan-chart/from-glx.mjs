#!/usr/bin/env node
// Chart data from a GLX archive (the format of the `glx` program, see the wiki page tools/glx).
// Needs the `yaml` package: run `npm install yaml` in the research folder (see SKILL.md).
//
//   node from-glx.mjs <tree_dir> --root <person-id> [--depth 10] [--hypotheses <dir>] [--lang uk|en] [--out data.json]
//
// Prints the JSON that render.mjs takes (to --out, or to stdout); it carries the root id, so render.mjs names the page
// after the root person (`confidence-<id without "person-">.html`) and reports for different persons do not collide. Conventions of the research folder:
//  - Every parent link is a `biological_parent_child` relationship with one or more assertions on its `type`
//    property. The level is the assertion's `confidence` (high 3, medium 2, low 1); the state is its `status`.
//    An assertion whose id contains "father" / "mother" applies to that parent only, any other to both;
//    the strongest wins.
//  - A relationship whose id ends with "-alt" is an alternative hypothesis. The main one is drawn; every child
//    with alternatives gets a fork, and each alternative replaces the sectors above that child.
//    An alternative that names only one parent keeps the other parent of the main hypothesis.
//  - Chain confidence is the weakest link on the way to the root (computed by the page). Ancestors common to the
//    shown and the other candidates skip the ambiguous link and take the weaker of the two paths.
//  - Birth and death dates come from `birth` / `death` events where the person is the `principal`.
//  - The fork is on the person whose identity is in doubt, not only on her parents: a candidate has her own parents
//    and may have her own birth date. An assertion whose id ends with "-alt" on the `date` property of a birth / death
//    event of that person gives her alternative date; it belongs to her first alternative (`own` of the fork) and
//    replaces her dates while that alternative is chosen. The person with a fork is marked `ambiguous` with `fk`:
//    the doubt about who she is does not pass on to ancestors common to all her candidates.
//  - Probabilities come from <hypotheses>/*.yaml (the format of weigh.mjs): prior odds times the likelihood
//    ratios, and the range with every ratio at its low / high bound. A hypothesis is tied to a fork option
//    through its assertion's relationship. Exactly two hypotheses per file.
//  - A fork inside an alternative branch is not expanded: that branch shows its main hypothesis.
import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { build } from "./i18n.mjs";

/** `yaml` from the script's own folder or, failing that, from the folder the command runs in. */
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

const LEVEL = { high: 3, medium: 2, low: 1 };

function trunc(s, n = 260) {
  const t = String(s ?? "").split(/\s+/).filter(Boolean).join(" ");
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  const sp = cut.lastIndexOf(" ");
  return (sp > 0 ? cut.slice(0, sp) : cut) + "…";
}

/** Rows and forks for the root of a GLX archive. `parse` is `yaml.parse`; `files` maps a directory name to its files' text. */
export function collect({ parse, tree, hypotheses = [], root, depth = 10, lang = "uk" }) {
  const S = build[lang];
  if (!S) throw new Error(`Unknown language "${lang}": ${Object.keys(build).join(", ")}`);
  const merged = (texts) => {
    const out = {};
    for (const text of texts) for (const section of Object.values(parse(text) ?? {})) Object.assign(out, section);
    return out;
  };
  const P = merged(tree.persons), R = merged(tree.relationships), A = merged(tree.assertions), E = merged(tree.events);
  if (!P[root]) throw new Error(`Person "${root}" is not in the archive`);

  const life = new Map();
  for (const e of Object.values(E)) {
    if ((e.type !== "birth" && e.type !== "death") || !e.date) continue;
    for (const x of e.participants ?? []) {
      if (x.role !== "principal") continue;
      const rec = life.get(x.person) ?? {};
      if (e.type === "birth") rec.b = String(e.date);
      else rec.d = String(e.date);
      life.set(x.person, rec);
    }
  }
  /** Alternative birth / death dates of a person (assertions "*-alt" on `date`), used while her first alternative is chosen. */
  const altLife = new Map();
  for (const [aid, a] of Object.entries(A)) {
    const ev = E[a.subject?.event];
    if (!aid.endsWith("-alt") || a.property !== "date" || !ev || (ev.type !== "birth" && ev.type !== "death")) continue;
    for (const x of ev.participants ?? []) {
      if (x.role !== "principal") continue;
      const rec = altLife.get(x.person) ?? {};
      rec[ev.type === "birth" ? "b" : "d"] = String(a.value);
      altLife.set(x.person, rec);
    }
  }
  const short = (p) => {
    const f = P[p].properties.name.fields;
    return String(f.given).replace(/\s*\(.*?\)/g, "") + " " + f.surname;
  };
  const person = (p, n) => ({ n, name: short(p), ...life.get(p) });

  const byRel = new Map();
  for (const [aid, a] of Object.entries(A)) {
    const rel = a.subject?.relationship;
    if (rel && a.property === "type") byRel.set(rel, [...(byRel.get(rel) ?? []), [aid, a]]);
  }

  const mainLinks = new Map(); // child -> parent links of the main hypothesis
  const altLinks = new Map(); // child -> one parent set per "-alt" relationship
  for (const [rid, r] of Object.entries(R)) {
    if (r.type !== "biological_parent_child") continue;
    const parents = r.participants.filter((x) => x.role === "parent").map((x) => x.person);
    const child = r.participants.find((x) => x.role === "child").person;
    const links = parents.map((parent) => {
      const sex = P[parent].properties.sex;
      let best;
      for (const [aid, a] of byRel.get(rid) ?? []) {
        if ((aid.includes("father") && sex !== "male") || (aid.includes("mother") && sex !== "female")) continue;
        const level = LEVEL[a.confidence] ?? 0;
        if (!best || level > best.level) best = { level, status: a.status ?? "", note: trunc(a.notes) };
      }
      return { parent, sex, rid, ...(best ?? { level: 0, status: "", note: S.noAssertion }) };
    });
    if (rid.endsWith("-alt")) altLinks.set(child, [...(altLinks.get(child) ?? []), links]);
    else mainLinks.set(child, [...(mainLinks.get(child) ?? []), ...links]);
  }

  const probByRel = new Map();
  for (const text of hypotheses) {
    const d = parse(text);
    const [h1, h2] = Object.keys(d.hypotheses ?? {});
    if (!h1 || !h2 || !d.prior) continue;
    const post = (pick) => {
      const odds = (d.arguments ?? []).reduce((o, a) => o * pick(a), d.prior[h1] / d.prior[h2]);
      return odds / (1 + odds);
    };
    const p = post((a) => a.lr ?? 1);
    const lo = post((a) => a.lr_low ?? a.lr ?? 1);
    const hi = post((a) => a.lr_high ?? a.lr ?? 1);
    const date = String(d.date ?? "");
    const rel = (h) => A[d.hypotheses[h].assertion]?.subject?.relationship;
    if (rel(h1)) probByRel.set(rel(h1), { p, lo, hi, date });
    if (rel(h2)) probByRel.set(rel(h2), { p: 1 - p, lo: 1 - hi, hi: 1 - lo, date });
  }
  const prob = (links) => links.map((l) => probByRel.get(l.rid)).find(Boolean) ?? null;

  /** All parent sets of a child: the main hypothesis first, then the alternatives. */
  const options = (child) => {
    const base = mainLinks.get(child) ?? [];
    const alts = (altLinks.get(child) ?? []).map((alt) => [...alt, ...base.filter((b) => !alt.some((a) => a.sex === b.sex))]);
    return [base, ...alts];
  };
  const pair = (links) =>
    [...links].sort((a, b) => Number(a.sex !== "male") - Number(b.sex !== "male")).map((l) => short(l.parent)).join(" + ");

  /** person -> weakest link level on the path from pid up to that ancestor (main hypotheses only). */
  const ancestors = (pid, acc = new Map(), lvl = 3) => {
    for (const link of mainLinks.get(pid) ?? []) {
      const v = Math.min(lvl, link.level);
      if (v > (acc.get(link.parent) ?? -1)) acc.set(link.parent, v);
      ancestors(link.parent, acc, v);
    }
    return acc;
  };

  const pending = [];
  /** Append the sectors above `child` (sector n) to `rows`; `pick` chooses the parent set of a fork child. */
  const walk = (child, n, shared, rows, pick) => {
    if (n >= 2 ** depth) return;
    const opts = options(child);
    const i = pick?.child === child ? pick.i : 0;
    const others = opts.filter((_, j) => j !== i);
    if (!pick && others.length) pending.push({ n, child, shared });
    for (const link of opts[i]) {
      const k = 2 * n + (link.sex === "male" ? 0 : 1);
      const row = { ...person(link.parent, k), l: link.level, s: link.status, t: link.note };
      let subShared = shared;
      if (options(link.parent).length > 1 && !row.s) {
        row.s = "ambiguous";
        row.fk = 1;
        row.t = S.doubtful + row.t;
      }
      if (others.length) {
        const label = others.map(pair).join("; ");
        row.alt = S.alt + label;
        const otherAnc = new Map();
        for (const o of others) for (const l of o) ancestors(l.parent, otherAnc);
        const ownAnc = ancestors(link.parent);
        const common = new Map();
        for (const [a, lv] of otherAnc) if (ownAnc.has(a)) common.set(a, Math.min(lv, ownAnc.get(a)));
        if (common.size) subShared = { at: k, common, label };
      }
      if (shared?.common.has(link.parent)) {
        row.skip = shared.at;
        row.l = shared.common.get(link.parent);
        row.s = "";
        row.t = S.shared(shared.label, link.note);
      }
      rows.push(row);
      walk(link.parent, k, subShared, rows, pick);
    }
  };

  const rows = [person(root, 1)];
  walk(root, 1, undefined, rows);
  const forks = pending.map(({ n, child, shared }) => {
    const opts = options(child);
    const alts = opts.slice(1).map((_, j) => {
      const altRows = [];
      walk(child, n, shared, altRows, { child, i: j + 1 });
      return altRows;
    });
    const own = opts.map((_, j) => (j === 1 ? (altLife.get(child) ?? {}) : {}));
    return { n, who: short(child), labels: opts.map(pair), probs: opts.map(prob), own, alts };
  });
  return { root, rows, forks };
}

const readDir = (dir, ext) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(ext)).sort().map((f) => readFileSync(join(dir, f), "utf8")) : []);

async function main() {
  const args = process.argv.slice(2);
  const opt = (name, fallback) => {
    const i = args.indexOf(`--${name}`);
    if (i < 0) return fallback;
    const [, v] = args.splice(i, 2);
    return v ?? fallback;
  };
  const root = opt("root");
  const depth = Number(opt("depth", "10"));
  const lang = opt("lang", "uk");
  const out = opt("out");
  const [treeArg] = args;
  if (!treeArg || !root) {
    console.error("Usage: node from-glx.mjs <tree_dir> --root <person-id> [--depth 10] [--hypotheses <dir>] [--lang uk|en] [--out data.json]");
    process.exit(2);
  }
  const tree = resolve(treeArg);
  const hypDir = resolve(opt("hypotheses", join(tree, "..", "hypotheses")));
  const { parse } = await loadYaml();
  const data = collect({
    parse,
    tree: Object.fromEntries(["persons", "relationships", "assertions", "events"].map((d) => [d, readDir(join(tree, d), ".glx")])),
    hypotheses: readDir(hypDir, ".yaml"),
    root,
    depth,
    lang,
  });
  const json = JSON.stringify(data);
  if (out) {
    writeFileSync(resolve(out), json);
    console.error(build[lang].summary(data.rows.length, data.forks.length, resolve(out)));
  } else {
    process.stdout.write(json);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
