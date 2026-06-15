---
milestone: v1.0
updated: 2026-05-21T01:15:00Z
---

# Requirements

## Overview
These requirements are derived from `SPEC.md` for Safebite AI, creating a clear traceability link from top-level vision to detailed functional deliverables.

---

## Functional Requirements

| ID | Requirement | Source | Phase | Status |
|----|-------------|--------|-------|--------|
| **REQ-01** | Secure registration and authentication using JWT + bcrypt and Google OAuth | SPEC Goal 3 | 1 | Pending |
| **REQ-02** | Health profile checkbox selection & text input for custom allergies/dietary restrictions | SPEC Goal 3 | 2 | Pending |
| **REQ-03** | File upload endpoint with Multer sending packaged food images to Cloudinary | SPEC Goal 1 | 3 | Pending |
| **REQ-04** | Server-side Tesseract OCR text extraction on the uploaded image buffer | SPEC Goal 1 | 3 | Pending |
| **REQ-05** | OpenAI prompt logic executing structured JSON food safety analysis based on health conditions | SPEC Goal 2 | 4 | Pending |
| **REQ-06** | Traffic Light visual safety rating indicator: Green (Safe), Yellow (Caution), Red (Unsafe) | SPEC Goal 2 | 4 | Pending |
| **REQ-07** | List of harmful ingredients, specific warnings, and healthier recommendations | SPEC Goal 2 | 4 | Pending |
| **REQ-08** | Nutrition Radar chart component showing carbohydrate, sugar, fat, protein, and sodium levels | SPEC Goal 4 | 4 | Pending |
| **REQ-09** | Dashboard scan history logging, enabling listing, filtering, and deletion of past scans | SPEC Goal 3 | 2 | Pending |
| **REQ-10** | Dual medical disclaimer (sticky footer/banner and below analysis reports) | SPEC Constraint | 5 | Pending |

---

## Non-Functional Requirements

| ID | Requirement | Category | Phase | Status |
|----|-------------|----------|-------|--------|
| **NFR-01** | Modern, fully mobile-responsive UI with smooth Framer Motion viewport adaptions | UX | All | Pending |
| **NFR-02** | Dark & Light theme toggling with uniform color palettes (Tailwind CSS v4 custom properties) | UX | 5 | Pending |
| **NFR-03** | End-to-end security ensuring users can only read/write their own profiles and histories | Security | 1 | Pending |
| **NFR-04** | Analysis roundtrip latency < 12 seconds with responsive custom progress loader states | Performance | 3, 4 | Pending |

---

## Constraints

| ID | Constraint | Source | Impact |
|----|------------|--------|--------|
| **CON-01** | Advisory Limit | Product Design | AI scans are educational, requiring medical disclaimers on every result. |
| **CON-02** | Database Engine | Tech Stack | Must use MongoDB Atlas / local MongoDB via Mongoose. |
| **CON-03** | Tailwind CSS v4 | Tech Stack | Style components using Tailwind CSS v4 CSS-First property injection. |
| **CON-04** | Authentication | Tech Stack | Must support passport-jwt and Google OAuth strategies securely. |

---

## Traceability Matrix

| Requirement | Plans | Tests | Status |
|-------------|-------|-------|--------|
| **REQ-01** | 1.1, 1.2 | TC-AUTH-01, TC-AUTH-02 | — |
| **REQ-02** | 2.1 | TC-PROF-01 | — |
| **REQ-03** | 3.1 | TC-FILE-01 | — |
| **REQ-04** | 3.2 | TC-OCR-01 | — |
| **REQ-05** | 4.1 | TC-AI-01 | — |
| **REQ-06** | 4.2 | TC-UI-01 | — |
| **REQ-07** | 4.2 | TC-UI-02 | — |
| **REQ-08** | 4.3 | TC-UI-03 | — |
| **REQ-09** | 2.2 | TC-DASH-01 | — |
| **REQ-10** | 5.1 | TC-UI-04 | — |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| **Pending** | Not yet started |
| **In Progress** | Being actively coded and developed |
| **Complete** | Implemented and completely verified with empirical proof |
| **Blocked** | Implementation stopped due to external constraint or failure |
| **Deferred** | Intentionally moved to a later product release cycle |
