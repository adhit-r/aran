# Aran API Sentinel — Roadmap

This document tracks the implementation plan and progress. All features are backed by PocketBase (no mock data).

## Phase 0 — Foundations
- [ ] PocketBase migrations: add/verify `apps`, `api_endpoints`, `swagger_specs`, `api_tests`, `api_collections`, `api_shares`, `audit_logs`, `api_access_requests`, `standards`, `policy_bindings`, `environments`
- [ ] Multi-tenant rules (company scoping) and role RBAC for writes/approvals
- [ ] Seed script and one-command local setup verification

## Phase 1 — Products
- [x] Products list (`/products`) wired to PB
- [ ] Product detail (`/products/[appId]`) with tabs: Overview | APIs | Docs | Testing | Sharing | Settings
- [ ] CRUD for product (name, domain, envs, status, maintainers), audit logs

## Phase 2 — Onboarding wizard
- [ ] Multi-step flow: Details → APIs → Discovery/Import → Docs → Seed Tests → Review
- [ ] Persist draft + final app and endpoints; optional OpenAPI URL import

## Phase 3 — API Discovery
- [ ] OpenAPI import (finalize UI) and store `swagger_specs`
- [ ] Crawler: discover endpoints (pending) → approve → `api_endpoints` (active)
- [ ] Review queue + audit logs

## Phase 4 — API Catalog & Documentation
- [ ] Catalog filters (product/method/status/auth/tags/date) + bulk edits
- [ ] Docs view: render stored OpenAPI + manual notes; versioned `swagger_specs`
- [ ] Link endpoint ⇄ docs ⇄ tests

## Phase 5 — API Testing (Postman‑like)
- [ ] Persist `api_tests`, `api_collections`, `environments`; attach tests to endpoints
- [ ] Runner: execute with env vars, save `lastRun`/`lastResult`
- [ ] Collections, history, response panel; share within org

## Phase 6 — API Security
- [x] Posture summary page (`/api-security`)
- [ ] Drill-down tables (missing/weak auth, rate-limit gaps, deprecated)
- [ ] Quick-fix modals (set auth/ratelimit per endpoint/bulk)
- [ ] Policy recommendations and binding to endpoints

## Phase 7 — API Governance
- [x] Governance summary (`/api-governance`)
- [ ] Standards library (`standards`): style/security/compliance checks
- [ ] `policy_bindings` CRUD (apply standards to app/endpoint)
- [ ] Lifecycle workflow: proposed → active → deprecated → retired; approvals
- [ ] Ownership coverage and alerts

## Phase 8 — Cross‑Org Access (B2B)
- [ ] `api_access_requests` CRUD: requesterOrg → targetOrg, appId, scopes, expiry
- [ ] Target org approvals; token/credential issuance (scoped)
- [ ] Requests UI on both sides + audit logs

## Phase 9 — AI & Automation
- [ ] Expose Hybrid AI actions (analyze posture/docs/risk) with provider toggles and quotas

## Phase 10 — Park UI enablement
- [ ] Re-introduce Park UI preset with safe CSS load order (Tailwind base before Panda @layer)
- [ ] Migrate navigation/cards/forms/tabs to Park components
- [ ] Dark/light tokens finalized

## Phase 11 — CI/CD, scripts
- [ ] Lint/typecheck/build pipeline; smoke e2e (dashboard loads, product CRUD)
- [ ] PB migrate/run/seed scripts; local boot validation

## Phase 12 — Security & Audit
- [ ] Enforce RBAC in rules; audit sensitive actions
- [ ] Store endpoint rate-limit flags and posture

## Phase 13 — Analytics & Telemetry
- [ ] Latency/error trends from `api_tests.lastResult` on product/endpoint pages

## Phase 14 — Documentation
- [ ] Update static docs (setup, data model, flows, governance/policy authoring)

## Navigation/IA
- [x] Add API Security and API Governance sections
- [x] Grouped sidebar categories with ordering

## Already done
- [x] Dashboard wired to PB (live metrics)
- [x] Products list page
- [x] API Security page (posture summary)
- [x] API Governance page (coverage summary)
- [x] AuthProvider in app layout

---

Last updated: <!-- date will be updated manually when changes are made -->
