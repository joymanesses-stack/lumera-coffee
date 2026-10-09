const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

initializeApp({ credential: applicationDefault() });

async function grantAgentAccess() {
  const email = process.argv[2];
  if (!email) throw new Error('Usage: node scripts/set-agent-claim.js agent@example.com');

  const user = await getAuth().getUserByEmail(email);
  await getAuth().setCustomUserClaims(user.uid, { ...user.customClaims, agent: true });
  console.log(`Granted agent access to ${email}. Ask the user to sign out and back in.`);
}

grantAgentAccess().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
