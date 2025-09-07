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
	sessionId?: string; // For tracking user sessions
	userAgent?: string; // For analytics
	ipAddress?: string; // For analytics (if collected)
}

// Enhanced interface for analytics
export interface LikedNameAnalytics {
	totalLikes: number;
	uniqueUsers: number;
	avgLikesPerUser: number;
	topNames: { name: string; count: number }[];
	genderDistribution: { gender: string; count: number }[];
	dailyLikes: { date: string; count: number }[];
	recentActivity: LikedName[];
}

// Sorting options for liked names
export type SortOption =
	| "newest"
	| "oldest"
	| "alphabetical"
	| "gender"
	| "letter";

// Add a name to user's liked list with enhanced metadata
export const addLikedName = async (
	userId: string,
	name: string,
	gender: string,
	letter: string,
	isAIGenerated: boolean,
	sessionId?: string,
	userAgent?: string
) => {
	try {
		// Check if user is authenticated
		if (!userId) {
			return false;
		}

		const likedNamesRef = collection(db, "likedNames");
		await addDoc(likedNamesRef, {
			userId,
			name,
			gender,
			letter,
			isAIGenerated,
			likedAt: serverTimestamp(),
			sessionId: sessionId || null,
			userAgent: userAgent || null,
		});

		return true;
	} catch {
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
	} catch {
		return false;
	}
};

// Remove a liked name by document ID
export const removeLikedNameById = async (documentId: string) => {
	try {
		const docRef = doc(db, "likedNames", documentId);
		await deleteDoc(docRef);
		return true;
	} catch {
		return false;
	}
};

// Get all liked names for a user with sorting options
export const getUserLikedNames = async (
	userId: string,
	sortBy: SortOption = "newest",
	limitCount?: number
): Promise<LikedName[]> => {
	try {
		// Check if user is authenticated
		if (!userId) {
			return [];
		}

		const likedNamesRef = collection(db, "likedNames");

		// Use a simple query without sorting to avoid composite index requirements
		const simpleQuery = query(likedNamesRef, where("userId", "==", userId));
		const querySnapshot = await getDocs(simpleQuery);

		if (querySnapshot.docs.length === 0) {
			return [];
		}

		let likedNames = querySnapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data(),
				} as LikedName)
		);

		// Apply client-side sorting
		switch (sortBy) {
			case "newest":
				likedNames.sort((a, b) => {
					if (!a.likedAt || !b.likedAt) return 0;
					return b.likedAt.toMillis() - a.likedAt.toMillis();
				});
				break;
			case "oldest":
				likedNames.sort((a, b) => {
					if (!a.likedAt || !b.likedAt) return 0;
					return a.likedAt.toMillis() - b.likedAt.toMillis();
				});
				break;
			case "alphabetical":
				likedNames.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "gender":
				likedNames.sort((a, b) => {
					const genderCompare = a.gender.localeCompare(b.gender);
					if (genderCompare !== 0) return genderCompare;
					return a.name.localeCompare(b.name);
				});
				break;
			case "letter":
				likedNames.sort((a, b) => {
					const letterCompare = (a.letter || "").localeCompare(b.letter || "");
					if (letterCompare !== 0) return letterCompare;
					return a.name.localeCompare(b.name);
				});
				break;
		}

		// Apply limit if specified
		if (limitCount) {
			likedNames = likedNames.slice(0, limitCount);
		}

		return likedNames;
	} catch (error) {
		console.error("Error fetching liked names:", error);
		return [];
	}
};

