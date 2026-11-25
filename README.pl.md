# predok-plugin

[Українська](README.md) · [English](README.en.md) · **Polski**

Otwarty plugin [predok.ai](https://predok.ai) dla agentów AI (Claude Code i
innych środowisk), który pomaga badać drzewo genealogiczne i odnajdywać
przodków żyjących na terenie dzisiejszej Ukrainy i regionów sąsiednich.

## Zawartość

| Komponent | Do czego służy |
|-----------|----------------|
| **Skill `predok`** | Metodyka badań genealogicznych. Skill nie przechowuje tekstu metodyki — za każdym razem czyta aktualną wersję z bazy wiedzy predok.ai ([angielska](https://predok.ai/en/w/), [ukraińska](https://predok.ai/uk/w/)). Agent odpowiada po polsku. |
| **Serwer MCP `predok`** | Serwer `https://api.predok.ai/mcp`, instalowany razem z pluginem, daje agentowi dostęp do bazy Predok: osoby, zdarzenia, miejscowości, nazwiska, źródła archiwalne z sygnaturami i skanami. Agent korzysta z niego w pierwszej kolejności. |

## Instalacja

### Claude Code

W sesji Claude Code:

```
/plugin marketplace add solvek/predok
/plugin install predok-plugin@predok
```

Drugie polecenie otwiera panel pluginu, w którym wybierasz, **dla kogo** go
zainstalować:

| Opcja | Gdzie działa | Gdzie jest zapisany |
|-------|--------------|---------------------|
| **Install for you** (user) | we wszystkich Twoich projektach na tym komputerze | `~/.claude/settings.json` |
| **Install for all collaborators on this repository** (project) | w tym repozytorium, dla wszystkich, którzy nad nim pracują | `.claude/settings.json` (commitowany do git) |
| **Install for you, in this repo only** (local) | tylko w tym folderze i tylko dla Ciebie | `.claude/settings.local.json` |

Aby plugin działał tylko w jednym folderze, uruchom w nim Claude Code i wybierz
**local** (lub **project**). To samo z terminala:

```bash
claude plugin marketplace add solvek/predok
claude plugin install predok-plugin@predok --scope local
```

Sam marketplace (`marketplace add`) to tylko katalog: niczego nie włącza,
dopóki nie zainstalujesz pluginu.

### Gemini CLI

```bash
gemini extensions install https://github.com/solvek/predok
```

### Codex

Repozytorium jest też pluginem Codex: skill i serwer MCP instalują się razem.

```bash
codex plugin marketplace add solvek/predok
```

Następnie otwórz katalog pluginów (**Plugins**) w Codex, wybierz marketplace
**Predok** i zainstaluj **predok-plugin**. Aby włączyć lub wyłączyć plugin
tylko dla jednego repozytorium, dodaj do jego `.codex/config.toml`:

```toml
[plugins."predok-plugin@predok"]
enabled = true
```

**Bez pluginu, ręcznie:**

1. Serwer MCP — poleceniami (zapisują do `~/.codex/config.toml`):

   ```bash
   codex mcp add predok --url https://api.predok.ai/mcp
   codex mcp login predok
   ```

   lub ręcznie w `~/.codex/config.toml`:

   ```toml
   [mcp_servers.predok]
   url = "https://api.predok.ai/mcp"
   ```

2. Skill — skopiuj folder `skills/predok` do `~/.agents/skills/`
   (wszystkie projekty) lub do `.agents/skills/` w katalogu głównym
   repozytorium.

### OpenCode

1. Serwer MCP — polecenie w folderze projektu (zapis do konfiguracji projektu)
   lub z `--global` (wszystkie projekty):

   ```bash
   opencode mcp add predok --global --url https://api.predok.ai/mcp
   ```

   lub ręcznie w `~/.config/opencode/opencode.json` (globalnie) albo
   `opencode.json` w katalogu głównym projektu:

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

   W starszych wersjach OpenCode serwer wpisuje się bezpośrednio w `mcp`, bez
   `servers`.

2. Skill — skopiuj folder `skills/predok` do `~/.config/opencode/skills/`
   (wszystkie projekty) lub do `.opencode/skills/` w katalogu głównym projektu.

### Cursor

1. Serwer MCP — plik `~/.cursor/mcp.json` (wszystkie projekty) lub
   `.cursor/mcp.json` w katalogu głównym projektu (tylko ten projekt):

   ```json
   {
     "mcpServers": {
       "predok": { "url": "https://api.predok.ai/mcp" }
     }
   }
   ```

2. Skill — dodaj treść `skills/predok/SKILL.md` jako regułę w
   `.cursor/rules/` projektu.

### Claude (aplikacja i claude.ai)

Dodaj Predok jako konektor: **Settings → Connectors → Add custom connector**,
URL `https://api.predok.ai/mcp`. Instrukcja krok po kroku (po angielsku):
[predok.ai/en/help/connector](https://predok.ai/en/help/connector).

### Inne środowiska

1. Dodaj serwer MCP `https://api.predok.ai/mcp` (transport Streamable HTTP) do
   pliku ustawień MCP swojego środowiska. Zwykle jest to JSON w takiej postaci —
   nazwę pliku i dokładny format sprawdź w dokumentacji środowiska:

   ```json
   {
     "mcpServers": {
       "predok": { "type": "http", "url": "https://api.predok.ai/mcp" }
     }
   }
   ```

2. Dodaj [`skills/predok/SKILL.md`](skills/predok/SKILL.md) jako
   skill, regułę lub instrukcję systemową, jeśli środowisko to obsługuje.

## Logowanie do Predok

Serwer MCP korzysta z OAuth: logujesz się kontem Google. Odczyt jest liczony w
kredytach, z darmowym limitem ([cennik](https://predok.ai/en/pricing)).

- **Claude Code:** `/mcp` → `plugin:predok-plugin:predok` (lub `predok`, jeśli
  serwer dodano bezpośrednio) → **Authenticate**, zaloguj się w przeglądarce i
  wróć do terminala.
- **Gemini CLI:** `/mcp auth predok`.
- **Codex:** `codex mcp login predok`.
- **OpenCode:** `/mcps` → `predok` lub `opencode mcp auth predok`.
- **Inne środowiska:** [instrukcja podłączenia](https://predok.ai/en/help/agents) (po angielsku).

Jeśli zapomnisz, skill sam podpowie, co zrobić, gdy serwer poprosi o logowanie.

## Użycie

Opisz agentowi, co wiesz o swoich przodkach i czego szukasz, na przykład:

> Mój pradziadek Iwan Kowal urodził się około 1890 roku we wsi na Wołyniu.
> Od czego zacząć?

Agent przeczyta odpowiednie rozdziały metodyki, przygotuje plan poszukiwań i
zaproponuje źródła, archiwa oraz zasoby internetowe z odnośnikami do
predok.ai.

## Struktura repozytorium

```
.claude-plugin/
  plugin.json        manifest pluginu Claude Code
  marketplace.json   marketplace dla /plugin marketplace add
.mcp.json            konfiguracja serwera MCP predok.ai
gemini-extension.json  manifest rozszerzenia Gemini CLI
plugin.json, mcp.json  manifest pluginu Codex (Agent Plugins)
.agents/plugins/
  marketplace.json   marketplace dla codex plugin marketplace add
skills/predok/SKILL.md  skill (tylko instrukcja czytania metodyki ze strony)
docs/                dokumenty wewnętrzne
```

## Współpraca

Uwagi do samej metodyki zgłaszaj na [predok.ai](https://predok.ai). Uwagi do
pluginu — przez issues i pull requesty w tym repozytorium. Głównym językiem
projektu jest ukraiński.

## Licencja

[MIT](LICENSE)
