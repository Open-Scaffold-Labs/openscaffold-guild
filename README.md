# `@openscaffold/guild` (`v1.0.0`)

Zero-dependency **Main Street Cooperative Engine** for Open Scaffold Labs (`Node.js >= 20`, pure ESM).

Gives independent American small businesses shared regional purchasing intelligence, zero-commission local B2B discovery, and transparent Steward-Coop revenue-share accounting:

1. **k-Anonymous Wholesale Price Benchmarking (`createGuildPricePool`)** — Aggregates anonymized distributor invoice lines by 3-digit ZIP prefix (`minContributors >= 5`) to flag supplier overcharges and quantify recoverable annual margin without exposing individual shop invoices.
2. **Zero-Toll Local `A2A` Referral Mesh (`createZeroTollReferralMesh`)** — Routes cross-vertical local work (e.g., `open-hoa` to `open-landscape-architect`) via `A2A` Agent Cards at `$0` lead fee, `0%` platform commission, and direct merchant settlement.
3. **Steward Revenue Split & SMB P&L Recovery (`calculateStewardSplit`, `estimateMainStreetTakeBack`)** — Computes Open Scaffold Labs' `$149/yr` flat membership split (`35%` vertical collaborator/steward payout, `45%` OSL infrastructure & operating reserve, `20%` shared Main Street R&D commons) alongside annual profit returned from marketplace toll elimination, captured missed calls, legacy SaaS replacement, and guild purchasing savings.

## Usage

```js
import {
  createGuildPricePool,
  createZeroTollReferralMesh,
  calculateStewardSplit,
  estimateMainStreetTakeBack,
} from '@openscaffold/guild';
```

## Running Tests

```bash
npm test
```
