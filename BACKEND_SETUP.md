# Firebase and self-hosted WebRTC setup

The website stores buyer inquiries and call requests in Firebase. The `/agent` dashboard receives live Firestore updates and answers calls. A small Socket.IO server verifies Firebase ID tokens and relays WebRTC offers, answers, and ICE candidates. The browsers send audio/video directly to each other over WebRTC; the signaling server never handles media.

## Firebase setup

1. Create a Firebase project and register a web app.
2. Enable **Authentication → Email/Password** and **Anonymous** sign-in providers.
3. Create the Firestore database.
4. Copy `.env.example` to `.env.local`. Fill in the Firebase web-app values and the deployed call server URL in `VITE_SIGNALING_SERVER_URL`.
5. Deploy Firestore rules and indexes from the project root:

   ```powershell
   firebase login
   firebase use --add
   firebase deploy --only firestore:rules,firestore:indexes
   ```

### Netlify environment variables

For a Netlify deployment, add the six Firebase web-app values from `.env.example` under **Site configuration → Environment variables**: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`. Add `VITE_SIGNALING_SERVER_URL` after deploying the Socket.IO server. `VITE_FIREBASE_APPCHECK_SITE_KEY` is optional unless App Check is enabled.

Vite embeds these values at build time. After saving them in Netlify, trigger a new production deploy (clear the build cache if the deployed site still reports missing configuration). The local `.env` file is intentionally ignored by Git and is not uploaded to Netlify.

6. Create an agent account in Firebase Authentication.
7. Install the signaling server dependencies and grant the agent claim. Authenticate the Firebase Admin SDK using Application Default Credentials:

   ```powershell
   gcloud auth application-default login
   $env:GOOGLE_CLOUD_PROJECT = "your-firebase-project-id"
   cd server
   npm install
   node scripts/set-agent-claim.js agent@example.com
   ```

   The agent must sign out and back in after the claim is applied.

## Run the signaling server locally

In a separate terminal from the Vite app:

```powershell
cd server
$env:GOOGLE_CLOUD_PROJECT = "your-firebase-project-id"
$env:ALLOWED_ORIGINS = "http://localhost:5173"
npm start
```

The server uses Application Default Credentials for Firebase Admin authentication and Firestore checks. Add `VITE_SIGNALING_SERVER_URL=http://localhost:3001` to the root `.env.local` and run the Vite app. The agent must sign in at `/agent`, enable call sounds, and keep the dashboard open while calls are expected.

For production, deploy the Node server to a host that supports persistent WebSocket connections, set `ALLOWED_ORIGINS` to the exact HTTPS website origins, grant its runtime identity Firebase token verification and Firestore read access, and set `VITE_SIGNALING_SERVER_URL` to its HTTPS/WSS URL. Configure TLS at the host or reverse proxy. Do not expose Firebase service-account credentials to the browser.

For Cloud Run, build the included `server/Dockerfile` and set its runtime service account as the Cloud Run identity. Start with a single signaling instance; multiple instances require a shared Socket.IO adapter (such as Redis) so peers connected to different instances can exchange signals.

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud run deploy lumera-call-signaling --source server --region us-central1 --allow-unauthenticated --max 1 --set-env-vars "ALLOWED_ORIGINS=https://your-domain.example"
```

The server endpoint is intentionally public at the transport layer; Socket.IO verifies each connection using its Firebase ID token and Firestore call participation. Before deploying, grant the Cloud Run runtime service account the minimum Firestore read role needed to verify call documents. Copy the resulting HTTPS service URL into `VITE_SIGNALING_SERVER_URL`, then rebuild and deploy the website. Set CORS to the exact production site origin(s).

## TURN relay for reliable calls

STUN-only WebRTC works on many networks but cannot establish media on every NAT, corporate firewall, or mobile network. Production calling needs a TURN server such as coturn.

For coturn with TURN REST API credentials, configure:

- `TURN_URLS`: comma-separated `turn:`/`turns:` URLs
- `TURN_SHARED_SECRET`: coturn `static-auth-secret`; keep it only on the signaling server
- `STUN_URLS`: optional comma-separated STUN URLs (defaults to Google's public STUN server)

The signaling server derives expiring TURN credentials for authenticated call participants. Use `turns:` with a valid TLS certificate for production.

## Security and operations

- Firestore allows public inquiry and anonymous call-request creation, but only an authenticated agent with the `agent` custom claim can list them or accept calls.
- The signaling server checks the Firebase identity, agent claim or caller identity, assigned call ID, and accepted call status before joining a room or relaying signaling events.
- Keep `ALLOWED_ORIGINS` restricted to trusted sites. Apply rate limits and abuse monitoring to public inquiries and call creation before launch.
- Configure Firebase App Check using `VITE_FIREBASE_APPCHECK_SITE_KEY`, then enable enforcement in the Firebase console.
- Configure Firebase and TURN usage alerts. Use HTTPS for the website; browsers only allow camera/microphone access in secure contexts or localhost.

## Data flow

- Quote forms create `inquiries/{id}` documents with status `new`; the agent desk updates the status.
- A caller signs in anonymously and creates a `calls/{id}` document with status `ringing`. The customer's repeating ringtone plays while the agent is being notified.
- The agent answers from `/agent`; the caller and agent both subscribe to that call document and join the matching Socket.IO signaling room.
- The agent creates a WebRTC offer; peers exchange SDP and ICE candidates through Socket.IO, then transmit media directly. The caller and agent can enable incoming-call sounds in their browser session.
