#!/usr/bin/env bash
# Builds dist/predok-skill.zip: the skill folder `predok/` with its SKILL.md, the shape Claude.ai
# takes for a custom skill. Rebuild it whenever skills/predok/SKILL.md changes.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out="$root/dist/predok-skill.zip"
stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT

mkdir -p "$stage/predok" "$root/dist"
cp "$root/skills/predok/SKILL.md" "$stage/predok/SKILL.md"
rm -f "$out"
(cd "$stage" && zip -qr "$out" predok)
echo "$out"
