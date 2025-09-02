// Firebase Connection Diagnostic Tool
// Use this in browser console to test Firebase connectivity

export const testFirebaseConnection = async () => {
	try {
		console.log("🔍 Testing Firebase Connection...");

		// Test 1: Check if Firebase is initialized
		const { auth, db } = await import("./firebase");
		console.log("✅ Firebase modules imported successfully");

		// Test 2: Check authentication state
		const user = auth.currentUser;
		if (!user) {
			console.log("❌ User not authenticated - please sign in first");
			return;
		}
		console.log("✅ User authenticated:", user.email);

		// Test 3: Test Firestore connection by trying to read
		const { collection, getDocs, query, where } = await import(
			"firebase/firestore"
		);
		try {
			const likedNamesRef = collection(db, "likedNames");
			const q = query(likedNamesRef, where("userId", "==", user.uid));
			const snapshot = await getDocs(q);
			console.log(
				`✅ Firestore read test successful - found ${snapshot.docs.length} documents`
			);
		} catch (error) {
			console.log("❌ Firestore read test failed:", error);
			const firebaseError = error as { code?: string };
			if (firebaseError.code === "permission-denied") {
				console.log(
					"🔧 This is likely a security rules issue - check Firestore rules"
				);
			}
		}

		// Test 4: Test Firestore write
		try {
			const { addDoc, serverTimestamp } = await import("firebase/firestore");
			const likedNamesRef = collection(db, "likedNames");
			const testDoc = await addDoc(likedNamesRef, {
				userId: user.uid,
				name: "TestName",
				gender: "test",
				letter: "T",
				isAIGenerated: false,
				likedAt: serverTimestamp(),
			});
			console.log("✅ Firestore write test successful:", testDoc.id);

			// Clean up test document
			const { deleteDoc, doc } = await import("firebase/firestore");
			await deleteDoc(doc(db, "likedNames", testDoc.id));
			console.log("✅ Test document cleaned up");
		} catch (error) {
			console.log("❌ Firestore write test failed:", error);
			const firebaseError = error as { code?: string };
			if (firebaseError.code === "permission-denied") {
				console.log(
					"🔧 This is likely a security rules issue - check Firestore rules"
				);
			}
		}

		console.log("🎉 Firebase diagnostic complete!");
	} catch (error) {
		console.error("❌ Firebase diagnostic failed:", error);
	}
};

// Auto-run if in browser
if (typeof window !== "undefined") {
	(
		window as { testFirebaseConnection?: typeof testFirebaseConnection }
	).testFirebaseConnection = testFirebaseConnection;
	console.log(
		"🔧 Firebase diagnostic tool loaded! Run testFirebaseConnection() in console to test."
	);
}
