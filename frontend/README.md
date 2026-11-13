# VisioLab frontend

VisioLab is a React, TypeScript, and Vite image-analysis workspace. The frontend includes image upload and validation, four Gemini-powered scan modes, contextual image chat, scan history stored in the current browser, JSON/TXT exports, PDF reports, and a light/dark theme.

## Run locally

1. Install frontend dependencies from `frontend/` with `npm install`, then start Vite with `npm run dev`.
2. Open the Vite URL (usually `http://localhost:5173`). The Vite development server proxies `/api` requests to `https://ai-image-scanner.vercel.app`.

To run the backend locally instead, configure `backend/.env` using `backend/.env.example`, start the API from `backend/` with `npm run dev`, and set `VITE_API_BASE_URL=https://ai-image-scanner.vercel.app` in `frontend/.env.local`.

For a deployed frontend, set `VITE_API_BASE_URL` to the backend's public base URL and set `FRONTEND_URL` on the backend to the frontend's origin.

## Image handling

JPEG, PNG, WEBP, GIF, BMP, and TIFF uploads are accepted up to 12 MB. The backend decodes and converts uploads to JPEG with Sharp before sending them to Gemini. Scan records are kept in browser local storage; uploaded source images are not retained by the app. Clear this browser's storage to remove its history.

Account signup and login use MongoDB-backed users and an HttpOnly session cookie. Scan history remains in browser storage and is separated by signed-in account; uploaded source images are not retained by the app.
