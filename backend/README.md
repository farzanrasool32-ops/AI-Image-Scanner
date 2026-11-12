# Backend

The Express API is written in TypeScript. Run `npm run dev` for local development, `npm run build` to compile into `dist/`, and `npm start` to run the compiled server. Copy `.env.example` to `.env` and configure `GEMINI_API_KEY`, `MONGODB_URI`, and a random `JWT_SECRET` of at least 32 characters. MongoDB is required for account registration and login; the API still starts without it, but auth endpoints return `503` until it connects.

Authentication is available at `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me`. Sessions use an HttpOnly cookie; scan, chat, and PDF report endpoints require a signed-in user.

## Source structure

- `src/server.ts` loads environment variables and starts the HTTP server.
- `src/app.ts` configures Express middleware and mounts the API routes.
- `src/routes/` contains the health, authentication, scan, chat, and PDF report endpoints.
- `src/middleware/` contains image upload validation and parsing.
- `src/models/` contains the MongoDB user model.
- `src/services/` contains Gemini requests and image processing.
- `src/types/` contains shared scan and analysis types.
