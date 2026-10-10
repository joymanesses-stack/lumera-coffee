# Firebase and WebRTC setup

The website stores buyer inquiries and call requests in Firebase. The `/agent` dashboard receives live Firestore updates and answers calls. WebRTC sends audio and video directly between the caller and agent. Firestore carries the small offer, answer, and network-candidate messages needed to establish that direct connection, so no separate signaling server or `VITE_SIGNALING_SERVER_URL` is required.

## Firebase setup

1. Create a Firebase project and register a web app.
2. Enable **Authentication → Email/Password** and **Anonymous** sign-in providers.
3. Create the Firestore database.
4. Copy `.env.example` to `.env.local` and fill in the six Firebase web-app values.
5. Deploy Firestore rules and indexes from the project root:

   ```powershell
   firebase login
   firebase use --add
   firebase deploy --only firestore:rules,firestore:indexes
   ```

### Netlify environment variables

Add the six Firebase web-app values from `.env.example` under **Site configuration → Environment variables**: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`. Give each variable **Build** scope and enable it for the **Production** deploy context and any other contexts you use. `VITE_FIREBASE_APPCHECK_SITE_KEY` is optional unless App Check is enabled.

Vite embeds these values at build time. The Netlify build stops and names any missing required values instead of publishing a site that cannot make calls. After saving values, trigger a new production deploy; clear the build cache if the deployed site still reports missing configuration. The local `.env` file is ignored by Git and is not uploaded to Netlify. Ensure all values belong to the same Firebase project where Authentication and Firestore are configured.

## Agent access

1. Create the agent account in Firebase Authentication and enable Email/Password sign-in.
2. In the Firebase Console, open **Firestore Database → Data**. Create an `agent` collection and a document whose ID is the exact Authentication UID. Add the boolean field `active: true`. Repeat for each approved agent. Set `active` to `false` or delete the document to revoke access. The dashboard also recognizes existing active documents in the older `agents` collection. Only project administrators can write these records; Firestore rules deny client writes.
3. Deploy the rules after creating the collection structure. The agent signs in at `/agent`, enables call sounds, and keeps the dashboard open while calls are expected.

## Calls and network requirements

The caller creates a `calls/{callId}` request. Once the agent accepts it, both browsers exchange the WebRTC offer, answer, and ICE candidates through protected Firestore documents under that call. Firestore rules restrict signaling reads and writes to the caller and the assigned active agent. Audio and video do not pass through Firestore or a server; they travel peer to peer.

Calls use Google's public STUN server to discover direct network paths. Most networks work without further setup. Some restrictive corporate, school, or mobile networks block direct peer connections and require a TURN relay; TURN is an optional network relay and does not require a Vite signaling-server URL. Use HTTPS in production; browsers only allow camera and microphone access on secure pages or localhost.

## Security and operations

- Firestore allows public inquiry and anonymous call-request creation, but only an authenticated user with an active `agent/{uid}` or `agents/{uid}` membership document can access the agent desk or accept calls. Use `agent/{uid}` for new agent accounts.
- Call signaling documents can only be read by the caller and assigned agent after a call is accepted. Clients cannot update or delete signal or candidate records.
- Configure Firebase App Check using `VITE_FIREBASE_APPCHECK_SITE_KEY`, then enable enforcement in the Firebase console.
- Configure Firebase usage alerts. Firestore signaling creates document reads and writes while calls connect.

## Data flow

- Quote forms create `inquiries/{id}` documents with status `new`; the agent desk updates their status.
- A caller signs in anonymously and creates a `calls/{id}` document with status `ringing`. The customer's repeating ringtone plays while the agent is being notified.
- The agent answers from `/agent`; the caller and agent subscribe to the call document.
- The agent writes an offer, the caller writes an answer, and both peers exchange ICE candidates in the call's protected Firestore subcollections. WebRTC then carries media directly between the browsers.
