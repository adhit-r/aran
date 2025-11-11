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

---

## NEW IMPROVEMENT PHASES (See IMPROVEMENTS.md for detailed analysis)

## Phase 15 — Testing & Quality Assurance (IMMEDIATE PRIORITY)
**Timeline**: 2-3 weeks | **Impact**: HIGH | **Foundation for all future work**
- [ ] Set up GitHub Actions CI pipeline (lint, typecheck, test on PR)
- [ ] Expand unit test coverage to 50%+ for `/src/lib` and `/src/hooks`
- [ ] Add component tests for critical UI components (dashboard, forms, modals)
- [ ] Implement test coverage reporting and enforcement (minimum thresholds)
- [ ] Add security scanning to CI (npm audit, CodeQL analysis)
- [ ] Create integration tests for PocketBase operations
- [ ] Add E2E tests for critical user flows (login, create product, test API)
- [ ] Set up performance benchmarking for key operations

**Success Criteria**: 50%+ code coverage, all PRs tested in CI, zero CI failures on main

## Phase 16 — Developer Experience Improvements (SHORT TERM)
**Timeline**: 1-2 weeks | **Impact**: HIGH | **Accelerates development**
- [ ] Create comprehensive DEVELOPMENT.md with setup, architecture, and troubleshooting
- [ ] Add git hooks (Husky): pre-commit lint/format/typecheck, pre-push tests
- [ ] Document PocketBase schema, collections, and migration process
- [ ] Add VSCode recommended settings and extensions (.vscode/extensions.json)
- [ ] Create component/API generator scripts for scaffolding
- [ ] Add TypeScript API documentation generation (TSDoc)
- [ ] Implement conventional commits enforcement
- [ ] Create debugging configurations for common scenarios

**Success Criteria**: <10 min new developer setup time, <5 min build time

## Phase 17 — Monitoring & Observability (SHORT TERM)
**Timeline**: 2 weeks | **Impact**: HIGH | **Production readiness**
- [ ] Integrate error tracking and reporting (Sentry or alternative)
- [ ] Add structured logging across application (winston/pino)
- [ ] Implement request correlation IDs for tracing
- [ ] Create application metrics dashboard (API usage, performance)
- [ ] Set up uptime monitoring for critical services
- [ ] Add performance monitoring for frontend (Web Vitals)
- [ ] Implement alerting for critical errors and performance degradation
- [ ] Add database query performance monitoring

**Success Criteria**: <5 min error detection time, 99.9% uptime monitoring

## Phase 18 — Security Hardening (MEDIUM TERM)
**Timeline**: 2-3 weeks | **Impact**: HIGH | **Enterprise requirement**
- [ ] Implement automated dependency vulnerability scanning in CI (Snyk/Dependabot)
- [ ] Add security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- [ ] Implement API rate limiting per user/tenant (prevent abuse)
- [ ] Add brute force protection on authentication endpoints
- [ ] Enhance audit logging (comprehensive trail for compliance)
- [ ] Add secrets scanning to CI (prevent credential leaks)
- [ ] Implement SAST (Static Application Security Testing)
- [ ] Add security testing (OWASP ZAP, SQL injection, XSS tests)
- [ ] Review and harden CORS configuration
- [ ] Implement proper secrets management (rotate credentials)

**Success Criteria**: Zero high-severity vulnerabilities, all sensitive actions logged

## Phase 19 — CI/CD & Deployment Automation (MEDIUM TERM)
**Timeline**: 3-4 weeks | **Impact**: HIGH | **Delivery speed**
- [ ] Create automated deployment pipeline (staging on merge, prod on release)
- [ ] Implement release automation with semantic versioning
- [ ] Add automated changelog generation
- [ ] Optimize Docker builds with multi-stage builds
- [ ] Implement deployment health checks and smoke tests
- [ ] Add rollback procedures for failed deployments
- [ ] Create environment-specific configuration management
- [ ] Add database migration automation in deployment
- [ ] Implement blue-green or canary deployment strategy
- [ ] Set up container image scanning for vulnerabilities

**Success Criteria**: <15 min deployment time, zero-downtime deployments

## Phase 20 — Feature Enhancements (ONGOING)
**Timeline**: Ongoing | **Impact**: HIGH | **Complete core features**
- [ ] **API Testing Enhancements**
  - Save and organize test collections
  - Environment variable management for tests
  - Request history and favorites
  - Response validation and assertions
  - Batch/sequential test execution
  - Import/export test collections
