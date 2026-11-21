# Зміни на сайті predok.ai для скіла predok-skill

Текст-завдання для агента, який працює з кодом сайту predok.ai.

---

Скіл `predok-skill` у відкритому плагіні `predok-plugin`
(https://github.com/solvek/predok) не містить тексту методички: агенти читають
її прямо з сайту. Щоб це було зручно й надійно, зроби на сайті таке.

## 1. Markdown-версія кожної сторінки бази знань

Для кожної сторінки `/{lang}/w/...` (lang = `uk`, `en`) віддавай чистий
Markdown за тією ж адресою з суфіксом `.md`:

| HTML | Markdown |
|------|----------|
| `/uk/w/` | `/uk/w/index.md` |
| `/uk/w/sources` | `/uk/w/sources.md` |
| `/uk/w/sources/metric-books` | `/uk/w/sources/metric-books.md` |
| `/en/w/regions/volyn` | `/en/w/regions/volyn.md` |

Вимоги:
- `Content-Type: text/markdown; charset=utf-8`, код 200; для неіснуючих — 404
  (не HTML-сторінка з кодом 200).
- Без навігації, футера, скриптів, аналітики — лише вміст статті.
- На початку — YAML front matter:
  ```yaml
  ---
  title: Метричні книги
  description: Короткий опис сторінки (1–2 речення)
  lang: uk
  url: https://predok.ai/uk/w/sources/metric-books
  updated: 2026-11-10
  alternates:
    en: https://predok.ai/en/w/sources/metric-books.md
  ---
  ```
- Внутрішні посилання на інші сторінки бази знань — абсолютні й одразу на
  `.md`-версії (`https://predok.ai/uk/w/archives.md`), щоб агент міг іти за
  ними без перетворень. Посилання на зовнішні ресурси — як є.
- Таблиці — у GFM-форматі; зображення — з абсолютними URL і змістовним alt.
- Markdown генерується з того самого джерела, що й HTML (одне джерело правди).

## 2. Зміст `/{lang}/w/index.md` — точка входу для агентів

Це перша сторінка, яку читає скіл. Вона має містити:
- Front matter (як вище) і 2–3 речення: про що методичка, для кого.
- Повне дерево розділів і підрозділів (включно з `regions/*`, `areas/*`,
  `sources/*`) у вигляді вкладеного списку:
  ```markdown
  - [Принципи](https://predok.ai/uk/w/principles.md) — з чого почати й як вести дослідження
  - [Джерела](https://predok.ai/uk/w/sources.md) — типи документів
    - [Метричні книги](https://predok.ai/uk/w/sources/metric-books.md) — …
  ```
  Кожен пункт — посилання на `.md` і однорядковий опис, з якого агенту
  зрозуміло, коли цей розділ читати.
- Рекомендований порядок читання для нового дослідження (якщо є).
- Короткий блок «Для ШІ-агентів»: читати потрібні розділи на вимогу, посилатися
  на сторінки predok.ai, відокремлювати факти від припущень, згадка про
  MCP-сервер `https://api.predok.ai/mcp`.

## 3. `/llms.txt` (запасна точка входу)

Файл за стандартом llmstxt.org у корені сайту: назва, опис predok.ai, посилання
на `https://predok.ai/uk/w/index.md` і `https://predok.ai/en/w/index.md`,
посилання на MCP-сервер і на репозиторій плагіна. За бажанням —
`/llms-full.txt` з усією методичкою однією сторінкою для кожної мови (або
`/{lang}/w/full.md`).

## 4. Підказки в HTML

У `<head>` кожної сторінки бази знань додай:
```html
<link rel="alternate" type="text/markdown" href="https://predok.ai/uk/w/sources/metric-books.md">
```

## 5. Доступність для агентів

- `robots.txt` має дозволяти `.md`, `llms.txt` (зараз `Allow: /` — ок).
- Не блокуй запити від ШІ-агентів/ботів (Cloudflare bot protection, JS-челенджі)
  для `/{lang}/w/*`, `*.md` і `/llms.txt`.
- Додай `.md`-сторінки й `llms.txt` у CI-перевірку: кожна HTML-сторінка бази
  знань має `.md`-пару, усі посилання в `index.md` повертають 200.
- Адреси розділів (slug-и) не змінювати без редиректу 301 — на них посилаються
  агенти й відповіді користувачам.
- Кешування: `Cache-Control: public, max-age=3600` (або менше) — щоб оновлення
  методички швидко доходили до агентів.

## 6. (Бажано) Сторінка про плагін

Сторінка `/uk/w/predok` (або окрема) з інструкцією встановлення плагіна:
```
/plugin marketplace add solvek/predok
/plugin install predok-plugin@predok
```
і посиланням на репозиторій https://github.com/solvek/predok.

## Критерії готовності

- `curl -sI https://predok.ai/uk/w/index.md` → 200, `text/markdown`.
- `curl -sI https://predok.ai/en/w/index.md` → 200.
- Усі посилання в обох `index.md` → 200 і ведуть на `.md`.
- `curl -sI https://predok.ai/llms.txt` → 200.
- `curl -sI https://predok.ai/uk/w/nonexistent.md` → 404.
