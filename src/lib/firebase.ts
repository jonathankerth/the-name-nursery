import { initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
	signInWithEmailLink,
} from "firebase/auth";
import {
	getFirestore,
	enableNetwork,
	disableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable offline persistence and configure settings to reduce connection issues
if (typeof window !== "undefined") {
	// Client-side only configuration to reduce connection warnings
	try {
		// Re-enable network if it was disabled (helps with connection stability)
		enableNetwork(db).catch(() => {
			// Network might already be enabled, ignore error
		});
	} catch {
		// Ignore Firebase configuration errors during development
	}
}

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Export auth functions for email/password and email link
export {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
	signInWithEmailLink,
	enableNetwork,
	disableNetwork,
};

export default app;
