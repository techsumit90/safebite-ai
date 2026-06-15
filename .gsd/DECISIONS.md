# DECISIONS.md — Architecture Decision Records

> **Purpose**: Log significant technical decisions and their rationale.

## Decisions

### [DECISION-001] Tailwind CSS v4 CSS-First Integration

**Date**: 2026-05-21
**Status**: Accepted

#### Context
We need to set up Tailwind CSS v4 in Next.js. Tailwind v4 is a major CSS-first redesign that doesn't use `tailwind.config.js` by default, but instead configures rules directly via `@import "tailwindcss";` and custom properties.

#### Decision
We will use Tailwind CSS v4's CSS-first integration natively. Theme configurations will be located directly in `globals.css` inside the `@theme` block.

#### Rationale
CSS-first compilation is faster, cleaner, uses fewer configuration files, and represents the future standard for modern Tailwind installations.

#### Consequences
- No `tailwind.config.js` file will exist in the codebase.
- Standard utility classes can still be fully compiled.
- Visual custom themes must be defined using custom CSS custom properties (variables) within `@theme` standard rules.

---

### [DECISION-002] Server-Side OCR Processing via Express Backend

**Date**: 2026-05-21
**Status**: Accepted

#### Context
Extracted raw text needs to be processed with OCR. Performing OCR on the client (browser) vs the backend server changes database write paths, networking bandwidth, and security controls.

#### Decision
All OCR processing will happen server-side inside Node/Express using Tesseract and local buffer operations. 

#### Rationale
- Securely processes image streams.
- Backend holds direct connections to Cloudinary for secure storage and OpenAI for AI evaluation without exposing sensitive keys to clients.
- Centralizes application auditing, logging, and performance monitoring.

---

### [DECISION-003] MongoDB Schema Design for Scan History & Profiles

**Date**: 2026-05-21
**Status**: Accepted

#### Context
Users have unique health profiles that must be matched against scanned food products in real-time. Scan histories must store Cloudinary URL links, extracted text, and AI responses.

#### Decision
Create three major models (User, ScanHistory, and session tracking/revocation if needed) inside MongoDB using Mongoose. The User schema stores health profile flags inside a nested object. The ScanHistory schema stores original Cloudinary URLs and nested results mapping ingredients and Recharts chart metrics.

#### Rationale
Enables incredibly quick document retrieval and matches the user's requirement for robust data security and historical audits.

---

*Last updated: 2026-05-21*
