import admin from "firebase-admin"


let firebaseAdminInitialized = false;

if (!firebaseAdminInitialized) {
  try {
    if (admin.apps.length === 0) { // Check if already initialized
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_ADMIN_CREDENTIALS
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    firebaseAdminInitialized = true;
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}



export const adminAuth = admin.auth()
export default admin