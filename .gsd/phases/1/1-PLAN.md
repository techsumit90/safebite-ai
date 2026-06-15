---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Project workspace setup, database connectors, and basic Express server configurations

## Objective
Establish the repository directory structure, initialize the Next.js client with Tailwind CSS v4 in the `client/` directory, configure the Express server with MongoDB connection in the `server/` directory, and verify basic server responsiveness.

## Context
- .gsd/SPEC.md
- .gsd/RESEARCH.md
- .gsd/REQUIREMENTS.md

## Tasks

<task type="auto">
  <name>Initialize Next.js client app with Tailwind CSS v4</name>
  <files>client/</files>
  <action>
    Create a fresh Next.js app in the 'client' directory.
    - Run 'npx -y create-next-app@latest client --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm' (non-interactive).
    - Ensure Tailwind CSS v4 is configured correctly.
    - Confirm the client compiles with a basic 'npm run build'.
  </action>
  <verify>Run 'npm run build' inside client/ and verify successful build output.</verify>
  <done>Next.js application is initialized in client/ directory and successfully builds without errors.</done>
</task>

<task type="auto">
  <name>Initialize Express server with MongoDB connection</name>
  <files>server/</files>
  <action>
    Initialize a Node.js Express application inside the 'server' directory.
    - Run 'npm init -y' inside a new 'server' directory.
    - Install dependencies: express, mongoose, cors, dotenv, helmet, morgan.
    - Install devDependencies: nodemon, typescript, @types/express, @types/node, @types/cors, ts-node.
    - Setup tsconfig.json and package.json scripts ('dev', 'build', 'start').
    - Write 'server/src/config/db.ts' using Mongoose to connect to MongoDB (using environment variables).
    - Write 'server/src/app.ts' setting up Express with standard middleware (CORS, JSON parser, Morgan logging, Helmet security headers) and a simple health check endpoint 'GET /api/health'.
  </action>
  <verify>Run local server with test connection and query 'GET /api/health' with curl/HTTP to check positive status.</verify>
  <done>Express server successfully connects to MongoDB and replies to 'GET /api/health' with status 200 JSON.</done>
</task>

## Success Criteria
- [ ] Next.js React client initialized in `client/` and builds successfully.
- [ ] Express TypeScript server initialized in `server/` and connects successfully to MongoDB.
- [ ] Backend API endpoint `GET /api/health` returns status `200 OK` indicating full database connectivity.
