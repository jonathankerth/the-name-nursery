"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile, updatePassword, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../../lib/firebase";
import {
	getUserLikedNames,
	removeLikedName,
	LikedName,
} from "../../lib/likedNames";
import Image from "next/image";
import styles from "./profile.module.css";

type Gender = "baby" | "girl" | "boy";

export default function ProfilePage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [likedNames, setLikedNames] = useState<LikedName[]>([]);
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [uploading, setUploading] = useState(false);
	const [selectedGender, setSelectedGender] = useState<Gender>("baby");

	// Color scheme from home page
	const pageColors = useMemo(
		() => ({
			baby: "#EFD9AA",
			boy: "#B7E9F0",
			girl: "#EDD5EB",
		}),
		[]
	);

	const darken = useCallback((hex: string, amount = 0.22) => {
		const c = hex.replace("#", "");
		const r = parseInt(c.substring(0, 2), 16);
		const g = parseInt(c.substring(2, 4), 16);
		const b = parseInt(c.substring(4, 6), 16);
		const dr = Math.max(0, Math.round(r * (1 - amount)));
		const dg = Math.max(0, Math.round(g * (1 - amount)));
		const db = Math.max(0, Math.round(b * (1 - amount)));
		const toHex = (v: number) => v.toString(16).padStart(2, "0");
		return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
	}, []);

	const headerColor = darken(pageColors[selectedGender], 0.35);

	// Detect gender from URL params or use default
	useEffect(() => {
		try {
			const params = new URLSearchParams(window.location.search);
			const genderParam = params.get("type") as Gender;
			if (genderParam && ["baby", "girl", "boy"].includes(genderParam)) {
				setSelectedGender(genderParam);
			}
		} catch {
			// Default to "baby" if there's any error
			setSelectedGender("baby");
		}
	}, []);

	// Update background color and CSS custom properties when gender changes
	useEffect(() => {
		const bg = pageColors[selectedGender];
		const sectionBg = "rgba(255, 255, 255, 0.9)";
		const sectionBorder = `2px solid ${darken(
			pageColors[selectedGender],
			0.1
		)}`;
		const buttonBg = darken(pageColors[selectedGender], 0.2);
		const buttonBorder = darken(pageColors[selectedGender], 0.3);

		try {
			if (document.documentElement) {
				console.log("Setting CSS properties for gender:", selectedGender);
				console.log(
					"Table text color:",
					darken(pageColors[selectedGender], 0.3)
				);
				console.log(
					"Table header bg:",
					darken(pageColors[selectedGender], 0.2)
				);

				document.documentElement.style.setProperty("--background", bg);
				document.documentElement.style.setProperty("--profile-bg-color", bg);
				document.documentElement.style.setProperty(
					"--section-bg-color",
					sectionBg
				);
				document.documentElement.style.setProperty(
					"--section-border",
					sectionBorder
				);
				document.documentElement.style.setProperty(
					"--header-color",
					headerColor
				);
				document.documentElement.style.setProperty(
					"--header-bg-color",
					"white"
				);
				document.documentElement.style.setProperty(
					"--table-header-bg-color",
					darken(pageColors[selectedGender], 0.2)
				);
				document.documentElement.style.setProperty(
					"--table-header-text-color",
					"white"
				);
				document.documentElement.style.setProperty(
					"--table-text-color",
					darken(pageColors[selectedGender], 0.3)
				);
				document.documentElement.style.setProperty(
					"--table-border-color",
					darken(pageColors[selectedGender], 0.2)
				);
				document.documentElement.style.setProperty(
					"--table-row-bg-color",
					"rgba(255, 255, 255, 0.7)"
				);
				document.documentElement.style.setProperty(
					"--table-row-border-color",
					darken(pageColors[selectedGender], 0.1)
				);
				document.documentElement.style.setProperty(
					"--table-row-hover-bg-color",
					darken(pageColors[selectedGender], 0.05)
				);
				document.documentElement.style.setProperty(
					"--button-bg-color",
					buttonBg
				);
				document.documentElement.style.setProperty(
					"--button-border-color",
					buttonBorder
				);
				document.documentElement.style.setProperty(
					"--button-hover-bg-color",
					darken(pageColors[selectedGender], 0.3)
				);
				document.documentElement.style.setProperty(
					"--explore-button-bg-color",
					pageColors[selectedGender]
				);
				document.documentElement.style.setProperty(
					"--explore-button-text-color",
					headerColor
				);
				document.documentElement.style.setProperty(
					"--explore-button-border-color",
					darken(pageColors[selectedGender], 0.2)
				);
				document.documentElement.style.setProperty(
					"--explore-button-hover-bg-color",
					darken(pageColors[selectedGender], 0.1)
				);
			}
		} catch {
			// noop in non-browser contexts
		}
	}, [selectedGender, pageColors, headerColor, darken]);

	useEffect(() => {
		// Redirect to home if user is not logged in
		if (!loading && !user) {
			router.push("/");
		}
	}, [user, loading, router]);

	const loadLikedNames = useCallback(async () => {
		if (!user) return;
		try {
			const names = await getUserLikedNames(user.uid);
			setLikedNames(names);
		} catch (error) {
			console.error("Error loading liked names:", error);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			setDisplayName(user.displayName || "");
			loadLikedNames();
		}
	}, [user, loadLikedNames]);

	const handleUnlikeName = async (name: string) => {
		if (!user) return;
		try {
			await removeLikedName(user.uid, name);
			setLikedNames((prev) => prev.filter((n) => n.name !== name));
		} catch (error) {
			console.error("Error unliking name:", error);
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !user) return;

		setUploading(true);
		try {
			const imageRef = ref(storage, `avatars/${user.uid}`);
			await uploadBytes(imageRef, file);
			const downloadURL = await getDownloadURL(imageRef);

			await updateProfile(user, {
				photoURL: downloadURL,
			});
		} catch (error) {
			console.error("Error uploading image:", error);
		}
		setUploading(false);
	};

	const handleUpdateProfile = async () => {
		if (!user) return;

		try {
			await updateProfile(user, {
				displayName: displayName,
			});
			setIsEditingProfile(false);
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	};

	const handleUpdatePassword = async () => {
		if (!user || newPassword !== confirmPassword || newPassword.length < 6) {
			return;
		}

		try {
			await updatePassword(user, newPassword);
			setNewPassword("");
			setConfirmPassword("");
			alert("Password updated successfully!");
		} catch (error) {
			console.error("Error updating password:", error);
		}
	};

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			router.push("/");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	// Show loading state while checking auth
	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingSpinner}></div>
				<p>Loading profile...</p>
			</div>
		);
	}

	// Don't render anything if user is not logged in (will redirect)
	if (!user) {
		return null;
	}

	return (
		<div className={styles.profilePageContainer}>
			<header className={styles.pageHeader}>
				<h1 className={styles.headerTitle}>Your Name Nursery</h1>
			</header>
			<div className={styles.profileLayout}>
				{/* Left Side - Profile Hero and Navigation */}
				<div className={styles.leftSection}>
					{/* Profile Hero Section */}
					<div className={styles.profileHero}>
						<div className={styles.avatarSection}>
							<div className={styles.avatarContainer}>
								<Image
									src={user.photoURL || "/default-avatar.svg"}
									alt="Profile"
									className={styles.profileAvatar}
									width={120}
									height={120}
								/>
								{uploading && (
									<div className={styles.uploadingOverlay}>Uploading...</div>
								)}
							</div>
							<input
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className={styles.fileInput}
								id="avatar-upload"
							/>
							<label htmlFor="avatar-upload" className={styles.uploadButton}>
								Change Photo
							</label>
						</div>

						<div className={styles.profileInfo}>
							{isEditingProfile ? (
								<div className={styles.editingForm}>
									<input
										type="text"
										value={displayName}
										onChange={(e) => setDisplayName(e.target.value)}
										placeholder="Display Name"
										className={styles.nameInput}
									/>
									<div className={styles.editButtons}>
										<button
											onClick={handleUpdateProfile}
											className={styles.saveButton}
										>
											Save
										</button>
										<button
											onClick={() => setIsEditingProfile(false)}
											className={styles.cancelButton}
										>
											Cancel
										</button>
									</div>
								</div>
							) : (
								<div className={styles.profileDisplay}>
									<h1 className={styles.userName}>
										{user.displayName || "Anonymous User"}
									</h1>
									<p className={styles.userEmail}>{user.email}</p>
									<button
										onClick={() => setIsEditingProfile(true)}
										className={styles.editButton}
									>
										Edit Profile
									</button>
								</div>
							)}
						</div>

						{/* Security Section */}
						<div className={styles.securitySection}>
							<h3>Security</h3>
							<div className={styles.passwordForm}>
								<input
									type="password"
									placeholder="New Password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className={styles.passwordInput}
								/>
								<input
									type="password"
									placeholder="Confirm Password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className={styles.passwordInput}
								/>
								<button
									onClick={handleUpdatePassword}
									disabled={
										newPassword !== confirmPassword || newPassword.length < 6
									}
									className={styles.updatePasswordButton}
								>
									Update Password
								</button>
							</div>

							<div className={styles.signOutSection}>
								<button
									onClick={handleSignOut}
									className={styles.signOutButton}
								>
									Sign Out
								</button>
							</div>
						</div>
					</div>

					{/* Navigation Boxes */}
					<div className={styles.navigationSection}>
						<button onClick={() => router.push("/")} className={styles.navBox}>
							<span className={styles.navIcon}>🏠</span>
							<div className={styles.navContent}>
								<span className={styles.navLabel}>Home</span>
								<span className={styles.navDescription}>
									Generate baby names
								</span>
							</div>
						</button>

						<button
							onClick={() => router.push("/social")}
							className={styles.navBox}
						>
							<span className={styles.navIcon}>👥</span>
							<div className={styles.navContent}>
								<span className={styles.navLabel}>Social</span>
								<span className={styles.navDescription}>
									Connect with other parents
								</span>
							</div>
						</button>

						<button
							onClick={() => router.push("/explore")}
							className={styles.navBox}
						>
							<span className={styles.navIcon}>🔍</span>
							<div className={styles.navContent}>
								<span className={styles.navLabel}>Explore</span>
								<span className={styles.navDescription}>
									Discover trending names
								</span>
							</div>
						</button>
					</div>
				</div>

				{/* Right Side - Liked Names Table */}
				<div className={styles.rightSection}>
					<div className={styles.likedNamesContainer}>
						<h2 className={styles.sectionTitle}>Your Favorite Names</h2>
						{likedNames.length > 0 ? (
							<div className={styles.namesTable}>
								<div className={styles.tableHeader}>
									<span>Name</span>
									<span>Actions</span>
								</div>
								{likedNames.map((likedName, index) => (
									<div key={index} className={styles.tableRow}>
										<span className={styles.nameName}>{likedName.name}</span>
										<button
											onClick={() => handleUnlikeName(likedName.name)}
											className={styles.removeButton}
										>
											Remove
										</button>
									</div>
								))}
							</div>
						) : (
							<div className={styles.emptyState}>
								<p>No favorite names yet!</p>
								<p>Start exploring names and save your favorites.</p>
								<button
									onClick={() => router.push("/")}
									className={styles.exploreButton}
								>
									Generate Names
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
