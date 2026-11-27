// Texts of the fan chart page (`chart`), of the data builder (`build`) and of the weighing report (`report`).
// The page functions are serialised into the HTML with `serialise`, so they must be self-contained.
// Add a language by adding a key to each of the three tables; `uk` and `en` exist.

export const chart = {
  uk: {
    title: "Достовірність родоводу",
    aria: "Віялова діаграма достовірності гілок родоводу",
    ariaSq: "Квадратна діаграма достовірності гілок родоводу",
    viewGroup: "Вигляд діаграми",
    viewFan: "Віяло",
    viewSq: "Квадрат",
    colRoot: "Центр",
    modeChain: "Ланцюг до центру",
    modeLink: "Окремий зв'язок",
    gen: ["", "батьки", "діди", "прадіди", "прапрадіди", "3× прадіди"],
    levels: { 3: "підтверджено", 2: "ймовірно", 1: "припущення", 0: "немає твердження" },
    states: { disputed: "суперечність", ambiguous: "неоднозначність" },
    counters: "лічильники",
    about: "бл.",
    born: "нар.",
    died: "пом.",
    navHint: "Клік по людині робить її центром діаграми.",
    home: "Повернутись до основної особи",
    mainPerson: "Основна особа дослідження",
    centre: "Центр діаграми",
    linkToChild: "Зв'язок з дитиною",
    weakestLink: "Найслабша ланка",
    allConfirmed: "усі ланки підтверджено",
    probability: "Імовірність цієї версії",
    range: "діапазон",
    weighed: "зважування",
    switchedBy: "перемикає значок ⇄",
    clickCentre: "Клік — зробити центром діаграми",
    switchLabel: "Перемкнути кандидата",
    foot:
      "Вигляд перемикається: віяло або квадрат (покоління колонками зліва направо). " +
      "Клік по людині робить її центром діаграми; клік по центру — на покоління вниз; кнопка «⌂» повертає до основної особи. " +
      "Роки життя — з подій народження й смерті; «~» — приблизний рік, без років — даних немає. " +
      "Рівні: підтверджено (два незалежні документи), ймовірно, припущення. Оранжевий — суперечність записів; " +
      "жовтий — неоднозначність (кілька кандидатів); колір стану замінює колір рівня, рівень тоді видно в підказці. " +
      "Кандидатів перемикає значок ⇄ на розвилці або кнопки над діаграмою. " +
      "Відсотки — імовірність версії за зваженими аргументами; це суб'єктивна оцінка з широким діапазоном, не доказ.",
    fn: {
      forkOf: (who) => `Розвилка — яка саме «${who}»:`,
      sub: (date, name, gens, f, m) =>
        `Стан на ${date}. Центр — ${name}` +
        (gens
          ? `; назовні — ${gens}. Ліва половина — лінія батька${f ? " (" + f + ")" : ""}, права — лінія матері${m ? " (" + m + ")" : ""}.`
          : "; предків у дереві немає."),
      subSq: (date, name, gens, f, m) =>
        `Стан на ${date}. Центр — ${name}` +
        (gens
          ? `; праворуч — ${gens}. Верхня половина — лінія батька${f ? " (" + f + ")" : ""}, нижня — лінія матері${m ? " (" + m + ")" : ""}.`
          : "; предків у дереві немає."),
      switchTitle: (who) => `Перемкнути кандидата: яка саме «${who}» (з іншими батьками й датами)`,
      clickDown: (name) => `Клік — на покоління вниз (${name})`,
      weakest: (name) => `${name} → батьки`,
      chainTo: (name) => `Ланцюг до центру (${name})`,
    },
  },
  en: {
    title: "Confidence of the family tree",
    aria: "Fan chart of the confidence of the branches of the family tree",
    ariaSq: "Square chart of the confidence of the branches of the family tree",
    viewGroup: "Chart view",
    viewFan: "Fan",
    viewSq: "Square",
    colRoot: "Centre",
    modeChain: "Chain to the centre",
    modeLink: "Single link",
    gen: ["", "parents", "grandparents", "great-grandparents", "2× great-grandparents", "3× great-grandparents"],
    levels: { 3: "confirmed", 2: "probable", 1: "conjecture", 0: "no assertion" },
    states: { disputed: "conflict", ambiguous: "ambiguity" },
    counters: "counters",
    about: "abt",
    born: "b.",
    died: "d.",
    navHint: "Click a person to make them the centre of the chart.",
    home: "Back to the main person",
    mainPerson: "Main person of the research",
    centre: "Centre of the chart",
    linkToChild: "Link to the child",
    weakestLink: "Weakest link",
    allConfirmed: "every link is confirmed",
    probability: "Probability of this version",
    range: "range",
    weighed: "weighed",
    switchedBy: "switched by the ⇄ mark",
    clickCentre: "Click to make this person the centre",
    switchLabel: "Switch the candidate",
    foot:
      "Switch the view: a fan or a square (generations in columns from left to right). " +
      "Click a person to make them the centre; click the centre to go one generation down; the “⌂” button returns to the main person. " +
      "Life years come from birth and death events; “~” is an approximate year, no years means no data. " +
      "Levels: confirmed (two independent documents), probable, conjecture. Orange marks a conflict between records; " +
      "yellow an ambiguity (several candidates); the colour of a state replaces the colour of the level, which the tooltip then shows. " +
      "Switch the candidates with the ⇄ mark on the fork or with the buttons above the chart. " +
      "Percentages are the probability of a version from the weighed arguments; a subjective estimate with a wide range, not proof.",
    fn: {
      forkOf: (who) => `Fork — which “${who}”:`,
      sub: (date, name, gens, f, m) =>
        `As of ${date}. Centre — ${name}` +
        (gens
          ? `; outwards — ${gens}. The left half is the father's line${f ? " (" + f + ")" : ""}, the right half the mother's${m ? " (" + m + ")" : ""}.`
          : "; the tree has no ancestors for this person."),
      subSq: (date, name, gens, f, m) =>
        `As of ${date}. Centre — ${name}` +
        (gens
          ? `; to the right — ${gens}. The upper half is the father's line${f ? " (" + f + ")" : ""}, the lower half the mother's${m ? " (" + m + ")" : ""}.`
          : "; the tree has no ancestors for this person."),
      switchTitle: (who) => `Switch the candidate: which “${who}” (with other parents and dates)`,
      clickDown: (name) => `Click to go one generation down (${name})`,
      weakest: (name) => `${name} → parents`,
      chainTo: (name) => `Chain to the centre (${name})`,
    },
  },
};

