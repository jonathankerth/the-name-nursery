import { db } from "./firebase";
import {
	collection,
	deleteDoc,
	getDocs,
	query,
	where,
	addDoc,
	serverTimestamp,
	Timestamp,
	doc,
} from "firebase/firestore";

export interface LikedName {
	id?: string;
	userId: string;
	name: string;
	gender: string;
	letter: string;
	isAIGenerated: boolean;
	likedAt: Timestamp | null;
}

// Add a name to user's liked list
export const addLikedName = async (
	userId: string,
	name: string,
	gender: string,
	letter: string,
	isAIGenerated: boolean
) => {
	try {
		// Check if user is authenticated
		if (!userId) {
			console.error("User not authenticated");
			return false;
		}

		const likedNamesRef = collection(db, "likedNames");
		const docRef = await addDoc(likedNamesRef, {
			userId,
			name,
			gender,
			letter,
			isAIGenerated,
			likedAt: serverTimestamp(),
		});

		console.log("Successfully added liked name:", docRef.id);
		return true;
	} catch (error) {
		console.error("Error adding liked name:", error);

		// Check if it's a permissions error
		const firebaseError = error as { code?: string; message?: string };
		if (firebaseError.code === "permission-denied") {
			console.error("Permission denied: Check Firestore security rules");
		}

		return false;
	}
};

// Remove a name from user's liked list by name
export const removeLikedName = async (userId: string, name: string) => {
	try {
		const likedNamesRef = collection(db, "likedNames");
		const q = query(
			likedNamesRef,
			where("userId", "==", userId),
			where("name", "==", name)
		);

		const querySnapshot = await getDocs(q);

		// Remove all matching documents (should be just one)
		const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
		await Promise.all(deletePromises);

		return true;
	} catch (error) {
		console.error("Error removing liked name:", error);
		return false;
	}
};

// Remove a liked name by document ID
export const removeLikedNameById = async (documentId: string) => {
	try {
		const docRef = doc(db, "likedNames", documentId);
		await deleteDoc(docRef);
		console.log("Successfully removed liked name:", documentId);
		return true;
	} catch (error) {
		console.error("Error removing liked name by ID:", error);

		// Check if it's a permissions error
		const firebaseError = error as { code?: string; message?: string };
		if (firebaseError.code === "permission-denied") {
			console.error("Permission denied: Check Firestore security rules");
		}

		return false;
	}
};

// Get all liked names for a user
export const getUserLikedNames = async (
	userId: string
): Promise<LikedName[]> => {
	try {
		// Check if user is authenticated
		if (!userId) {
			console.error("User not authenticated");
			return [];
		}

		const likedNamesRef = collection(db, "likedNames");
		const q = query(likedNamesRef, where("userId", "==", userId));

		const querySnapshot = await getDocs(q);

		const likedNames = querySnapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data(),
				} as LikedName)
		);

		console.log(`Found ${likedNames.length} liked names for user`);
		return likedNames;
	} catch (error) {
		console.error("Error getting liked names:", error);

		// Check if it's a permissions error
		const firebaseError = error as { code?: string; message?: string };
		if (firebaseError.code === "permission-denied") {
			console.error("Permission denied: Check Firestore security rules");
		}

		return [];
	}
};

// Check if a name is liked by user
export const isNameLiked = async (
	userId: string,
	name: string
): Promise<boolean> => {
	try {
		const likedNamesRef = collection(db, "likedNames");
		const q = query(
			likedNamesRef,
			where("userId", "==", userId),
			where("name", "==", name)
		);

		const querySnapshot = await getDocs(q);
		return !querySnapshot.empty;
	} catch (error) {
		console.error("Error checking if name is liked:", error);
		return false;
	}
};
