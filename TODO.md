# Backend Conversion to Node.js - TODO List

## Phase 1: Remove Python Files
- [ ] Remove all Python files from backend/ directory
- [ ] Remove requirements.txt

## Phase 2: Set Up Node.js Backend Structure
- [ ] Create package.json for backend
- [ ] Create server.js (main entry point)
- [ ] Create config/ directory with configuration files
- [ ] Create models/ directory with Mongoose schemas
- [ ] Create middleware/ directory for auth and logging
- [ ] Create routes/ directory for API endpoints
- [ ] Create utils/ directory for utilities
- [ ] Create uploads/ directory for file uploads
- Additional deployment/debug tasks:
  - [ ] Add .env handling (MONGODB_URI, PORT, JWT_SECRET) and ensure secrets are not checked in
  - [ ] Ensure MongoDB password in connection string is URL-encoded (encodeURIComponent)
  - [ ] Add masked logging for DB URI (do not log raw password)
  - [ ] Add Mongoose default connection options (useNewUrlParser, useUnifiedTopology, serverSelectionTimeoutMS)

## Phase 3: Implement Core Functionality
- [ ] Implement user authentication (signup, login)
- [ ] Implement PG management (CRUD operations)
- [ ] Implement booking system
- [ ] Implement file upload handling
- [ ] Implement logging and error handling
- [ ] Implement CORS and security middleware
- Additional implementation/debug tasks:
  - [ ] Add a small DB health-check route or script (GET /health or scripts/test-db.js) to validate connection quickly
  - [ ] Add clear startup logging for DB connection success/failure with actionable hints (bad auth, IP whitelist)
  - [ ] Add instruction to run `node --trace-deprecation server.js` when seeing punycode warnings

## Phase 4: Database Setup
- [ ] Set up MongoDB connection with Mongoose
- [ ] Create User model
- [ ] Create PG model
- [ ] Create Booking model
- Database troubleshooting checklist:
  - [ ] Verify Atlas user exists and has the correct role for the target DB
  - [ ] Confirm Atlas IP whitelist allows server IP (or 0.0.0.0/0 for quick test)
  - [ ] Test connection with a minimal Node script using the same MONGODB_URI
  - [ ] Ensure password does not contain unescaped characters (encodeURIComponent if necessary)

## Phase 5: Testing and Validation
- [ ] Test all API endpoints
- [ ] Verify file uploads work
- [ ] Check authentication flows
- [ ] Validate data models
- Testing/debugging:
  - [ ] Run `npm outdated` and upgrade dependencies that depend on deprecated `punycode` (or replace them)
  - [ ] Re-run server with `--trace-deprecation` to locate offending module; update that dependency

## Phase 6: Frontend Integration
- [ ] Update frontend API calls if needed
- [ ] Test full application functionality

## Quick-run checklist for the current errors reported
- [ ] Confirm environment variables are loaded (print masked values in logs)
- [ ] Verify atlas user/password and IP whitelist
- [ ] Encode password in the URI if it has special characters:
    - Example: const uri = `mongodb+srv://${encodeURIComponent(USER)}:${encodeURIComponent(PASS)}@cluster...`;
- [ ] Add/verify Mongoose options:
    - useNewUrlParser: true
    - useUnifiedTopology: true
    - serverSelectionTimeoutMS: 5000
- [ ] Run: node --trace-deprecation server.js to find which module uses punycode
- [ ] Upgrade dependencies or replace packages that import punycode

## Immediate actions for MongoDB auth & deprecation issues
- Ensure backend/.env contains discrete vars (do NOT commit):
  - MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB, PORT, JWT_SECRET
