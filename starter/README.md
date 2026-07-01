# RevOps Starter Kit

A clone-and-fill scaffolding repo for building the deliverables in the RevOps
curriculum. Every folder maps to one or more modules. The files here are
**skeletons with TODOs**, not finished solutions — you fill them in with your own
logic and your own (anonymized) data.

Context this kit assumes: a B2B online **wholesale** marketplace in KSA/MENA.
Buyers are retailers, sellers are brands/distributors. Systems of record:
SmartSuite (CRM/OMS/TMS), Salla (storefront), NetSuite + WMS (finance/inventory),
Make/n8n (orchestration). The through-line of the whole curriculum is a
CEO/CFO **sales-efficiency mandate**, where
`sales efficiency = liquidity efficiency = least friction + least subsidy per unit of GMV`.

---

## Folder → module map

| Folder | What you build here | Module(s) |
|---|---|---|
| `01-mandate/` | Frame the mandate as a MECE issue tree with hypotheses | 0.1, 10.1 |
| `02-metrics-dictionary/` | Governed metric specs (semantic layer source of truth) | 1.5 |
| `03-analytics/` | Cohort-retention + funnel-conversion SQL | 1.2, 1.6 |
| `04-subsidy-waterfall/` | List → pocket-price bridge (the flagship) | 5.3 |
| `05-credit-risk/` | Trade-credit default model + score bands | 5.5 |
| `06-forecast/` | GMV time-series forecast + backtest | 7.2 |
| `07-memos/` | One-page decision memo template | 10.4 |
| `08-board-deck/` | SCQA board-proposal slide outline | 9.3, 10.2 |
| `09-liquidity/` | Liquidity instrumentation dashboard spec | 8.3 |
| `data/` | Where your anonymized sample data lives (git-ignored) | 1.4, 1.5 |

---

## How to use

1. `python -m venv .venv && source .venv/bin/activate`
2. `pip install -r requirements.txt`
3. Work folder by folder in curriculum order. Read the module, then fill the
   `# TODO` blocks in that folder's file(s).
4. Keep the metrics dictionary (`02-metrics-dictionary/metrics.yml`) as your
   single source of truth. Every number in a SQL file, a Python model, a memo,
   or the board deck must trace back to a metric defined there.
5. Reconcile before you present: any GMV/active-buyer figure in the deck must
   match the dictionary's `source_of_record` and its `reconciliation` rule.

## Replace the sample data

This kit ships with **no real data**. Before doing anything useful you must
replace the placeholder sample files with **your own anonymized real data**
pulled from SmartSuite / Salla / NetSuite + WMS:

- Pull from source (SmartSuite API, Salla reports/API, NetSuite saved searches).
- **Anonymize**: hash buyer/seller IDs, drop names/phones/emails/CRNs, jitter or
  band any figure that could identify a specific account. PDPL applies — do not
  commit raw customer PII to git.
- Drop the anonymized extracts into `data/` (git-ignored) using the column
  contracts described in `data/README.md`.
- Never hardcode credentials. Use a local `.env` (git-ignored).

See `data/README.md` for the expected table/column contracts.
