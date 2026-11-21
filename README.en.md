# predok-plugin

[Українська](README.md) · **English** · [Polski](README.pl.md)

An open [predok.ai](https://predok.ai) plugin for AI agents (Claude Code and
other harnesses) that helps you research your family tree and find ancestors
who lived in what is now Ukraine.

## What's inside

| Component | What it does |
|-----------|--------------|
| **Skill `predok-skill`** | Genealogy research methodology. The skill does not store the methodology text; it always reads the current version from the predok.ai knowledge base ([English](https://predok.ai/en/w/), [Ukrainian](https://predok.ai/uk/w/)). |
| **MCP server `predok`** | The `https://api.predok.ai/mcp` server, installed together with the plugin, gives the agent predok.ai tools. |

## Installation

### Claude Code

```
/plugin marketplace add solvek/predok
/plugin install predok-plugin@predok
```

Restart Claude Code after installing. The skill and the MCP server are enabled
automatically. If the server asks for authorization, run `/mcp` and select
`predok`.

### Gemini CLI

```bash
gemini extensions install https://github.com/solvek/predok
```

### Other harnesses (Cursor, Codex, Claude Desktop, etc.)

1. Add the MCP server at `https://api.predok.ai/mcp` (Streamable HTTP
   transport), for example:

   ```json
   {
     "mcpServers": {
       "predok": { "type": "http", "url": "https://api.predok.ai/mcp" }
     }
   }
   ```

2. Add [`skills/predok-skill/SKILL.md`](skills/predok-skill/SKILL.md) as a
   skill, rule or system instruction if your harness supports it.

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
skills/predok-skill/SKILL.md  the skill (only instructions for reading the methodology from the site)
docs/                internal documents
```

## Contributing

Suggestions about the methodology itself go to [predok.ai](https://predok.ai).
Suggestions about the plugin go to issues and pull requests in this repository.
The project's primary language is Ukrainian.

## License

[MIT](LICENSE)
