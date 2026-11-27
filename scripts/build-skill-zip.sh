#!/usr/bin/env bash
# Builds dist/predok-skill.zip: the skill folder `predok/` with its SKILL.md and assets, the shape Claude.ai
# takes for a custom skill. Rebuild it whenever anything in skills/predok changes.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out="$root/dist/predok-skill.zip"
stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT

mkdir -p "$stage/predok" "$root/dist"
cp -r "$root/skills/predok/." "$stage/predok/"
rm -f "$out"
(cd "$stage" && zip -qr "$out" predok)
echo "$out"
