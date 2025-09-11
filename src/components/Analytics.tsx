"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
	getLikedNamesAnalytics,
	getUserLikeStats,
	LikedNameAnalytics,
	LikedName,
} from "../lib/likedNames";
import styles from "./Analytics.module.css";

interface UserLikeStats {
	totalLikes: number;
	oldestLike: LikedName | null;
	newestLike: LikedName | null;
	favoriteGender: string | null;
	favoriteLetter: string | null;
	likesByMonth: { month: string; count: number }[];
}

const Analytics = () => {
	const { user } = useAuth();
	const [analytics, setAnalytics] = useState<LikedNameAnalytics | null>(null);
	const [userStats, setUserStats] = useState<UserLikeStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadAnalytics = async () => {
			if (!user) return;

			try {
				setLoading(true);
				const [globalAnalytics, userStatsData] = await Promise.all([
					getLikedNamesAnalytics(),
					getUserLikeStats(user.uid),
				]);

				setAnalytics(globalAnalytics);
				setUserStats(userStatsData);
			} catch (error) {
				console.error("Error loading analytics:", error);
			} finally {
				setLoading(false);
			}
		};

		loadAnalytics();
	}, [user]);

	if (!user) {
		return (
			<div className={styles.container}>
				<p>Please sign in to view analytics.</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>Loading analytics...</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<h1>Analytics Dashboard</h1>

			{/* Global Analytics */}
			{analytics && (
				<section className={styles.section}>
					<h2>📊 Global Statistics</h2>
					<div className={styles.statsGrid}>
						<div className={styles.statCard}>
							<h3>Total Likes</h3>
							<p className={styles.statNumber}>
								{analytics.totalLikes.toLocaleString()}
							</p>
						</div>
						<div className={styles.statCard}>
							<h3>Unique Users</h3>
							<p className={styles.statNumber}>
								{analytics.uniqueUsers.toLocaleString()}
							</p>
						</div>
						<div className={styles.statCard}>
							<h3>Avg Likes/User</h3>
							<p className={styles.statNumber}>
								{analytics.avgLikesPerUser.toFixed(1)}
							</p>
						</div>
					</div>

					{/* Top Names */}
					<div className={styles.chartSection}>
						<h3>🏆 Top Liked Names</h3>
						<div className={styles.topNamesList}>
							{analytics.topNames.slice(0, 10).map((item, index) => (
								<div key={item.name} className={styles.topNameItem}>
									<span className={styles.rank}>#{index + 1}</span>
									<span className={styles.name}>{item.name}</span>
									<span className={styles.count}>{item.count} likes</span>
								</div>
							))}
						</div>
					</div>

					{/* Gender Distribution */}
					<div className={styles.chartSection}>
						<h3>👥 Gender Distribution</h3>
						<div className={styles.genderChart}>
							{analytics.genderDistribution.map((item) => (
								<div key={item.gender} className={styles.genderItem}>
									<span className={styles.genderLabel}>
										{item.gender === "boy"
											? "👦"
											: item.gender === "girl"
											? "👧"
											: "🍼"}{" "}
										{item.gender}
									</span>
									<div className={styles.progressBar}>
										<div
											className={styles.progressFill}
											style={{
												width: `${(item.count / analytics.totalLikes) * 100}%`,
												backgroundColor:
													item.gender === "boy"
														? "#B7E9F0"
														: item.gender === "girl"
														? "#EDD5EB"
														: "#d3f3c8",
											}}
										></div>
									</div>
									<span className={styles.count}>{item.count}</span>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* User Statistics */}
			{userStats && (
				<section className={styles.section}>
					<h2>👤 Your Statistics</h2>
					<div className={styles.statsGrid}>
						<div className={styles.statCard}>
							<h3>Your Total Likes</h3>
							<p className={styles.statNumber}>{userStats.totalLikes}</p>
						</div>
						<div className={styles.statCard}>
							<h3>Favorite Gender</h3>
							<p className={styles.statText}>
								{userStats.favoriteGender ? (
									<>
										{userStats.favoriteGender === "boy" ? "👦" : "👧"}{" "}
										{userStats.favoriteGender}
									</>
								) : (
									"N/A"
								)}
							</p>
						</div>
						<div className={styles.statCard}>
							<h3>Favorite Letter</h3>
							<p className={styles.statText}>
								{userStats.favoriteLetter || "N/A"}
							</p>
						</div>
					</div>

					{/* Like Timeline */}
					{userStats.likesByMonth && userStats.likesByMonth.length > 0 && (
						<div className={styles.chartSection}>
							<h3>📅 Your Like Timeline</h3>
							<div className={styles.timeline}>
								{userStats.likesByMonth.map((month) => (
									<div key={month.month} className={styles.timelineItem}>
										<span className={styles.month}>{month.month}</span>
										<div className={styles.timelineBar}>
											<div
												className={styles.timelineFill}
												style={{
													width: `${Math.min((month.count / 10) * 100, 100)}%`,
												}}
											></div>
										</div>
										<span className={styles.count}>{month.count}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* First and Last Likes */}
					<div className={styles.firstLastSection}>
						{userStats.oldestLike && (
							<div className={styles.firstLastCard}>
								<h4>🏁 Your First Like</h4>
								<p className={styles.name}>{userStats.oldestLike.name}</p>
								<p className={styles.date}>
									{userStats.oldestLike.likedAt?.toDate().toLocaleDateString()}
								</p>
							</div>
						)}
						{userStats.newestLike && (
							<div className={styles.firstLastCard}>
								<h4>✨ Your Latest Like</h4>
								<p className={styles.name}>{userStats.newestLike.name}</p>
								<p className={styles.date}>
									{userStats.newestLike.likedAt?.toDate().toLocaleDateString()}
								</p>
							</div>
						)}
					</div>
				</section>
			)}
		</div>
	);
};

export default Analytics;
