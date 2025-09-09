import admin from "firebase-admin";
import { env } from "./env.config";

export const initializeFirebaseAdmin = (): void => {
	if (admin.apps.length > 0) return;

	const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } =
		env;

	if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID) {
		throw new Error("Error starting Firebase! Check credentials.");
	}

	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: FIREBASE_PROJECT_ID,
				clientEmail: FIREBASE_CLIENT_EMAIL,
				privateKey: FIREBASE_PRIVATE_KEY,
			}),
		});
	} catch (err) {
		console.error("Error starting Firebase! Check credentials.");
		process.exit(1);
	}
};
