# predok-plugin

**Українська** · [English](README.en.md) · [Polski](README.pl.md)

Відкритий плагін [predok.ai](https://predok.ai) для ШІ-агентів (Claude Code та
інших харнесів), який допомагає досліджувати родовід і шукати предків, що жили
на території сучасної України.

## Що всередині

| Компонент | Що робить |
|-----------|-----------|
| **Скіл `predok-skill`** | Методичка дослідження родоводу. Скіл не зберігає текст методички, а щоразу читає актуальну версію з бази знань [predok.ai/uk/w](https://predok.ai/uk/w/) ([англійська версія](https://predok.ai/en/w/)). |
| **MCP-сервер `predok`** | Сервер `https://api.predok.ai/mcp`, який встановлюється разом із плагіном і дає агенту доступ до бази Предка: люди, події, місця, прізвища, архівні джерела з шифрами й сканами. Агент звертається до нього першим. |

## Встановлення

### Claude Code

```
/plugin marketplace add solvek/predok
/plugin install predok-plugin@predok
```

Після встановлення перезапусти Claude Code. Скіл і MCP-сервер підключаться
автоматично.

### Вхід до Предка

MCP-сервер використовує OAuth: вхід через обліковий запис Google. Читання
рахується в кредитах, є безкоштовний ліміт ([тарифи](https://predok.ai/uk/pricing)).

- **Claude Code:** `/mcp` → `predok` → **Authenticate**, увійти в браузері й
  повернутися в термінал.
- **Gemini CLI:** `/mcp auth predok`.
- **Інші середовища:** [інструкція з підключення](https://predok.ai/uk/help).

Якщо забудеш — скіл сам підкаже, що робити, коли сервер попросить вхід.

### Gemini CLI

```bash
gemini extensions install https://github.com/solvek/predok
```

### Інші харнеси (Cursor, Codex, Claude Desktop тощо)

1. Додай MCP-сервер за адресою `https://api.predok.ai/mcp` (транспорт
   Streamable HTTP), наприклад:

   ```json
   {
     "mcpServers": {
       "predok": { "type": "http", "url": "https://api.predok.ai/mcp" }
     }
   }
   ```

2. Підключи [`skills/predok-skill/SKILL.md`](skills/predok-skill/SKILL.md) як
   скіл, правило або системну інструкцію, якщо харнес таке підтримує.

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
skills/predok-skill/SKILL.md  скіл (лише інструкція, як читати методичку з сайту)
docs/                службові документи
```

## Внесок

Пропозиції щодо самої методички — на сайті [predok.ai](https://predok.ai).
Пропозиції щодо плагіна — через issues і pull requests у цьому репозиторії.
Основна мова проєкту — українська.

## Ліцензія

[MIT](LICENSE)
