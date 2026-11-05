#!/usr/bin/env bash
# Run the worldbuilder's checks. It has no real tests yet (src/App.test.tsx is
# the Create React App boilerplate and fails), so this is a type check.
set -euo pipefail
cd "$(dirname "$0")/.."

[ -d node_modules ] || npm ci --silent --no-audit --no-fund

npx tsc --noEmit