// Get analytics for all liked names
export const getLikedNamesAnalytics = async (): Promise<LikedNameAnalytics> => {
	try {
		const likedNamesRef = collection(db, "likedNames");
		const allDocs = await getDocs(likedNamesRef);
		const likedNames = allDocs.docs.map(
			(doc) => ({ id: doc.id, ...doc.data() } as LikedName)
		);

		// Calculate total likes
		const totalLikes = likedNames.length;

		// Calculate unique users
		const uniqueUsers = new Set(likedNames.map((name) => name.userId)).size;

		// Calculate average likes per user
		const avgLikesPerUser = uniqueUsers > 0 ? totalLikes / uniqueUsers : 0;

		// Calculate top names
		const nameCounts = likedNames.reduce((acc, name) => {
			acc[name.name] = (acc[name.name] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const topNames = Object.entries(nameCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([name, count]) => ({ name, count }));

		// Calculate gender distribution
		const genderCounts = likedNames.reduce((acc, name) => {
			acc[name.gender] = (acc[name.gender] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const genderDistribution = Object.entries(genderCounts).map(
			([gender, count]) => ({ gender, count })
		);

		// Calculate daily likes (last 30 days)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recentNames = likedNames.filter(
			(name) => name.likedAt && name.likedAt.toDate() >= thirtyDaysAgo
		);

		const dailyCounts = recentNames.reduce((acc, name) => {
			if (name.likedAt) {
				const date = name.likedAt.toDate().toISOString().split("T")[0];
				acc[date] = (acc[date] || 0) + 1;
			}
			return acc;
		}, {} as Record<string, number>);

		const dailyLikes = Object.entries(dailyCounts)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([date, count]) => ({ date, count }));

		// Get recent activity (last 50 likes)
		const recentActivity = likedNames
			.filter((name) => name.likedAt)
			.sort((a, b) => {
				if (!a.likedAt || !b.likedAt) return 0;
				return b.likedAt.toMillis() - a.likedAt.toMillis();
			})
			.slice(0, 50);

		return {
			totalLikes,
			uniqueUsers,
			avgLikesPerUser,
			topNames,
			genderDistribution,
			dailyLikes,
			recentActivity,
		};
	} catch {
		return {
			totalLikes: 0,
			uniqueUsers: 0,
			avgLikesPerUser: 0,
			topNames: [],
			genderDistribution: [],
			dailyLikes: [],
			recentActivity: [],
		};
	}
};

// Get liked names for a specific name (analytics)
export const getNameLikeStats = async (
	name: string
): Promise<{
	totalLikes: number;
	recentLikes: LikedName[];
	userDemographics: { gender: string; count: number }[];
}> => {
	try {
		const likedNamesRef = collection(db, "likedNames");
		const q = query(likedNamesRef, where("name", "==", name));
		const querySnapshot = await getDocs(q);

		const likedNames = querySnapshot.docs.map(
			(doc) => ({ id: doc.id, ...doc.data() } as LikedName)
		);

		const totalLikes = likedNames.length;

		// Get recent likes (last 20)
		const recentLikes = likedNames
			.filter((name) => name.likedAt)
			.sort((a, b) => {
				if (!a.likedAt || !b.likedAt) return 0;
				return b.likedAt.toMillis() - a.likedAt.toMillis();
			})
			.slice(0, 20);

		// User demographics by gender preference
		const userDemographics = likedNames.reduce((acc, likedName) => {
			const existing = acc.find((d) => d.gender === likedName.gender);
			if (existing) {
				existing.count++;
			} else {
				acc.push({ gender: likedName.gender, count: 1 });
			}
			return acc;
		}, [] as { gender: string; count: number }[]);

		return {
			totalLikes,
			recentLikes,
			userDemographics,
		};
	} catch {
		return {
			totalLikes: 0,
			recentLikes: [],
			userDemographics: [],
		};
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
	} catch {
		return false;
	}
};

// Get user's like statistics
export const getUserLikeStats = async (
	userId: string
): Promise<{
	totalLikes: number;
	oldestLike: LikedName | null;
	newestLike: LikedName | null;
	favoriteGender: string | null;
	favoriteLetter: string | null;
	likesByMonth: { month: string; count: number }[];
}> => {
	try {
		const likedNames = await getUserLikedNames(userId);
		const totalLikes = likedNames.length;

		if (totalLikes === 0) {
			return {
				totalLikes: 0,
				oldestLike: null,
				newestLike: null,
				favoriteGender: null,
				favoriteLetter: null,
				likesByMonth: [],
			};
		}

		// Find oldest and newest likes
		const sortedByDate = likedNames
			.filter((name) => name.likedAt)
			.sort((a, b) => {
				if (!a.likedAt || !b.likedAt) return 0;
				return a.likedAt.toMillis() - b.likedAt.toMillis();
			});

		const oldestLike = sortedByDate[0] || null;
		const newestLike = sortedByDate[sortedByDate.length - 1] || null;

		// Find favorite gender
		const genderCounts = likedNames.reduce((acc, name) => {
			acc[name.gender] = (acc[name.gender] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const favoriteGender =
			Object.entries(genderCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
			null;

		// Find favorite letter
		const letterCounts = likedNames.reduce((acc, name) => {
			if (name.letter) {
				acc[name.letter] = (acc[name.letter] || 0) + 1;
			}
			return acc;
		}, {} as Record<string, number>);

		const favoriteLetter =
			Object.entries(letterCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
			null;

		// Likes by month
		const likesByMonth = likedNames
			.reduce((acc, name) => {
				if (name.likedAt) {
					const date = name.likedAt.toDate();
					const monthKey = `${date.getFullYear()}-${String(
						date.getMonth() + 1
					).padStart(2, "0")}`;
					const existing = acc.find((m) => m.month === monthKey);
					if (existing) {
						existing.count++;
					} else {
						acc.push({ month: monthKey, count: 1 });
					}
				}
				return acc;
			}, [] as { month: string; count: number }[])
			.sort((a, b) => a.month.localeCompare(b.month));

		return {
			totalLikes,
			oldestLike,
			newestLike,
			favoriteGender,
			favoriteLetter,
			likesByMonth,
		};
	} catch {
		return {
			totalLikes: 0,
			oldestLike: null,
			newestLike: null,
			favoriteGender: null,
			favoriteLetter: null,
			likesByMonth: [],
		};
	}
};
