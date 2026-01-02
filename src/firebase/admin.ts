
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

if (getApps().length === 0) {
    // This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
    // for authentication, which is automatically set in Firebase App Hosting.
    app = initializeApp();
} else {
    app = getApps()[0];
}

const adminAuth = getAuth(app);
const adminFirestore = getFirestore(app);


export function initializeAdminApp() {
  return {
    app,
    auth: adminAuth,
    firestore: adminFirestore,
  };
}
