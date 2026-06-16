# 🥗 SafeBite AI — Personalized Food Safety Analyzer

**An AI-powered web application that analyzes packaged food labels and provides personalized health safety assessments based on the user's medical conditions and dietary restrictions.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Issues](https://github.com/techsumit90/safebite-ai/issues) • [Documentation](#documentation)
---
 
## 📌 Table of Contents
 
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [AI Analysis Engine](#ai-analysis-engine)
- [Supported Health Conditions](#supported-health-conditions)
- [Screenshots](#screenshots)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
---
 
## 🧠 Overview
 
SafeBite AI is a full-stack web application designed to empower users with chronic health conditions or dietary restrictions to make safer, more informed food choices. By uploading or scanning an image of a packaged food product's nutrition label, the system uses **OCR extraction** and **AI-driven analysis** to compare ingredient data against the user's personal health profile — delivering a real-time, condition-specific food safety verdict.
 
> **Problem Statement:** Millions of people with conditions like diabetes, hypertension, celiac disease, or food allergies struggle to decode complex ingredient lists and nutritional tables on packaged foods. SafeBite AI eliminates that burden through automated, personalized analysis.
 
---
 
## ✨ Key Features
 
| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | Email/password + OAuth login via Supabase Auth |
| 🏥 **Health Profile Management** | Users configure personal health conditions and allergies |
| 📷 **Image-Based OCR Scanning** | Upload food label photos; text is extracted automatically |
| 🤖 **AI Safety Analysis** | Claude AI compares ingredients against your health profile |
| ⚠️ **Risk Classification** | Clear Safe / Caution / Unsafe verdict with explanation |
| 📋 **Ingredient Breakdown** | Per-ingredient health impact flagging |
| 📊 **Nutritional Concern Alerts** | Highlights high sodium, sugar, fat, or low fiber values |
| 💡 **Healthier Alternatives** | AI suggests safer substitute products when available |
| 🕓 **Scan History** | Cloud-stored history of all previously analyzed products |
| 📱 **Responsive UI** | Fully optimized for mobile, tablet, and desktop |
 
---
 
## 🛠️ Tech Stack
 
### Frontend
- **React 18** — Component-based UI architecture
- **Vite** — Fast build tooling and dev server
- **Tailwind CSS** — Utility-first responsive styling
- **React Router v6** — Client-side routing
- **Axios** — HTTP client for API calls
### Backend & Cloud Services
- **Supabase** — PostgreSQL database, authentication, and file storage
- **Anthropic Claude API** — Core AI engine for food safety analysis
- **Tesseract.js / Google Vision API** — OCR for label image text extraction
### DevOps & Tooling
- **GitHub** — Version control and CI/CD
- **Vercel / Netlify** — Frontend deployment
- **ESLint + Prettier** — Code quality and formatting
---
 
## 🏗️ System Architecture
 
```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite)                │
│                                                          │
│   ┌──────────┐   ┌──────────┐   ┌──────────────────┐   │
│   │  Auth UI │   │ Profile  │   │  Food Scan / OCR  │   │
│   │  (Login/ │   │ Manager  │   │  Upload & Result  │   │
│   │ Register)│   │          │   │      Display      │   │
│   └────┬─────┘   └────┬─────┘   └────────┬─────────┘   │
│        │              │                   │              │
└────────┼──────────────┼───────────────────┼─────────────┘
         │              │                   │
         ▼              ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE (BaaS Layer)                  │
│   ┌────────────┐  ┌──────────────┐  ┌───────────────┐   │
│   │    Auth    │  │  PostgreSQL  │  │  File Storage │   │
│   │  (JWT/     │  │  (users,     │  │  (label image │   │
│   │  OAuth)    │  │  profiles,   │  │   uploads)    │   │
│   └────────────┘  │  scan_hist.) │  └───────────────┘   │
│                   └──────────────┘                       │
└───────────────────────────┬─────────────────────────────┘
                            │
         ┌──────────────────┼─────────────────┐
         ▼                  ▼                  ▼
  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
  │  OCR Engine │   │ Claude AI    │   │  Analysis    │
  │ (Tesseract  │──▶│  (Anthropic  │──▶│  Result JSON │
  │  / Vision)  │   │   API)       │   │  (verdict,   │
  └─────────────┘   └──────────────┘   │  flags, tips)│
                                        └──────────────┘
```
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
Ensure the following are installed on your system:
 
- **Node.js** v18+ and **npm** v9+
- **Git**
- A **Supabase** account (free tier works)
- An **Anthropic API Key**
### 1. Clone the Repository
 
```bash
git clone https://github.com/techsumit90/safebite-ai.git
cd safebite-ai
```
 
### 2. Install Dependencies
 
```bash
npm install
```
 
### 3. Configure Environment Variables
 
Create a `.env` file in the root directory:
 
```bash
cp .env.example .env
```
 
Fill in your credentials (see [Environment Variables](#environment-variables) section).
 
### 4. Set Up Supabase
 
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations from `/supabase/migrations/` in your Supabase SQL editor
3. Enable **Email Auth** under Authentication → Providers
### 5. Start the Development Server
 
```bash
npm run dev
```
 
Visit `http://localhost:5173` in your browser.
 
### 6. Build for Production
 
```bash
npm run build
npm run preview
```
 
---
 
## 🔐 Environment Variables
 
Create a `.env` file at the project root with the following variables:
 
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
 
# Anthropic Claude API
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
 
# OCR Configuration (choose one)
VITE_GOOGLE_VISION_API_KEY=your-google-vision-key   # Option A: Google Cloud Vision
# OR Tesseract.js works out-of-the-box (no key needed) # Option B: Local OCR
 
# App Config
VITE_APP_NAME=SafeBite AI
VITE_APP_ENV=development
```
 
> ⚠️ **Never commit your `.env` file to version control.** It is already included in `.gitignore`.
 
---
 
## 📁 Project Structure
 
```
safebite-ai/
├── public/
│   └── assets/                  # Static assets (icons, logo)
├── src/
│   ├── components/
│   │   ├── auth/                # Login, Register, ProtectedRoute
│   │   ├── dashboard/           # Home dashboard layout
│   │   ├── profile/             # Health profile management UI
│   │   ├── scanner/             # Image upload, OCR display, scan result
│   │   ├── history/             # Scan history list and detail view
│   │   └── ui/                  # Shared UI components (Button, Card, Badge)
│   ├── hooks/
│   │   ├── useAuth.js           # Authentication state hook
│   │   ├── useProfile.js        # User health profile hook
│   │   └── useScan.js           # Food scan state and logic hook
│   ├── lib/
│   │   ├── supabase.js          # Supabase client initialization
│   │   ├── anthropic.js         # Claude API wrapper
│   │   └── ocr.js               # OCR engine abstraction layer
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Scanner.jsx
│   │   └── History.jsx
│   ├── store/                   # Global state (Context API / Zustand)
│   ├── utils/
│   │   ├── analysisParser.js    # Parse Claude AI JSON response
│   │   └── healthRules.js       # Condition-to-ingredient mapping logic
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── migrations/              # SQL schema files
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```
 
---
 
## 🤖 AI Analysis Engine
 
SafeBite AI uses the **Anthropic Claude API** as its core intelligence layer. When a user scans a food label, the following pipeline executes:
 
### Step 1 — OCR Text Extraction
The uploaded image is processed by Tesseract.js (or Google Vision API) to extract raw text from the nutrition label and ingredients section.
 
### Step 2 — Prompt Construction
The extracted text is combined with the user's health profile to build a structured AI prompt:
 
```
You are a clinical nutritionist AI. Analyze the following food label data
for a user with these health conditions: [Diabetes, High Blood Pressure].
 
Ingredients: [Extracted OCR text here]
Nutrition Facts: [Extracted OCR text here]
 
Respond ONLY in JSON with this schema:
{
  "verdict": "safe | caution | unsafe",
  "overall_summary": "...",
  "flagged_ingredients": [{ "name": "...", "reason": "..." }],
  "nutritional_concerns": ["..."],
  "health_risk_warnings": ["..."],
  "healthier_alternatives": ["..."]
}
```
 
### Step 3 — Response Parsing & Display
The JSON response is parsed and rendered as a color-coded safety verdict with expandable sections for ingredient flags, nutritional concerns, and recommendations.
 
---
 
## 🏥 Supported Health Conditions
 
Users can configure one or more of the following conditions in their health profile:
 
| Condition | Key Ingredients/Nutrients Monitored |
|---|---|
| **Diabetes (Type 1 & 2)** | Added sugars, high glycemic index carbs, corn syrup |
| **High Blood Pressure** | Sodium (>600mg/serving), MSG, salt additives |
| **Heart Disease** | Trans fats, saturated fats, LDL-raising oils |
| **Obesity** | Caloric density, refined carbs, hidden sugars |
| **Kidney Disease** | Phosphorus, potassium, sodium, protein overload |
| **High Cholesterol** | Saturated fats, dietary cholesterol, hydrogenated oils |
| **Lactose Intolerance** | Milk, whey, casein, lactose, dairy derivatives |
| **Gluten Intolerance / Celiac** | Wheat, barley, rye, malt, modified starch |
| **Common Allergies** | Peanuts, tree nuts, shellfish, eggs, soy, sesame |
| **Custom Dietary Restrictions** | User-defined keywords flagged during analysis |
 
---
 
## 📸 Screenshots
 
> _Screenshots will be added after UI stabilization. See the [live demo](#) for current UI._
 
| Page | Description |
|---|---|
| 🔐 Login / Register | Secure authentication with health onboarding |
| 🏠 Dashboard | Quick scan shortcut + recent scan summary |
| 👤 Health Profile | Condition checkboxes and allergy management |
| 📷 Food Scanner | Drag-and-drop upload with OCR preview |
| ✅ Analysis Result | Color-coded verdict, ingredient flags, warnings |
| 🕓 Scan History | Searchable log of all past food scans |
 
---
 
## 📡 API Reference
 
### `POST /api/analyze` *(Internal — via Claude API)*
 
Analyzes extracted food label text against a user health profile.
 
**Request Body:**
```json
{
  "ocrText": "Ingredients: Sugar, Palm Oil, Wheat Flour...",
  "nutritionFacts": "Sodium 780mg, Total Fat 12g...",
  "healthConditions": ["diabetes", "high_blood_pressure"],
  "allergies": ["peanuts", "gluten"]
}
```
 
**Response:**
```json
{
  "verdict": "unsafe",
  "overall_summary": "This product is not recommended for diabetic users due to high sugar content.",
  "flagged_ingredients": [
    { "name": "Sugar", "reason": "High glycemic index; raises blood glucose rapidly." },
    { "name": "Palm Oil", "reason": "High in saturated fat; concern for cardiovascular health." }
  ],
  "nutritional_concerns": ["780mg sodium exceeds 30% of daily limit for hypertension patients."],
  "health_risk_warnings": ["Not suitable for diabetics.", "May elevate blood pressure."],
  "healthier_alternatives": ["Look for products with <5g sugar per serving and <200mg sodium."]
}
```
 
---
 
## 🤝 Contributing
 
Contributions are welcome and appreciated. To contribute:
 
1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`
Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages and ensure your code passes `npm run lint` before submitting.
 
---
 
## 👨‍💻 Author
 
**Sumit** — B.E. Computer Engineering, SPPU  
GitHub: [@techsumit90](https://github.com/techsumit90)  
Project: SafeBite AI — Built as part of full-stack AI application development portfolio.
 
---
 
## 📄 License
 
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
 
---
 
<div align="center">
Made with ❤️ to help people make safer food choices every day.
 
⭐ **Star this repo** if you found it useful!
 
</div>