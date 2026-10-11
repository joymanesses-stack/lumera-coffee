# Lumera backend setup

Firebase Authentication remains the browser sign-in provider. The Node API verifies Firebase ID tokens, issues short-lived backend sessions, and accesses Firestore with Firebase Admin. The browser does not use Firestore directly. Deploy `firestore.rules` to deny direct client access; Firebase Admin bypasses these rules.

## Local development

1. Keep the Firebase web app values in the frontend `.env` (or your Vite environment). `VITE_API_URL=http://localhost:3001` points the frontend to the local API.
2. Copy `server/.env.example` to `server/.env`. Set `SESSION_SECRET` to a long random value and keep `ALLOWED_ORIGINS=http://localhost:5173` for local development.
3. Configure Firebase Admin credentials for the `lumera-coffee` project using Application Default Credentials. Do not put service account credentials in the frontend environment or commit them.
4. Start the backend with `npm start` from `server/`, then start Vite on port 5173.

For production, `VITE_API_URL` should be `https://lumera-coffee-backend.onrender.com` (or the deployed HTTPS API origin). Include the deployed website origin in the backend's `ALLOWED_ORIGINS` so browser requests pass CORS checks. Set `SESSION_SECRET` in the backend hosting environment. The backend also needs Firebase Admin credentials with access to the same Firebase project as the frontend.

## Authentication and roles

Enable the Firebase sign-in providers used by the app (Email/Password and Google). The `/agent` page exchanges the user's Firebase ID token with the API; agent access is checked from Firebase custom claims or an active `agent/{uid}` / `agents/{uid}` record. The admin email `sgahimbare20@gmail.com` is granted admin access by the backend. Admins can set account roles in `/admin`.

## Features

- Quote forms submit to `POST /v1/inquiries`.
- Customers sign in before creating calls; call state uses the backend API and WebRTC signaling uses authenticated Socket.IO.
- `/dashboard` displays call history and persistent conversation messages.
- `/agent` loads the call and inquiry queue from backend APIs. Customer chat history and replies are available in `/dashboard`; an agent chat interface is not yet in this frontend.
- `/admin` provides account role controls and call/inquiry oversight.

Call audio/video uses browser WebRTC. Configure TURN credentials on the backend if users behind restrictive networks cannot establish peer connections with STUN alone.
