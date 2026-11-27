---
name: predok
description: Genealogy research with Predok (Предок, predok.ai) — a database of genealogical records of Ukraine and a manual on tracing ancestors who lived in modern Ukraine and neighbouring regions (metric books, revision lists, confession lists, archives, online resources, regions, DNA). Use when the user wants to build a family tree, find ancestors or relatives, find or read an archival document, plan an archive request, understand Ukrainian genealogical sources, or connect the Predok MCP server — in any language.
---

# predok — genealogy research with Predok

This skill does not contain the research manual. The manual lives on predok.ai
and is updated continuously: fetch it each time instead of answering from
memory. Where the site and this file disagree, follow the site.

## Workflow

1. When research starts, fetch `https://predok.ai/w/index.md`: the order of
   steps, the rules for agents and the tree of every page with a note on when
   to read it. Follow those rules.
2. Search the Predok database through the `predok` MCP server first, before
   your own knowledge and web search. If the server is missing or asks for
   sign-in, see "MCP server" below.
3. Read only the pages the current step needs, at the `.md` addresses from the
   tree, and fetch them again at each new step. Never guess an address.

The Markdown is English only, at the same address whatever the conversation
language; it is a translation of the Ukrainian original. When pointing the user
to a page, give the HTML address from the `url` field of its front matter, not
the `.md`; the Ukrainian page is the same address with `/uk/` instead of `/en/`.
Check the Ukrainian page when a passage is unclear.

If pages cannot be fetched:
- the `guide` tool of the `predok` MCP server searches and reads the same manual;
- `https://predok.ai/llms.txt` lists every page;
- `https://predok.ai/llms-full.txt` is the whole manual in one file — only when
  you need all of it.

## Rules

- Give every Predok find with its public id (`I…` person, `E…` event,
  `S…` source, `P…` place) and card link.
- Back every statement with a source: archive, fond, inventory, file, folio, or
  a link. Mark everything not taken from Predok as such.
- Never invent records, call numbers or facts. Keep what a source says apart
  from your conclusions, and say what each conclusion rests on.
- Mark the confidence of each conclusion:
  - **confirmed** — two independent primary sources (metric book, revision
    list, confession list…) agree and nothing contradicts them;
  - **probable** — one primary source, or several secondary ones that agree;
  - **conjecture** — a single secondary record, family lore, someone else's
    tree, or an inference.

  Trees or sites that copied one another are one source, not several.
- Whatever the level, mark these three states apart:
  - **conflict** — the records say different things (another name of the
    mother, another age);
  - **ambiguity** — the records do not contradict, but two or more candidates
    fit them (two namesakes of one age in one village). The common ancestors
    of candidates who are relatives are not ambiguous: they are ancestors
    under either version;
  - **disproven** — a version tested and rejected; keep it with the reason.
- One name is spelled differently across records (Theodorus, Teodor and Fedir;
  Xenia and Oksana): reduce the forms to one name before calling it a conflict.
  If an indexed name still disagrees with the family's other records, check
  the scan.
- A person in Predok is one mention in one source. Several records may be the
  same human: judge by names, dates, places and kin. Finding nothing in Predok
  does not prove that no document exists — go on to the online resources and
  archives the manual names.
- Before reporting "not found", search every kind of record about the person
  (marriage, death, confession list, gravestone), not only the birth.
- Report empty searches too: what you looked for and where (Predok query,
  resource, parish, years).
- Answer in the user's language. Keep the names of places, archives and fonds
  in the original.
- Do not send names, dates or places of living people to third-party services
  without the user's consent. Do not propose living people to Predok unless
  they appear in published sources.

## Local research folder

When you can write files in the user's folder and research starts there, check
for agent instructions (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`). If there are
none, offer once to create `AGENTS.md` from the template `assets/AGENTS.md`
next to this file (if it is missing, fetch
`https://raw.githubusercontent.com/solvek/predok/main/skills/predok/assets/AGENTS.md`).
It holds the research scope, working rules and how to report Predok errors.

- The template is Ukrainian. If the user writes in another language, translate
  the whole file; keep the folder and file names as they are.
- Fill in "Про дослідження" from what the user has already told you; leave the
  rest for later.
- If your harness reads another file name, make that file a one-line pointer
  to `AGENTS.md`.
- Never overwrite existing instructions; offer to add the missing sections
  instead. If the user declines, do not ask again.

## MCP server

`https://api.predok.ai/mcp` (Streamable HTTP), OAuth sign-in with a Google
account. Reading is counted in credits, with a free allowance.

Only the user can sign in, in a browser. Never ask for a password, token or
code. Setup steps for every client are in `https://predok.ai/help/agents.md`
(agent environments) and `https://predok.ai/help/connector.md` (Claude.ai,
ChatGPT); for the user, link `https://predok.ai/<lang>/help/agents` (`uk` or
`en`; `en` for other languages).

| What you see | What to tell the user |
|--------------|-----------------------|
| No `predok` tools at all | The plugin is not installed or not enabled. Claude Code: `/plugin marketplace add solvek/predok`, `/plugin install predok-plugin@predok`, then `/reload-plugins` or restart. |
| Sign-in required ("needs authentication", 401, "unauthorized"), also after an earlier sign-in: the session may have expired | Claude Code: `/mcp` → `plugin:predok-plugin:predok` (`predok` if the server was added directly) → **Authenticate**, sign in in the browser, return to the terminal. Gemini CLI: `/mcp auth predok`. Codex: `codex mcp login predok`. OpenCode: `/mcps` → `predok` or `opencode mcp auth predok`. |
| Out of credits | Do not retry. Explain and link the pricing: `https://predok.ai/en/pricing` (`/uk/pricing`). |
| Server unreachable (network, 5xx) | Say so and continue by the manual, noting that Predok was not checked. |

Once the user confirms sign-in, repeat the pending request. After a fresh
install with nothing pending, make no trial searches: ask, in the user's
language, "Where shall we start the research? Tell me what you know about your
ancestors."
