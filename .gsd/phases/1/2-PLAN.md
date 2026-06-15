---
phase: 1
plan: 2
wave: 2
---

# Plan 1.2: Local JWT registration/login and Google Passport OAuth integration

## Objective
Implement secure user authentication including JWT sign-up/login backend endpoints, User profile DB persistence, secure stateless token storage, Passport.js strategy integrations, Google OAuth strategy, and authenticated route guards.

## Context
- .gsd/SPEC.md
- .gsd/RESEARCH.md
- .gsd/REQUIREMENTS.md
- server/src/app.ts

## Tasks

<task type="auto">
  <name>Implement JWT Authentication & User Schema</name>
  <files>server/src/models/User.ts,server/src/routes/auth.ts,server/src/controllers/authController.ts</files>
  <action>
    Create the User database model and register/login API endpoints.
    - Install jsonwebtoken, bcrypt, passport, passport-jwt, and their @types.
    - Define 'User' schema in 'server/src/models/User.ts' storing email (unique), password (hashed), Google ID (optional), name, and healthProfile nested object.
    - Implement register controller: hash passwords with bcrypt, save User to DB.
    - Implement login controller: verify password with bcrypt, sign and return JWT.
    - Setup 'passport-jwt' strategy in 'server/src/config/passport.ts' extracting JWT from headers and validating users.
    - Add authentication routes 'POST /api/auth/register' and 'POST /api/auth/login' to Express router.
  </action>
  <verify>Run backend integration tests or execute mock HTTP requests using a curl script verifying registration and subsequent login returns a valid JWT.</verify>
  <done>Registration and login endpoints work flawlessly, verifying hashed passwords in DB and returning signature-verified JWT tokens.</done>
</task>

<task type="auto">
  <name>Configure Google OAuth Strategy & Route Guards</name>
  <files>server/src/config/passport.ts,server/src/routes/auth.ts,server/src/middleware/authMiddleware.ts</files>
  <action>
    Set up Google OAuth strategy and route protection middleware.
    - Install passport-google-oauth20 and @types.
    - Add Passport Google Strategy in 'server/src/config/passport.ts' supporting both registration and login via Google ID.
    - Setup Google OAuth routes 'GET /api/auth/google' and 'GET /api/auth/google/callback' returning signed JWTs to the client.
    - Write authentication middleware in 'server/src/middleware/authMiddleware.ts' to intercept requests and block unauthorized client access (returning status 401).
    - Add an authenticated route 'GET /api/auth/me' returning the logged-in user's profile details.
  </action>
  <verify>Run the backend and execute an HTTP request to 'GET /api/auth/me' without authorization headers (asserting status 401), and then with a valid JWT (asserting status 200 and User JSON returned).</verify>
  <done>Google OAuth strategy is fully configured, the route guard blocks unauthenticated access, and 'GET /api/auth/me' returns user profile details for authorized tokens.</done>
</task>

## Success Criteria
- [ ] User schema in MongoDB contains nested healthProfile values.
- [ ] Endpoints `POST /api/auth/register` and `POST /api/auth/login` successfully create users and sign secure JWTs.
- [ ] Google OAuth Passport strategy configured.
- [ ] Route guard intercepts requests, returning 401 for invalid tokens, and 200 containing User payload for authorized requests.