- Build the connection URI in code using encodeURIComponent for user/pass:
  - Example: const uri = `mongodb+srv://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PASS)}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;
  - Log only a masked URI: console.info(uri.replace(/:(.*)@/, ':*****@'));
- Use robust Mongoose options and a short serverSelectionTimeoutMS:
  - { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }
- Add /health endpoint that returns 200 when mongoose.connection.readyState === 1.

## Dependency remediation (punycode / deprecated modules)
- Trace deprecations and locate callers:
  - npm run start:debug
  - npm ls punycode
- Upgrade offending packages (prefer maintained replacements):
  - npx npm-check-updates -u && npm install
- Clean reinstall after edits:
  - rm -rf node_modules package-lock.json
  - npm install
  - npm dedupe
- Temporary shim is discouraged; if used for short-term, plan to remove after upgrade.

## Quick commands
- Trace deprecation: npm run start:debug
- Find punycode consumers: npm ls punycode
- Upgrade deps: npx npm-check-updates -u && npm install
- Clean reinstall: rm -rf node_modules package-lock.json && npm install && npm dedupe

## Immediate action (apply now)

- Split credentials into discrete env vars and build the URI in code using encodeURIComponent to avoid auth failures with special chars.
- Add a DB health-check (GET /health) that returns 200 on successful mongoose connection and a clear error message on failure.

Example (to paste into your server start/config code):

```js
// build and mask Mongo URI example (do not hardcode secrets)
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const host = process.env.MONGO_HOST; // e.g. cluster0.aw7qkzg.mongodb.net/myDB?retryWrites=true&w=majority
const uri = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}`;
// Masked log for debugging:
console.info('DB URI (masked):', uri.replace(/:(.*)@/, ':*****@'));
// Use options: { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }
```

## Remove unwanted legacy files (apply now)
- [ ] Remove Python backend files and requirements.txt from repo and local disk.
  - Recommended commands (run from repo root):
    - git rm -v backend/*.py requirements.txt
    - rm -v backend/*.py requirements.txt
    - git commit -m "chore: remove legacy python backend files"
  - If nested: git rm -r --cached backend/**/*.py
- [ ] Add .env to .gitignore:
  - echo ".env" >> .gitignore
  - git add .gitignore && git commit -m "chore: ignore .env"

## Identify and fix deprecated punycode usage
- [ ] Trace deprecation to find caller:
  - node --trace-deprecation server.js
- [ ] See which packages depend on punycode:
  - npm ls punycode

## Upgrade and repair dependencies (recommended sequence)
- [ ] Update package versions safely:
  - npx npm-check-updates -u
  - npm install
- [ ] Alternatively, manually bump key packages (e.g. mongoose, mongodb) in package.json then run:
  - npm install
- [ ] Clean reinstall to eliminate stale dependency trees:
  - rm -rf node_modules package-lock.json
  - npm install
  - npm dedupe
- [ ] Run audit and fix:
  - npm audit
  - npm audit fix

## Temporary shim if no upstream fix exists
- [ ] As a short-term workaround only, install the userland punycode package so require('punycode') resolves:
  - npm install --save punycode
- [ ] Plan to replace the offending dependency with a maintained alternative or open an upstream PR/issue.
- [ ] Add temporary punycode shim + npm override in backend/package.json (remove after upstream fix)
  - Example: add dependency "punycode": "^2.1.1" and an "overrides" entry for "punycode" then run a clean install and trace deprecation.

## DB connection & quick health-check
- [ ] Build URI in code with encodeURIComponent to avoid auth failures:
  - Example:
    - const uri = `mongodb+srv://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASS)}@${process.env.MONGO_HOST}`;
    - console.info('DB URI (masked):', uri.replace(/:(.*)@/, ':*****@'));
    - Use Mongoose connect options: { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }
- [ ] Add a lightweight health-check route (server.js):
  - GET /health returns 200 when mongoose.connection.readyState === 1 else 500 with the connection error.

## Quick command summary (copy/paste)
- Trace deprecation: node --trace-deprecation server.js
- Find consumers: npm ls punycode
- Upgrade deps: npx npm-check-updates -u && npm install
- Clean reinstall: rm -rf node_modules package-lock.json && npm install && npm dedupe
- Temporary shim: npm install --save punycode
