
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

export async function initializeAdminApp() {
  if (getApps().length > 0) {
    app = getApps()[0];
  } else {
    // This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
    // for authentication, which is automatically set in Firebase App Hosting.
    app = initializeApp();
  }

  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}
