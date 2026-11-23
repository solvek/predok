# Зміни на сайті predok.ai для скіла predok

Текст-завдання для агента, який працює з кодом сайту predok.ai.

---

Скіл `predok` у відкритому плагіні `predok-plugin`
(https://github.com/solvek/predok) не містить тексту методички: агенти читають
її прямо з сайту. Щоб це було зручно й надійно, зроби на сайті таке.

## 1. Markdown-версія кожної сторінки бази знань

Для кожної сторінки `/{lang}/w/...`, що має англійський переклад, віддавай
чистий англійський Markdown за адресою **без мови** з суфіксом `.md`:

| HTML | Markdown |
|------|----------|
| `/en/w/` | `/w/index.md` |
| `/en/w/sources` | `/w/sources.md` |
| `/en/w/sources/metric-books` | `/w/sources/metric-books.md` |
| `/uk/w/regions/volyn` | `/w/regions/volyn.md` (англійський переклад) |

Старі адреси з мовою (`/uk/w/sources.md`, `/en/w/sources.md`) ведуть 301 на нові.
Українського Markdown немає: людина читає HTML, агент — англійський переклад.

Вимоги:
- `Content-Type: text/markdown; charset=utf-8`, код 200; для неіснуючих — 404
  (не HTML-сторінка з кодом 200).
- Без навігації, футера, скриптів, аналітики. Те, що тільки для людей (знімки
  екрана, текст про кнопки), у Markdown не потрапляє; те, що тільки для агентів
  (правила, підказки), потрапляє, а в HTML — ні.
- На початку — YAML front matter:
  ```yaml
  ---
  title: Metric books
  description: Short description of the page (1–2 sentences)
  lang: en
  url: https://predok.ai/en/w/sources/metric-books
  updated: 2026-11-10
  ---
  ```
  `url` — англійська HTML-сторінка, її дають людині. Поля `alternates` немає.
- Внутрішні посилання на інші сторінки бази знань — абсолютні й одразу на
  `.md`-версії (`https://predok.ai/w/archives.md`), щоб агент міг іти за ними
  без перетворень. Посилання на зовнішні ресурси — як є.
- Таблиці — у GFM-форматі; зображення — з абсолютними URL і змістовним alt.
- Markdown генерується з того самого джерела, що й HTML (одне джерело правди).

## 2. Зміст `/w/index.md` — точка входу для агентів

Це перша сторінка, яку читає скіл. Вона має містити:
- Front matter (як вище) і 2–3 речення: про що методичка, для кого.
- Повне дерево розділів і підрозділів (включно з `regions/*`, `areas/*`,
  `sources/*`) у вигляді вкладеного списку:
  ```markdown
  - [Principles](https://predok.ai/w/principles.md) — where to start and how to run research
  - [Sources](https://predok.ai/w/sources.md) — kinds of documents
    - [Metric books](https://predok.ai/w/sources/metric-books.md) — …
  ```
  Кожен пункт — посилання на `.md` і однорядковий опис, з якого агенту
  зрозуміло, коли цей розділ читати.
- Рекомендований порядок читання для нового дослідження (якщо є).
- Блок «For agents» (лише для агентів): читати потрібні розділи на вимогу,
  посилатися на сторінки predok.ai, відокремлювати факти від припущень,
  згадка про MCP-сервер `https://api.predok.ai/mcp`.

## 3. `/llms.txt` (запасна точка входу)

Файл за стандартом llmstxt.org у корені сайту (англійською): назва, опис
predok.ai, блок «If the user asks to add Predok» (визнач свого клієнта й
прочитай відповідну сторінку розділу «Connect»), посилання на
`https://predok.ai/w/index.md`, на MCP-сервер і на репозиторій плагіна,
розділ «Connect» зі сторінками довідки. `/llms-full.txt` — уся методичка
англійською однією сторінкою (`/{lang}/w/llms-full.txt` веде 301 на нього).

## 4. Підказки в HTML

У `<head>` кожної сторінки бази знань (будь-якою мовою), що має англійський
переклад, додай:
```html
<link rel="alternate" type="text/markdown" href="https://predok.ai/w/sources/metric-books.md">
```

## 5. Доступність для агентів

- `robots.txt` має дозволяти `.md`, `llms.txt` (зараз `Allow: /` — ок).
- Не блокуй запити від ШІ-агентів/ботів (Cloudflare bot protection, JS-челенджі)
  для `/w/*`, `*.md` і `/llms.txt`.
- Додай `.md`-сторінки й `llms.txt` у CI-перевірку: кожна англійська
  HTML-сторінка бази знань має `.md`-пару, усі посилання в `index.md`
  повертають 200.
- Адреси розділів (slug-и) не змінювати без редиректу 301 — на них посилаються
  агенти й відповіді користувачам.
- Кешування: `Cache-Control: public, max-age=3600` (або менше) — щоб оновлення
  методички швидко доходили до агентів.

## 6. (Бажано) Сторінка про плагін — ✅ зроблено

Сторінка `/uk/w/predok` (або окрема) з інструкцією встановлення плагіна:
```
/plugin marketplace add solvek/predok
/plugin install predok-plugin@predok
```
і посиланням на репозиторій https://github.com/solvek/predok.

## Критерії готовності

- `curl -sI https://predok.ai/w/index.md` → 200, `text/markdown`.
- `curl -sI https://predok.ai/uk/w/index.md` → 301 на `/w/index.md`.
- Усі посилання в `/w/index.md` → 200 і ведуть на `.md`.
- `curl -sI https://predok.ai/llms.txt` → 200.
- `curl -sI https://predok.ai/w/nonexistent.md` → 404.
