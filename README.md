# Pool Backend (Node/Express + TypeScript)

REST API for the PoolProject mobile app. Provides auth, photos upload/processing, calendar, stats, and profile management.

## Prerequisites
- Node 18+
- MongoDB (local or cloud)
- Yarn or npm

## Install
```bash
# from pool_backend/
yarn install
# or
npm install
```

## Environment
Create a `.env` file in `pool_backend/` with:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pool
JWT_SECRET=your_secret_here
# Optional: LOG_HEADERS=1 to log request headers
```

## Build & Run
```bash
# Development (ts-node-dev + nodemon)
yarn dev

# Build TypeScript -> dist
yarn build

# Run built server
yarn start
```
The server listens on `http://localhost:${PORT}` and serves API under `/api`.
Static files (processed images) are served from `/downloads`.

## Middleware & Stack
- `helmet`, `cors`, `express.json`
- `morgan` request logging + custom start/finish timing logs
- Centralized error handling in `misc/errors`

## Routes
Base path: `/api`
- `GET /health` — health check
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET /photos`, `GET /photos/:id`, `DELETE /photos/:id`
- `POST /upload` — image upload (multer + sharp processing)
- `GET /calendar/...` — calendar data
- `GET /stats/...` — stats endpoints
- `GET /profile`, `PUT /profile` — profile management

Note: See `src/routes/*.ts` for details and request/response shapes.

## File Uploads
- Uses `multer` for multipart form data
- Uses `sharp` for image processing
- Files saved under `downloads/` and exposed via `/downloads`

## Project Structure
```
src/
  app.ts          # Express app setup
  index.ts        # Server bootstrap (reads env, connects DB)
  config/db.ts    # Mongo connection
  routes/         # Route modules (auth, photos, upload, calendar, stats, profile)
  controllers/    # Request handlers
  services/       # Business logic
  models/         # Mongoose models
  middleware/     # upload, image processing, etc
  misc/           # errors, auth helpers, constants
  repositories/   # Data access abstraction
```

## Development Notes
- Nodemon config in `nodemon.json` runs `ts-node-dev` on `src/index.ts`.
- Ensure MongoDB is reachable via `MONGODB_URI`.

## CORS / Mobile Access
CORS is enabled. When running the mobile app on a device/emulator, ensure it can reach your machine’s LAN IP on `PORT`.

## License
Private student project.
