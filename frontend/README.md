# VisioLab frontend

VisioLab is a React, TypeScript, and Vite image-analysis workspace. The frontend includes image upload and validation, four Gemini-powered scan modes, contextual image chat, scan history stored in the current browser, JSON/TXT exports, PDF reports, and a light/dark theme.

## Run locally

1. Copy `.env.example` to `.env.local` (or use the deployed API default), install frontend dependencies with `npm install`, then start Vite with `npm run dev`.
2. Open the Vite URL (usually `http://localhost:5173`). API requests use `https://ai-image-scanner.vercel.app` by default.

`VITE_API_BASE_URL` defaults to the deployed API URL. Set it in `.env.local` only when connecting to a different API host.

## Image handling

JPEG, PNG, WEBP, GIF, BMP, and TIFF uploads are accepted up to 12 MB. The backend decodes and converts uploads to JPEG with Sharp before sending them to Gemini. Scan records are kept in browser local storage; uploaded source images are not retained by the app. Clear this browser's storage to remove its history.

Account signup and login use MongoDB-backed users and an HttpOnly session cookie. Scan history remains in browser storage and is separated by signed-in account; uploaded source images are not retained by the app.
