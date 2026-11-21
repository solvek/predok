# predok-plugin

[Українська](README.md) · [English](README.en.md) · **Polski**

Otwarty plugin [predok.ai](https://predok.ai) dla agentów AI (Claude Code i
innych środowisk), który pomaga badać drzewo genealogiczne i odnajdywać
przodków żyjących na terenie dzisiejszej Ukrainy.

## Zawartość

| Komponent | Do czego służy |
|-----------|----------------|
| **Skill `predok-skill`** | Metodyka badań genealogicznych. Skill nie przechowuje tekstu metodyki — za każdym razem czyta aktualną wersję z bazy wiedzy predok.ai ([angielska](https://predok.ai/en/w/), [ukraińska](https://predok.ai/uk/w/)). Agent odpowiada po polsku. |
| **Serwer MCP `predok`** | Serwer `https://api.predok.ai/mcp`, instalowany razem z pluginem, udostępnia agentowi narzędzia predok.ai. |

## Instalacja

### Claude Code

```
/plugin marketplace add solvek/predok
/plugin install predok-plugin@predok
```

Po instalacji uruchom ponownie Claude Code. Skill i serwer MCP włączą się
automatycznie. Jeśli serwer poprosi o autoryzację, wpisz `/mcp` i wybierz
`predok`.

### Gemini CLI

```bash
gemini extensions install https://github.com/solvek/predok
```

### Inne środowiska (Cursor, Codex, Claude Desktop itp.)

1. Dodaj serwer MCP pod adresem `https://api.predok.ai/mcp` (transport
   Streamable HTTP), na przykład:

   ```json
   {
     "mcpServers": {
       "predok": { "type": "http", "url": "https://api.predok.ai/mcp" }
     }
   }
   ```

2. Dodaj [`skills/predok-skill/SKILL.md`](skills/predok-skill/SKILL.md) jako
   skill, regułę lub instrukcję systemową, jeśli środowisko to obsługuje.

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
skills/predok-skill/SKILL.md  skill (tylko instrukcja czytania metodyki ze strony)
docs/                dokumenty wewnętrzne
```

## Współpraca

Uwagi do samej metodyki zgłaszaj na [predok.ai](https://predok.ai). Uwagi do
pluginu — przez issues i pull requesty w tym repozytorium. Głównym językiem
projektu jest ukraiński.

## Licencja

[MIT](LICENSE)
