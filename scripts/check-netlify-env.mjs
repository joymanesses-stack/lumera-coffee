const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_API_URL',
];

if (process.env.NETLIFY !== 'true') process.exit(0);

const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error(`Netlify build is missing required environment variables: ${missing.join(', ')}`);
  console.error('Add them with Build scope for the Production deploy context, then redeploy. VITE_API_URL must be the deployed HTTPS backend origin (not localhost).');
  process.exit(1);
}