- [ ] **Advanced API Discovery**
  - Traffic analysis for automatic endpoint discovery
  - API versioning detection and tracking
  - Breaking change detection between versions
  - Duplicate endpoint identification
- [ ] **Webhook Management**
  - Webhook endpoint CRUD and testing
  - Webhook security (signature verification)
  - Webhook retry logic and dead letter queue
- [ ] **API Mocking**
  - Mock server generation from OpenAPI specs
  - Response templating and dynamic data
  - Mock scenario management
- [ ] **Advanced Search & Filtering**
  - Full-text search across all APIs
  - Saved search queries
  - Search suggestions and autocomplete

**Success Criteria**: Feature parity with Postman for API testing

## Phase 21 — AI & Automation Features (LONG TERM)
**Timeline**: 3-6 months | **Impact**: HIGH | **Competitive differentiation**
- [ ] **AI-Powered Security Analysis**
  - Automatic vulnerability detection in API definitions
  - AI-suggested security improvements
  - Anomaly detection in API traffic patterns
  - Threat intelligence integration and scoring
- [ ] **Smart API Documentation**
  - AI-generated API descriptions from code
  - Automatic parameter documentation
  - Example generation for API calls
  - Documentation quality scoring
- [ ] **Automated Test Generation**
  - AI-generated test cases from API specifications
  - Smart test data generation
  - Test coverage gap analysis
  - Regression test recommendations
- [ ] **API Usage Insights**
  - Usage pattern analysis and optimization
  - Cost optimization recommendations
  - Performance optimization suggestions
  - Capacity planning insights
- [ ] **Natural Language Interface**
  - Natural language API search
  - Conversational API exploration
  - Query-to-filter conversion

**Success Criteria**: 80% accuracy in AI-generated suggestions, 50% time savings

## Phase 22 — Performance & Scalability (LONG TERM)
**Timeline**: Ongoing | **Impact**: MEDIUM | **Handle growth**
- [ ] **Caching Strategy**
  - Redis integration for session/data caching
  - API response caching with TTL
  - Database query result caching
  - CDN integration for static assets
- [ ] **Database Optimization**
  - Index optimization for common queries
  - Query performance analysis and optimization
  - Database connection pooling
  - Read replicas for scaling reads
- [ ] **Frontend Performance**
  - Code splitting and lazy loading
  - Image optimization (next/image)
  - Bundle size analysis and reduction
  - Web Vitals monitoring and optimization
- [ ] **Background Job Processing**
  - Job queue implementation (Bull/BullMQ)
  - Async processing for heavy operations
  - Scheduled tasks (cron jobs)
  - Job monitoring and retry logic
- [ ] **Load Testing & Capacity Planning**
  - Automated load testing in CI
  - Performance regression detection
  - Capacity planning dashboards

**Success Criteria**: <200ms p95 API response, <2s page load, 10x traffic capacity

---

## Implementation Priority

1. **IMMEDIATE**: Phase 15 (Testing & Quality) - Establishes quality gates
2. **SHORT TERM**: Phases 16-17 (DX & Monitoring) - Accelerates development
3. **MEDIUM TERM**: Phases 18-19 (Security & CI/CD) - Production readiness
4. **ONGOING**: Phase 20 (Feature Completion) - Core functionality
5. **LONG TERM**: Phases 21-22 (AI & Scale) - Advanced capabilities

See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for detailed analysis, rationale, and resource estimates.

---

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

## Summary of Improvements

**Total New Features Identified**: 45+ improvements across 8 phases
**New Phases Added**: Phases 15-22
**Priority**: Immediate focus on Testing, DX, and Monitoring (Phases 15-17)

**Key Improvements by Category**:
- **Testing & QA**: 8 improvements (unit, integration, E2E, security tests)
- **Developer Experience**: 6 improvements (docs, hooks, tooling)
- **CI/CD & DevOps**: 5 improvements (pipelines, automation, containers)
- **Observability**: 6 improvements (monitoring, logging, alerting)
- **Security**: 7 improvements (scanning, headers, rate limiting)
- **Features**: 5 major enhancement areas (testing, discovery, webhooks, etc.)
- **AI & Automation**: 5 AI-powered features
- **Performance**: 5 scalability improvements

**See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for full analysis and details.**

---

Last updated: 2025-11-11
