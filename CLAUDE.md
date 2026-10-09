# CLAUDE.md — Courtroom of Code

## Project Overview
A website where a user pastes code (or a GitHub PR link) and three AI agents put it on trial:
- **Prosecutor** — attacks the code, finding bugs and bad practices
- **Defender** — argues back, defending the code where possible
- **Judge** — delivers a verdict with a score (0-100) and prioritized fixes

Output streams live. Final verdict is a shareable card.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zod (schema validation)
- Anthropic SDK (server-side only)
- Octokit (GitHub API)

## Key Rules
1. All LLM calls happen **server-side only**. Never expose API keys to the client.
2. Validate every agent output with Zod. Retry once on malformed JSON.
3. Read `DESIGN.md` before creating or editing any UI component.
4. The `MODEL_NAME` must be read from env — never hardcode a model name.
5. Keep it simple. Do not add features that are not in `plan.md`.

## Folder Structure
```
app/
  api/
    trial/route.ts    — SSE streaming endpoint for trials
    github/route.ts   — GitHub PR diff fetcher
  page.tsx            — Landing page
  layout.tsx          — Root layout
components/           — React components
lib/
  schemas.ts          — Zod schemas
  prompts.ts          — System prompts for each agent
  agents.ts           — Trial orchestration logic
```

## Environment Variables
```
ANTHROPIC_API_KEY=    — Anthropic API key (required)
GITHUB_TOKEN=         — GitHub personal access token (optional, for PR fetching)
MODEL_NAME=           — Anthropic model name (e.g. claude-sonnet-4-20250514)
```
