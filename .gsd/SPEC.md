# SPEC.md — Project Specification

> **Status**: `FINALIZED`
>
> ⚠️ **Planning Lock**: No code may be written until this spec is marked `FINALIZED`.

## Vision
Safebite AI is an AI-powered, health-aware food analysis platform that empowers users to instantly determine whether packaged food items are safe for their personal health conditions. By uploading or capturing an image of an ingredient label, the platform uses OCR and OpenAI-based analysis to check for potential health risks, allergens, and nutritional concerns tailored specifically to the user's medical profile.

## Goals
1. **Interactive Image Capture & OCR Extraction** — Enable users to upload or snap a photo of a food product's nutrition/ingredient label, extracting raw text reliably using Tesseract OCR.
2. **Personalized AI Food Safety Assessment** — Cross-reference extracted ingredient data with the user's detailed health profile using the OpenAI API to evaluate and explain safety levels.
3. **Scan History & Profile Dashboard** — Provide a secure, state-managed dashboard where users can update their dietary restrictions/health conditions and view their comprehensive historical scans.
4. **Stunning Mobile-Responsive UI/UX** — Implement a premium, responsive interface featuring Dark/Light modes, clean radar charts, and intuitive navigation built with Next.js, React, Tailwind CSS v4, shadcn/ui, and Framer Motion.

## Non-Goals (Out of Scope)
- Barcode scanning (UPC database matching).
- Offline mode support.
- Paid subscription / premium tiers.
- Multi-language support.
- Social/community features (sharing scans, comments).
- Smart wearable / fitness tracker integrations.

## Constraints
- **Technical Stack**: Next.js (React, TypeScript), Tailwind CSS v4, shadcn/ui, Framer Motion for the frontend. Node.js (Express), MongoDB (Mongoose), Passport.js, JWT, and bcrypt for the backend. Tesseract OCR, OpenAI API, Multer, and Cloudinary for file and AI handling.
- **Hosting/Deployment**: Vercel for the Next.js frontend, Render or Railway for the Express backend.
- **Safety Disclaimer**: To prevent medical liability, a prominent medical disclaimer must be visible in a sticky banner/footer globally and below every AI scan result.

## Success Criteria
- [ ] Users can securely register, log in (including Google OAuth option), and manage a personal health profile selecting conditions like Diabetes, High blood pressure, Allergies, Lactose intolerance, etc.
- [ ] Users can upload or capture a label photo, see a smooth loading/progress transition, and receive a complete safety analysis in seconds.
- [ ] The scan result screen displays a clear Green (Safe) / Yellow (Caution) / Red (Unsafe) rating, safety score percentage, harmful ingredients highlighted, nutritional concerns, and a visual radar/nutrition chart.
- [ ] Users can view and delete their past food scan reports inside their dashboard.
- [ ] Responsive modern design works flawlessly on both mobile screen sizes and desktop viewports.
- [ ] Global medical disclaimer is sticky on all pages and displayed clearly in the scan result summary.

## User Stories

### As a health-conscious consumer with high blood pressure
- I want to scan a package's ingredient list at the store
- So that I can instantly know if the sodium content or specific preservatives are dangerous for my high blood pressure.

### As a parent of a child with multiple severe food allergies
- I want to manage a health profile containing multiple dietary restrictions
- So that I can quickly verify if a product contains hidden allergens (e.g. whey, casein for dairy allergy).

---

*Last updated: 2026-05-21*