export const build = {
  uk: {
    noAssertion: "Немає твердження",
    alt: "Альтернатива: ",
    doubtful: "Особа під сумнівом: є кілька кандидатів (розвилка на цій особі). ",
    shared: (label, note) =>
      `Спільний предок показаної й альтернативної гілки (${label}), тож неоднозначність його не стосується; рівень — слабший із двох шляхів. ${note}`,
    summary: (rows, forks, out) => `${rows} осіб, розвилок: ${forks} -> ${out}`,
  },
  en: {
    noAssertion: "No assertion",
    alt: "Alternative: ",
    doubtful: "The person is in doubt: there are several candidates (a fork on this person). ",
    shared: (label, note) =>
      `Common ancestor of the shown and the alternative branch (${label}), so the ambiguity does not apply to them; the level is the weaker of the two paths. ${note}`,
    summary: (rows, forks, out) => `${rows} persons, forks: ${forks} -> ${out}`,
  },
};

export const report = {
  uk: {
    title: (q) => `Зважування: ${q}`,
    note: (file, date) =>
      `Згенеровано \`weigh.mjs\` з \`${file}\` (${date}). Числа — суб'єктивні оцінки; цінність у явних аргументах і чутливості, а не в точності.`,
    hypotheses: "Гіпотези",
    prior: "апріорі",
    ach: "Таблиця ACH (C — узгоджується, N — нейтрально, I — суперечить)",
    argument: "Аргумент",
    kind: "Вид",
    range: "діапазон",
    inconsistencies: (a, b, s1, s2) => `Сума суперечностей (менше — краще): ${a} ${s1}, ${b} ${s2}.`,
    bayes: "Баєсівська оцінка",
    sensitivity: (h, lo, hi) => `Чутливість (усі аргументи на нижній / верхній межі): P(${h}) від ${lo} до ${hi}`,
    levelFor: (h, l) => `Рівень для ${h}: **${l}**`,
    levelOf: (h, l) => `для ${h}: ${l}`,
    levels: {
      high: "high (підтверджено) — лише якщо є два незалежні документи",
      medium: "medium (ймовірно)",
      low: "low (припущення)",
    },
    why: "Обґрунтування ваг",
  },
  en: {
    title: (q) => `Weighing: ${q}`,
    note: (file, date) =>
      `Generated by \`weigh.mjs\` from \`${file}\` (${date}). The numbers are subjective estimates; the value is in the explicit arguments and the sensitivity, not in precision.`,
    hypotheses: "Hypotheses",
    prior: "prior",
    ach: "ACH table (C — consistent, N — neutral, I — inconsistent)",
    argument: "Argument",
    kind: "Kind",
    range: "range",
    inconsistencies: (a, b, s1, s2) => `Sum of inconsistencies (less is better): ${a} ${s1}, ${b} ${s2}.`,
    bayes: "Bayesian estimate",
    sensitivity: (h, lo, hi) => `Sensitivity (all arguments at the low / high bound): P(${h}) from ${lo} to ${hi}`,
    levelFor: (h, l) => `Level for ${h}: **${l}**`,
    levelOf: (h, l) => `for ${h}: ${l}`,
    levels: {
      high: "high (confirmed) — only with two independent documents",
      medium: "medium (probable)",
      low: "low (conjecture)",
    },
    why: "Reasons for the weights",
  },
};

/** The chart texts of one language as JavaScript source: functions keep their code, so the page can call them. */
export function serialise(lang) {
  const { fn, ...plain } = chart[lang];
  const parts = Object.entries(plain).map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`);
  for (const [k, f] of Object.entries(fn)) parts.push(`${JSON.stringify(k)}:${f.toString()}`);
  return `{${parts.join(",")}}`;
}
