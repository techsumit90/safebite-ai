# SafeBite AI - MVP Task List

## Project Overview

SafeBite AI is a web-based AI-powered food safety analysis platform that helps users determine whether a packaged food product is safe to consume according to their personal health conditions, allergies, and dietary restrictions.

---

## Phase 1 - Project Foundation

### Backend Setup

* Setup Express.js server with TypeScript.
* Configure MongoDB Atlas connection using Mongoose.
* Setup environment variables.
* Configure Helmet, CORS, Morgan, and Rate Limiting.
* Setup JWT Authentication.
* Setup Passport.js authentication strategy.

### Frontend Setup

* Setup Next.js App Router.
* Configure Tailwind CSS v4.
* Configure Shadcn/UI.
* Setup Axios and React Query.
* Configure application layout and routing.

---

## Phase 2 - Authentication System

### User Registration

* Email registration.
* Password hashing using bcrypt.
* Input validation.
* JWT generation.

### User Login

* Secure login.
* JWT token issuance.
* Protected routes.

### User Session

* Persistent authentication.
* Logout functionality.

---

## Phase 3 - Health Profile Management

### Profile Creation

Allow users to store:

* Diabetes
* Hypertension
* High Cholesterol
* Heart Disease
* Kidney Disease
* Liver Disease
* Obesity
* Pregnancy
* Gluten Allergy
* Lactose Intolerance
* Peanut Allergy
* Seafood Allergy
* Egg Allergy
* Other custom allergies

### Profile Features

* Create profile.
* Edit profile.
* Update profile.
* Save to MongoDB.

---

## Phase 4 - Food Label Scanning

### Image Upload

* Upload image from device.
* Camera capture support.
* Image validation.
* File storage.

### OCR Processing

* Integrate Google Vision API.
* Extract ingredients.
* Extract nutritional values.
* Extract allergen information.

---

## Phase 5 - AI Food Analysis Engine

### AI Processing

Send OCR output and health profile to AI model.

### AI Analysis

Determine:

* Safe
* Caution
* Unsafe

### AI Response

Generate:

* Safety Score
* Risk Level
* Harmful Ingredients
* Nutritional Warnings
* Personalized Explanation

---

## Phase 6 - Scan Results

### Results Page

Display:

* Product Name
* Safety Status
* Safety Score
* Ingredients List
* Nutrition Facts
* Health Warnings
* AI Recommendation

### Visual Indicators

* Green = Safe
* Yellow = Caution
* Red = Unsafe

---

## Phase 7 - Scan History

### History Management

* Save scans.
* View previous scans.
* Delete scans.
* Filter scans.

### Data Storage

Store:

* Image URL
* OCR Data
* AI Result
* Scan Timestamp

---

## Phase 8 - Dashboard

### Dashboard Features

Display:

* Total Scans
* Safe Foods
* Unsafe Foods
* Recent Scans
* Health Summary

### Analytics

* Pie Charts
* Bar Charts
* Scan Trends

---

## Phase 9 - Production Readiness

### Security

* JWT verification
* Route protection
* API validation
* Rate limiting

### Performance

* API optimization
* Database indexing
* Error handling

### Deployment

Frontend:

* Vercel

Backend:

* Railway or Render

Database:

* MongoDB Atlas

Storage:

* Cloudinary

---

## MVP Completion Criteria

A user can:

1. Register/Login
2. Configure health conditions
3. Upload a food label image
4. OCR extracts ingredients
5. AI analyzes the product
6. Receive Safe/Caution/Unsafe result
7. View scan history

Only after these are fully working should additional features be developed.
