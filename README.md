# Lumera Coffee

Lumera Coffee is a React and TypeScript website for the company's coffee export business. It includes product and buyer information, export inquiry forms, and an agent dashboard.

## Development

```powershell
npm install
npm run dev
```

## Firebase and calls

Copy `.env.example` to `.env.local` and configure the Firebase web app values. The agent desk is available at `/agent` after Firebase Authentication, Firestore, and agent permissions are configured.

Voice and video calls use browser WebRTC with a Socket.IO signaling server. See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for local setup, deployment, and TURN configuration.

## Production build

```powershell
npm run build
```
