---
milestone: v1.0
version: 1.0.0
updated: 2026-05-21T01:20:00Z
---

# Roadmap

> **Current Phase:** 1 - Foundation & Authentication Setup
> **Status:** planning

## Must-Haves (from SPEC)

- [ ] **Secure Authentication** — Customized JWT registration and OAuth Google authentication.
- [ ] **Health Profile Management** — Dynamic condition checkbox selectors and custom restriction text fields.
- [ ] **OCR Label Scanning** — Multer + Cloudinary photo uploads parsed server-side with Tesseract OCR.
- [ ] **OpenAI Safety Analyzer** — Structured JSON ingredient checks outputting Green/Yellow/Red warnings.
- [ ] **Nutrition Radar Visuals** — Beautiful, responsive radar graphs built with Recharts.
- [ ] **Medical Disclaimer** — Global sticky warnings and explicit scan summary declarations.

---

## Phases

### Phase 1: Foundation & Authentication Setup
**Status:** ⬜ Not Started
**Objective:** Spin up the Next.js (Tailwind v4) frontend repo, Express server, MongoDB connection, and fully configure JWT + Google Passport.js authorization strategies.
**Requirements:** REQ-01, NFR-03

**Plans:**
- [ ] Plan 1.1: Project workspace setup, database connectors, and basic Express server configurations
- [ ] Plan 1.2: Local JWT registration/login and Google Passport OAuth integration

---

### Phase 2: Health Profile & Scan History Dashboard
**Status:** ⬜ Not Started
**Objective:** Develop the main user dashboard UI, the multi-condition profile editor (with checkboxes), and local scan history storage endpoints.
**Depends on:** Phase 1
**Requirements:** REQ-02, REQ-09, NFR-01

**Plans:**
- [ ] Plan 2.1: Health Profile configuration schema and interactive checkbox selector UI
- [ ] Plan 2.2: Scan logs tracking schema, retrieval endpoints, and dashboard history grid

---

### Phase 3: OCR & Image Upload Pipeline
**Status:** ⬜ Not Started
**Objective:** Setup multipart Multer middleware to upload images to Cloudinary, run server-side Tesseract OCR, and display beautiful processing loader states.
**Depends on:** Phase 2
**Requirements:** REQ-03, REQ-04, NFR-04

**Plans:**
- [ ] Plan 3.1: Multer and Cloudinary server configurations with image upload endpoints
- [ ] Plan 3.2: Tesseract OCR text parser integration and frontend loading indicators

---

### Phase 4: OpenAI Safety Engine & Recharts Visualization
**Status:** ⬜ Not Started
**Objective:** Construct structured OpenAI API prompt pipelines, parse analytical JSON safety payloads, map the traffic-light UI, and render Recharts radar charts.
**Depends on:** Phase 3
**Requirements:** REQ-05, REQ-06, REQ-07, REQ-08

**Plans:**
- [ ] Plan 4.1: OpenAI API structured system prompt setup and backend analyzer routing
- [ ] Plan 4.2: Traffic-light scoring layout, personalized risk banners, and Recharts radar rendering

---

### Phase 5: Medical Disclaimer, Theme Toggle, & UAT Polishing
**Status:** ⬜ Not Started
**Objective:** Complete final visual assets, dark/light toggle configuration, global sticky disclaimers, micro-animations, and full end-to-end verification.
**Depends on:** Phase 4
**Requirements:** REQ-10, NFR-02

**Plans:**
- [ ] Plan 5.1: Sticky global footer/header disclaimer and Light/Dark mode Tailwind properties
- [ ] Plan 5.2: Framer Motion animation polishing, responsive viewport audits, and UAT verification

---

## Progress Summary

| Phase | Status | Plans | Complete |
|-------|--------|-------|----------|
| 1 | ⬜ | 0/2 | — |
| 2 | ⬜ | 0/2 | — |
| 3 | ⬜ | 0/2 | — |
| 4 | ⬜ | 0/2 | — |
| 5 | ⬜ | 0/2 | — |

---

## Timeline

| Phase | Started | Completed | Duration |
|-------|---------|-----------|----------|
| 1 | — | — | — |
| 2 | — | — | — |
| 3 | — | — | — |
| 4 | — | — | — |
| 5 | — | — | — |

---

## Status Icons

- ⬜ Not Started
- 🔄 In Progress
- ✅ Complete
- ⏸️ Paused
- ❌ Blocked
