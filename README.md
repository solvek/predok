# predok-plugin

**Українська** · [English](README.en.md) · [Polski](README.pl.md)

Відкритий плагін [predok.ai](https://predok.ai) для ШІ-агентів (Claude Code та
інших харнесів), який допомагає досліджувати родовід і шукати предків, що жили
на території сучасної України та суміжних регіонів.

## Що всередині

| Компонент | Що робить |
|-----------|-----------|
| **Скіл `predok`** | Методичка дослідження родоводу. Скіл не зберігає текст методички, а щоразу читає актуальну версію з бази знань [predok.ai/uk/w](https://predok.ai/uk/w/). |
| **MCP-сервер `predok`** | Сервер `https://api.predok.ai/mcp`, який встановлюється разом із плагіном і дає агенту доступ до бази Предка: люди, події, місця, прізвища, архівні джерела з шифрами й сканами. Агент звертається до нього першим. |

## Встановлення

### Claude Code

У сесії Claude Code:

```
/plugin marketplace add solvek/predok
/plugin install predok-plugin@predok
```

Друга команда відкриває панель плагіна, де треба обрати, **для кого** його
встановити:

| Варіант | Де діє | Куди записується |
|---------|--------|------------------|
| **Install for you** (user) | у всіх твоїх проєктах на цьому комп'ютері | `~/.claude/settings.json` |
| **Install for all collaborators on this repository** (project) | у цьому репозиторії для всіх, хто з ним працює | `.claude/settings.json` (комітиться в git) |
| **Install for you, in this repo only** (local) | лише в цій теці і лише для тебе | `.claude/settings.local.json` |

Щоб плагін працював тільки в одній теці, запусти Claude Code у ній і обери
**local** (або **project**). Те саме з терміналу:

```bash
claude plugin marketplace add solvek/predok
claude plugin install predok-plugin@predok --scope local
```

Сам маркетплейс (`marketplace add`) — це лише каталог: він нічого не вмикає,
доки плагін не встановлено.

### Gemini CLI

```bash
gemini extensions install https://github.com/solvek/predok
```

### Codex

Репозиторій — це також плагін Codex: скіл і MCP-сервер ставляться разом.

```bash
codex plugin marketplace add solvek/predok
```

Потім відкрий каталог плагінів (**Plugins**) у Codex, обери маркетплейс
**Predok** і встанови **predok-plugin**. Щоб увімкнути чи вимкнути плагін лише
для одного репозиторію, додай у його `.codex/config.toml`:

```toml
[plugins."predok-plugin@predok"]
enabled = true
```

**Без плагіна, вручну:**

1. MCP-сервер — команди (записують у `~/.codex/config.toml`):

   ```bash
   codex mcp add predok --url https://api.predok.ai/mcp
   codex mcp login predok
   ```

   або вручну в `~/.codex/config.toml`:

   ```toml
   [mcp_servers.predok]
   url = "https://api.predok.ai/mcp"
   ```

2. Скіл — скопіюй теку `skills/predok` у `~/.agents/skills/` (для всіх
   проєктів) або в `.agents/skills/` у корені потрібного репозиторію.

### OpenCode

1. MCP-сервер — команда в теці проєкту (запис у конфіг проєкту) або з
   `--global` (для всіх проєктів):

   ```bash
   opencode mcp add predok --global --url https://api.predok.ai/mcp
   ```

   або вручну в `~/.config/opencode/opencode.json` (глобально) чи
   `opencode.json` у корені проєкту:

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

   У старших версіях OpenCode сервер пишеться прямо в `mcp`, без `servers`.

2. Скіл — скопіюй теку `skills/predok` у `~/.config/opencode/skills/` (для всіх
   проєктів) або в `.opencode/skills/` у корені проєкту.

### Cursor

1. MCP-сервер — файл `~/.cursor/mcp.json` (для всіх проєктів) або
   `.cursor/mcp.json` у корені проєкту (лише для нього):

   ```json
   {
     "mcpServers": {
       "predok": { "url": "https://api.predok.ai/mcp" }
     }
   }
   ```

2. Скіл — додай вміст `skills/predok/SKILL.md` як правило в
   `.cursor/rules/` проєкту.

### Claude (застосунок і claude.ai)

Додай Предок як конектор: **Settings → Connectors → Add custom connector**,
URL `https://api.predok.ai/mcp`. Покрокова інструкція —
[predok.ai/uk/help/connector](https://predok.ai/uk/help/connector).

### Інші харнеси

1. Додай MCP-сервер `https://api.predok.ai/mcp` (транспорт Streamable HTTP) у
   файл налаштувань MCP твого харнесу. Здебільшого це JSON такого вигляду —
   назву файлу й точний формат дивись у документації харнесу:

   ```json
   {
     "mcpServers": {
       "predok": { "type": "http", "url": "https://api.predok.ai/mcp" }
     }
   }
   ```

2. Підключи [`skills/predok/SKILL.md`](skills/predok/SKILL.md) як
   скіл, правило або системну інструкцію, якщо харнес таке підтримує.

## Вхід до Предка

MCP-сервер використовує OAuth: вхід через обліковий запис Google. Читання
рахується в кредитах, є безкоштовний ліміт ([тарифи](https://predok.ai/uk/pricing)).

- **Claude Code:** `/mcp` → `plugin:predok-plugin:predok` (або `predok`, якщо
  сервер додано напряму) → **Authenticate**, увійти в браузері й повернутися в
  термінал.
- **Gemini CLI:** `/mcp auth predok`.
- **Codex:** `codex mcp login predok`.
- **OpenCode:** `/mcps` → `predok` або `opencode mcp auth predok`.
- **Інші середовища:** [інструкція з підключення](https://predok.ai/uk/help/agents).

Якщо забудеш — скіл сам підкаже, що робити, коли сервер попросить вхід.

Після входу просто опиши агенту, що знаєш про своїх предків: перший справжній запит і є перевіркою підключення. (Агент, який встановлює плагін за [інструкцією](https://predok.ai/help/agents.md), сам нагадає про вхід, не робитиме пробних запитів до бази й спитає, з чого почати дослідження.)

## Використання

Просто опиши агенту, що ти знаєш про своїх предків, і чого хочеш досягти,
наприклад:

> Мій прадід Іван Коваль народився близько 1890 року в селі на Волині. З чого
> почати пошук?

Агент прочитає потрібні розділи методички, складе план пошуку й порадить
джерела, архіви та онлайн-ресурси з посиланнями на predok.ai.

## Структура репозиторію

```
.claude-plugin/
  plugin.json        маніфест плагіна Claude Code
  marketplace.json   маркетплейс для /plugin marketplace add
.mcp.json            підключення MCP-сервера predok.ai
gemini-extension.json  маніфест розширення Gemini CLI
plugin.json, mcp.json  маніфест плагіна Codex (Agent Plugins)
.agents/plugins/
  marketplace.json   маркетплейс для codex plugin marketplace add
skills/predok/SKILL.md  скіл (лише інструкція, як читати методичку з сайту)
docs/                службові документи
scripts/build-skill-zip.sh  збирає dist/predok-skill.zip зі скілом для Claude.ai
```

## Внесок

Пропозиції щодо самої методички — на сайті [predok.ai](https://predok.ai).
Пропозиції щодо плагіна — через issues і pull requests у цьому репозиторії.
Основна мова проєкту — українська.

## Ліцензія

[MIT](LICENSE)
