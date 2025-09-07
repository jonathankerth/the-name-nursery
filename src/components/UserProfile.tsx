"use client";

import { useState, useEffect, useCallback } from "react";
import {
	updateProfile,
	updatePassword,
	sendEmailVerification,
	deleteUser,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import {
	removeLikedNameById,
	getUserLikedNames,
	type LikedName,
	type SortOption,
} from "../lib/likedNames";
import Image from "next/image";
import styles from "./UserProfile.module.css";

const UserProfile = ({
	onClose,
	initialTab = "profile",
}: {
	onClose: () => void;
	initialTab?: "profile" | "security" | "liked";
}) => {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<"profile" | "security" | "liked">(
		initialTab
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Profile form states
	const [displayName, setDisplayName] = useState(user?.displayName || "");
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string>("");

	// Security form states
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordStrength, setPasswordStrength] = useState(0);

	// Liked names states
	const [likedNames, setLikedNames] = useState<LikedName[]>([]);
	const [loadingLikedNames, setLoadingLikedNames] = useState(true);
	const [likedNamesFilter, setLikedNamesFilter] = useState<
		"all" | "boy" | "girl"
	>("all");
	const [likedNamesSort, setLikedNamesSort] = useState<SortOption>("newest");

	const loadLikedNames = useCallback(async () => {
		if (!user) return;

		try {
			setLoadingLikedNames(true);
			const names = await getUserLikedNames(user.uid, likedNamesSort);
			setLikedNames(names);
		} catch (error) {
			console.error("Error loading liked names:", error);
			// Handle error silently
		} finally {
			setLoadingLikedNames(false);
		}
	}, [user, likedNamesSort]);

	useEffect(() => {
		if (user) {
			loadLikedNames();
		}
	}, [user, loadLikedNames]);

	useEffect(() => {
		// Calculate password strength
		const strength = calculatePasswordStrength(newPassword);
		setPasswordStrength(strength);
	}, [newPassword]);

	const calculatePasswordStrength = (password: string): number => {
		let strength = 0;
		if (password.length >= 8) strength += 25;
		if (password.match(/[a-z]/)) strength += 25;
		if (password.match(/[A-Z]/)) strength += 25;
		if (password.match(/[0-9]/)) strength += 12.5;
		if (password.match(/[^a-zA-Z0-9]/)) strength += 12.5;
		return Math.min(strength, 100);
	};

	const getPasswordStrengthColor = (strength: number): string => {
		if (strength < 30) return "#ef4444";
		if (strength < 60) return "#f59e0b";
		if (strength < 80) return "#10b981";
		return "#059669";
	};

	const getPasswordStrengthText = (strength: number): string => {
		if (strength < 30) return "Weak";
		if (strength < 60) return "Fair";
		if (strength < 80) return "Good";
		return "Strong";
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				setError("Image must be less than 5MB");
				return;
			}

			setAvatarFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				setAvatarPreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleProfileUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		try {
			setLoading(true);
			setError("");
			setSuccess("");

			let photoURL = user.photoURL;

			// Upload new avatar if selected
			if (avatarFile) {
				const avatarRef = ref(storage, `avatars/${user.uid}`);
				await uploadBytes(avatarRef, avatarFile);
				photoURL = await getDownloadURL(avatarRef);
			}

			// Update profile
			await updateProfile(user, {
				displayName: displayName.trim() || null,
				photoURL: photoURL,
			});

			setSuccess("Profile updated successfully!");
			setAvatarFile(null);
			setAvatarPreview("");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update profile";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		try {
			setLoading(true);
			setError("");
			setSuccess("");

			await updatePassword(user, newPassword);
			setSuccess("Password updated successfully!");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error: unknown) {
			const firebaseError = error as { code?: string; message?: string };
			if (firebaseError.code === "auth/requires-recent-login") {
				setError("Please sign out and sign back in to change your password");
			} else {
				setError(firebaseError.message || "Failed to update password");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSendVerificationEmail = async () => {
		if (!user) return;

		try {
			setLoading(true);
			setError("");
			setSuccess("");

			await sendEmailVerification(user);
			setSuccess("Verification email sent! Check your inbox.");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to send verification email";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveLikedName = async (nameId: string) => {
		if (!user) return;

		try {
			await removeLikedNameById(nameId);
			setLikedNames((prevNames) =>
				prevNames.filter((name) => name.id !== nameId)
			);
		} catch {
			// Handle error silently
		}
	};
	const handleDeleteAccount = async () => {
		if (!user) return;

		const confirmed = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		);

		if (confirmed) {
			try {
				setLoading(true);
				await deleteUser(user);
				onClose();
			} catch (error: unknown) {
				const firebaseError = error as { code?: string; message?: string };
				if (firebaseError.code === "auth/requires-recent-login") {
					setError("Please sign out and sign back in to delete your account");
				} else {
					setError(firebaseError.message || "Failed to delete account");
				}
			} finally {
				setLoading(false);
			}
		}
	};

	if (!user) return null;

	return (
		<div className={styles.profileContainer}>
			<div className={styles.profileHeader}>
				<h2>My Profile</h2>
				<button
					className={styles.closeButton}
					onClick={onClose}
					aria-label="Close"
				>
					×
				</button>
			</div>

			{error && <div className={styles.errorMessage}>{error}</div>}
			{success && <div className={styles.successMessage}>{success}</div>}

			<div className={styles.tabNavigation}>
				<button
					className={`${styles.tabButton} ${
						activeTab === "profile" ? styles.active : ""
					}`}
					onClick={() => setActiveTab("profile")}
				>
					👤 Profile
				</button>
				<button
					className={`${styles.tabButton} ${
						activeTab === "security" ? styles.active : ""
					}`}
					onClick={() => setActiveTab("security")}
				>
					🔒 Security
				</button>
				<button
					className={`${styles.tabButton} ${
						activeTab === "liked" ? styles.active : ""
					}`}
					onClick={() => setActiveTab("liked")}
				>
					❤️ Liked Names ({likedNames.length})
				</button>
			</div>

			<div className={styles.tabContent}>
				{activeTab === "profile" && (
					<form onSubmit={handleProfileUpdate} className={styles.profileForm}>
						<div className={styles.avatarSection}>
							<div className={styles.currentAvatar}>
								<Image
									src={avatarPreview || user.photoURL || "/default-avatar.svg"}
									alt="Profile"
									width={100}
									height={100}
									className={styles.avatarImage}
								/>
							</div>
							<div className={styles.avatarControls}>
								<label htmlFor="avatar" className={styles.avatarLabel}>
									Change Photo
								</label>
								<input
									type="file"
									id="avatar"
									accept="image/*"
									onChange={handleAvatarChange}
									className={styles.avatarInput}
								/>
								{avatarPreview && (
									<button
										type="button"
										onClick={() => {
											setAvatarFile(null);
											setAvatarPreview("");
										}}
										className={styles.cancelAvatar}
									>
										Cancel
									</button>
								)}
							</div>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="displayName">Display Name</label>
							<input
								type="text"
								id="displayName"
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								placeholder="Enter your name"
								maxLength={50}
							/>
						</div>

						<div className={styles.formGroup}>
							<label>Email</label>
							<div className={styles.emailInfo}>
								<span>{user.email}</span>
								{!user.emailVerified && (
									<button
										type="button"
										className={styles.verifyButton}
										onClick={handleSendVerificationEmail}
										disabled={loading}
									>
										Verify Email
									</button>
								)}
								{user.emailVerified && (
									<span className={styles.verifiedBadge}>✓ Verified</span>
								)}
							</div>
						</div>

						<button
							type="submit"
							className={styles.submitButton}
							disabled={loading}
						>
							{loading ? "Updating..." : "Update Profile"}
						</button>
					</form>
				)}

				{activeTab === "security" && (
					<div className={styles.securitySection}>
						<form
							onSubmit={handlePasswordUpdate}
							className={styles.passwordForm}
						>
							<h3>Change Password</h3>

							<div className={styles.formGroup}>
								<label htmlFor="newPassword">New Password</label>
								<input
									type="password"
									id="newPassword"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="Enter new password"
									minLength={8}
								/>
								{newPassword && (
									<div className={styles.passwordStrength}>
										<div className={styles.strengthBar}>
											<div
												className={styles.strengthFill}
												style={{
													width: `${passwordStrength}%`,
													backgroundColor:
														getPasswordStrengthColor(passwordStrength),
												}}
											></div>
										</div>
										<span className={styles.strengthText}>
											{getPasswordStrengthText(passwordStrength)}
										</span>
									</div>
								)}
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="confirmPassword">Confirm Password</label>
								<input
									type="password"
									id="confirmPassword"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirm new password"
									minLength={8}
								/>
							</div>

							<button
								type="submit"
								className={styles.submitButton}
								disabled={loading || !newPassword || !confirmPassword}
							>
								{loading ? "Updating..." : "Update Password"}
							</button>
						</form>

						<div className={styles.dangerZone}>
							<h3>Danger Zone</h3>
							<p>Once you delete your account, there is no going back.</p>
							<button
								type="button"
								className={styles.dangerButton}
								onClick={handleDeleteAccount}
								disabled={loading}
							>
								Delete Account
							</button>
						</div>
					</div>
				)}

				{activeTab === "liked" && (
					<div className={styles.likedNamesSection}>
						<div className={styles.likedNamesHeader}>
							<h3>Your Liked Names</h3>
							<div className={styles.controlsContainer}>
								<div className={styles.sortControls}>
									<label htmlFor="sortSelect" className={styles.sortLabel}>
										Sort by:
									</label>
									<select
										id="sortSelect"
										value={likedNamesSort}
										onChange={(e) =>
											setLikedNamesSort(e.target.value as SortOption)
										}
										className={styles.sortSelect}
									>
										<option value="newest">🕒 Most Recent</option>
										<option value="oldest">📅 Oldest First</option>
										<option value="alphabetical">🔤 A-Z</option>
										<option value="gender">👥 By Gender</option>
										<option value="letter">📝 By Letter</option>
									</select>
								</div>
								{likedNames.length > 0 && (
									<div className={styles.filterButtons}>
										<button
											className={`${styles.filterButton} ${
												likedNamesFilter === "all" ? styles.active : ""
											}`}
											onClick={() => setLikedNamesFilter("all")}
										>
											All ({likedNames.length})
										</button>
										<button
											className={`${styles.filterButton} ${
												likedNamesFilter === "boy" ? styles.active : ""
											}`}
											onClick={() => setLikedNamesFilter("boy")}
										>
											Boys (
											{likedNames.filter((n) => n.gender === "boy").length})
										</button>
										<button
											className={`${styles.filterButton} ${
												likedNamesFilter === "girl" ? styles.active : ""
											}`}
											onClick={() => setLikedNamesFilter("girl")}
										>
											Girls (
											{likedNames.filter((n) => n.gender === "girl").length})
										</button>
									</div>
								)}
							</div>
						</div>

						{loadingLikedNames ? (
							<div className={styles.loading}>Loading your liked names...</div>
						) : likedNames.length > 0 ? (
							<div className={styles.likedNamesList}>
								{likedNames
									.filter(
										(name) =>
											likedNamesFilter === "all" ||
											name.gender === likedNamesFilter
									)
									.map((likedName) => (
										<div key={likedName.id} className={styles.likedNameItem}>
											<div className={styles.nameInfo}>
												<span className={styles.nameText}>
													{likedName.name}
												</span>
												<div className={styles.nameDetails}>
													<span className={styles.nameGender}>
														{likedName.gender === "boy" ? "👦" : "👧"}{" "}
														{likedName.gender}
													</span>
													{likedName.letter && (
														<span className={styles.nameLetter}>
															Letter: {likedName.letter}
														</span>
													)}
													{likedName.isAIGenerated && (
														<span className={styles.aiGenerated}>
															✨ AI Generated
														</span>
													)}
													{likedName.likedAt && (
														<span className={styles.likedDate}>
															{(() => {
																try {
																	const date = likedName.likedAt!.toDate();
																	const now = new Date();
																	const diffTime =
																		now.getTime() - date.getTime();
																	const diffDays = Math.floor(
																		diffTime / (1000 * 60 * 60 * 24)
																	);

																	if (diffDays === 0) {
																		return `Today at ${date.toLocaleTimeString(
																			[],
																			{ hour: "2-digit", minute: "2-digit" }
																		)}`;
																	} else if (diffDays === 1) {
																		return `Yesterday at ${date.toLocaleTimeString(
																			[],
																			{ hour: "2-digit", minute: "2-digit" }
																		)}`;
																	} else if (diffDays < 7) {
																		return `${diffDays} days ago at ${date.toLocaleTimeString(
																			[],
																			{ hour: "2-digit", minute: "2-digit" }
																		)}`;
																	} else {
																		return (
																			date.toLocaleDateString() +
																			" at " +
																			date.toLocaleTimeString([], {
																				hour: "2-digit",
																				minute: "2-digit",
																			})
																		);
																	}
																} catch {
																	return "Unknown date";
																}
															})()}
														</span>
													)}
												</div>
											</div>
											<button
												className={styles.removeButton}
												onClick={() =>
													handleRemoveLikedName(likedName.id || "")
												}
												aria-label={`Remove ${likedName.name}`}
											>
												🗑️
											</button>
										</div>
									))}
							</div>
						) : (
							<div className={styles.emptyState}>
								<p>You haven&apos;t liked any names yet.</p>
								<p>
									Start exploring names and click the ❤️ to save your favorites!
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default UserProfile;
