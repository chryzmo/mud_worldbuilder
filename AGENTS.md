# AGENTS.md — mud_worldbuilder

Local-only room editor for the MUD, in React + TypeScript (Create React App) with React Flow. It
reads and writes rooms through `../mud_server`'s REST API.

## Current goal and plans

The project is being prepared for a weekend event at MAGFest 2027. Plans live in
`../mud_server/plans/` (start with `magfest-2027.md`). The plan leans toward keeping world content
as data files in the server repo, so whether this tool stays is an open Phase 0 decision. Check the
plan before investing in new features here.

## Layout

- `src/App.tsx`: loads nodes and edges, lays rooms out on a grid by exit direction, creates rooms.
- `src/FetchData.tsx`: API calls against `http://127.0.0.1:8080` (`/api/nodes`, `/api/edges`).
- `src/components/BasicFlow.tsx`: the React Flow canvas. `RoomNode.tsx`: node rendering.
- `src/components/RoomDetailDiv.tsx`: edit, save and delete the selected room.
- `src/components/CreateRoomModal.tsx`: the new-room form.

## Build and run

```sh
npm install
PORT=3001 npm start   # the package.json script uses Windows `set PORT=3001`
npm run build
scripts/test.sh       # type check (there are no real tests yet)
```

Requires `../mud_server` running locally on port 8080.

## Tests and commits (required)

- **New features ship with tests.** Every new feature or behavior change includes tests that cover
  it, in the same PR. A bug fix includes a test that fails without the fix. If something can't
  reasonably be tested automatically, say why in the PR description.
- This repo has no working test runner yet (`src/App.test.tsx` is CRA boilerplate), so
  `scripts/test.sh` only type-checks. Before adding a feature here, ask the user whether to set
  up tests first (for example by moving to Vite + Vitest like `../mud_frontend`).
- **The local suite must pass before you open or update a PR.** Run `scripts/test.sh` and make
  sure it passes, then report it in the PR's testing section. Don't open a PR with failing or
  skipped checks; if a failure isn't caused by your change, raise it with the user first.
- **Commit through the pre-commit hook.** Run `scripts/install-git-hooks.sh` once per clone. The
  hook (`.githooks/pre-commit`) blocks files that usually hold secrets, secrets in the staged
  changes, merge-conflict markers and files over 1 MB, then runs `scripts/test.sh` (skipped if
  that exact tree already passed). Don't use `git commit --no-verify` unless the user asks. If the
  secret scan flags something safe, mark that line with a `pre-commit: allow-secret` comment.
- In Claude Code, `.claude/settings.json` adds a Stop hook (`scripts/agent-stop-hook.sh`) that runs
  `scripts/test.sh` when a turn changed the repo and sends failures back to you. Other agents:
  run it yourself before finishing.

## Known limits

- Edits rooms only (name, description, exits); not items, NPCs or spawners.
- Edges drawn by dragging on the canvas are not saved; exits are saved from the detail form.
- Server-side, rooms created or deleted through the API at runtime are not fully wired up (see the
  plan's known-bugs list). Restart the server after structural edits.

## Conventions

- Never point this at a production server; the API has no authentication.
- Exits are sent as numeric room IDs; the server ignores non-numeric values.
- Commit or push only when asked; branch off `main` for changes.
