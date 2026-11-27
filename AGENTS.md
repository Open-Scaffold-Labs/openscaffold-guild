# AGENTS.md — openscaffold-guild

## What this is

`@openscaffold/guild` — zero-dependency Main Street Cooperative Engine (pure ESM, Node.js >= 20). It provides:

- k-anonymous wholesale price benchmarking (`createGuildPricePool`)
- zero-commission local A2A referral routing (`createZeroTollReferralMesh`)
- steward revenue-split helpers (`calculateStewardSplit`, `estimateMainStreetTakeBack`)

## Stack

- Node.js built-ins only at runtime (no npm runtime dependencies)
- Node's built-in test runner
- `src/` and `test/`

## Install / run / test / build

```bash
# no install required for the library itself
npm test    # node --test test/*.test.js
```

Example imports are in the README. There is no build or start script.

## CI

No GitHub Actions workflow is in the repo today. Run `npm test` locally and note the missing CI on the PR.

## Shared @openscaffold modules

This repo *is* `@openscaffold/guild`. It has no `@openscaffold/*` dependencies.

## OSL engineering rules

These apply to every Open Scaffold Labs repo:

- **PRs only.** Do not push to the default branch (`main` or `master`). Open a pull request.
- **CI must be green** before merge. Never merge over red.
- **zod `.strict()`** on every write route (POST / PUT / PATCH / DELETE bodies).
- **Attack harness** on every route: auth bypass, tenant crossover, oversized and unknown fields, injection. Required once the app has real users; recommended for prototypes.
- **`docs/security-decisions.md` entry** (reviewed) for any change to headers, auth, or deploys.
- **No competitor names** in code, seed data, comments, or UI copy.
- **Never commit secrets.** No API keys, tokens, credentials, cookies, or magic links. Keep `.env` and real values out of git, PR text, and chat. Commit only `.env.example` with placeholders.

A production deploy, paid account, env/credential change, or merge that auto-deploys to production needs Dale's own yes.
