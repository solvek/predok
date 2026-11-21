# predok-plugin

[Українська](README.md) · **English** · [Polski](README.pl.md)

An open [predok.ai](https://predok.ai) plugin for AI agents (Claude Code and
other harnesses) that helps you research your family tree and find ancestors
who lived in what is now Ukraine and neighbouring regions.

## What's inside

| Component | What it does |
|-----------|--------------|
| **Skill `predok`** | Genealogy research methodology. The skill does not store the methodology text; it always reads the current version from the predok.ai knowledge base ([English](https://predok.ai/en/w/), [Ukrainian](https://predok.ai/uk/w/)). |
| **MCP server `predok`** | The `https://api.predok.ai/mcp` server, installed together with the plugin, gives the agent access to the Predok database: people, events, places, surnames, archival sources with call numbers and scans. The agent queries it first. |

## Installation

### Claude Code

In a Claude Code session:

```
/plugin marketplace add solvek/predok
/plugin install predok-plugin@predok
```

The second command opens the plugin panel, where you choose **who** gets it:

| Option | Where it applies | Where it is recorded |
|--------|------------------|----------------------|
| **Install for you** (user) | all your projects on this machine | `~/.claude/settings.json` |
| **Install for all collaborators on this repository** (project) | this repository, for everyone who works on it | `.claude/settings.json` (committed to git) |
| **Install for you, in this repo only** (local) | only this folder, only for you | `.claude/settings.local.json` |

To use the plugin in one folder only, start Claude Code in that folder and
choose **local** (or **project**). The same from a terminal:

```bash
claude plugin marketplace add solvek/predok
claude plugin install predok-plugin@predok --scope local
```

The marketplace itself (`marketplace add`) is only a catalog: it enables
nothing until you install the plugin.

### Gemini CLI

```bash
gemini extensions install https://github.com/solvek/predok
```

### Codex

The repository is also a Codex plugin: the skill and the MCP server install
together.

```bash
codex plugin marketplace add solvek/predok
```

Then open the plugin directory (**Plugins**) in Codex, choose the **Predok**
marketplace and install **predok-plugin**. To enable or disable the plugin for
a single repository, add to its `.codex/config.toml`:

```toml
[plugins."predok-plugin@predok"]
enabled = true
```

**Without the plugin, by hand:**

1. MCP server — with commands (they write to `~/.codex/config.toml`):

   ```bash
   codex mcp add predok --url https://api.predok.ai/mcp
   codex mcp login predok
   ```

   or by hand in `~/.codex/config.toml`:

   ```toml
   [mcp_servers.predok]
   url = "https://api.predok.ai/mcp"
   ```

2. Skill — copy the `skills/predok` folder to `~/.agents/skills/` (all
   projects) or to `.agents/skills/` at the root of a repository.

### OpenCode

1. MCP server — run the command in the project folder (writes to the project
   config) or with `--global` (all projects):

   ```bash
   opencode mcp add predok --global --url https://api.predok.ai/mcp
   ```

   or by hand in `~/.config/opencode/opencode.json` (global) or
   `opencode.json` at the project root:

   ```json
   {
     "$schema": "https://opencode.ai/config.json",
     "mcp": {
       "servers": {
         "predok": { "type": "remote", "url": "https://api.predok.ai/mcp" }
       }
     }
   }
   ```

   In older OpenCode versions the server goes directly under `mcp`, without
   `servers`.

2. Skill — copy the `skills/predok` folder to `~/.config/opencode/skills/` (all
   projects) or to `.opencode/skills/` at the project root.

### Cursor

1. MCP server — the file `~/.cursor/mcp.json` (all projects) or
   `.cursor/mcp.json` at the project root (that project only):

   ```json
   {
     "mcpServers": {
       "predok": { "url": "https://api.predok.ai/mcp" }
     }
   }
   ```

2. Skill — add the contents of `skills/predok/SKILL.md` as a rule in the
   project's `.cursor/rules/`.

### Claude (app and claude.ai)

Add Predok as a connector: **Settings → Connectors → Add custom connector**,
URL `https://api.predok.ai/mcp`. Step-by-step guide:
[predok.ai/en/help/connector](https://predok.ai/en/help/connector).

### Other harnesses

1. Add the MCP server `https://api.predok.ai/mcp` (Streamable HTTP transport)
   to your harness's MCP settings file. It is usually JSON like this — check
   your harness's docs for the file name and exact format:

   ```json
   {
     "mcpServers": {
       "predok": { "type": "http", "url": "https://api.predok.ai/mcp" }
     }
   }
   ```

2. Add [`skills/predok/SKILL.md`](skills/predok/SKILL.md) as a
   skill, rule or system instruction if your harness supports it.

## Signing in to Predok

The MCP server uses OAuth: you sign in with a Google account. Reading is
counted in credits, with a free allowance ([pricing](https://predok.ai/en/pricing)).

- **Claude Code:** `/mcp` → `predok` → **Authenticate**, sign in in the browser
  and return to the terminal.
- **Gemini CLI:** `/mcp auth predok`.
- **Codex:** `codex mcp login predok`.
- **OpenCode:** `/mcps` → `predok` or `opencode mcp auth predok`.
- **Other harnesses:** [connection guide](https://predok.ai/en/help/agents).

If you forget, the skill tells you what to do when the server asks you to sign in.

## Usage

Tell the agent what you know about your ancestors and what you want to find,
for example:

> My great-grandfather Ivan Koval was born around 1890 in a village in Volhynia.
> Where do I start?

The agent reads the relevant sections of the methodology, drafts a research
plan, and suggests sources, archives and online resources with links to
predok.ai.

## Repository layout

```
.claude-plugin/
  plugin.json        Claude Code plugin manifest
  marketplace.json   marketplace for /plugin marketplace add
.mcp.json            predok.ai MCP server configuration
gemini-extension.json  Gemini CLI extension manifest
plugin.json, mcp.json  Codex plugin manifest (Agent Plugins)
.agents/plugins/
  marketplace.json   marketplace for codex plugin marketplace add
skills/predok/SKILL.md  the skill (only instructions for reading the methodology from the site)
docs/                internal documents
```

## Contributing

Suggestions about the methodology itself go to [predok.ai](https://predok.ai).
Suggestions about the plugin go to issues and pull requests in this repository.
The project's primary language is Ukrainian.

## License

[MIT](LICENSE)
