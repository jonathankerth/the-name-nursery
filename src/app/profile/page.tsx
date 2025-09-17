"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import { updateProfile, updatePassword, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../../lib/firebase";
import {
	getUserLikedNames,
	removeLikedName,
	LikedName,
	type SortOption,
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
	const [categoryFilter, setCategoryFilter] = useState<
		"all" | "boy" | "girl" | "gender-neutral" | "recent"
	>("all");
	const [sortOption, setSortOption] = useState<SortOption>("newest");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// Color scheme from home page
	const pageColors = useMemo(
		() => ({
			baby: "#d3f3c8",
			boy: "#B7E9F0",
			girl: "#EDD5EB",
		}),
		[]
	);

	// Dropdown options
	const sortOptions = [
		{ value: "newest", label: "📅 Most Recent" },
		{ value: "oldest", label: "⏰ Oldest First" },
		{ value: "alphabetical", label: "🔤 A-Z" },
		{ value: "reverse-alphabetical", label: "🔤 Z-A" },
	];

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest('[data-dropdown="sort"]')) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isDropdownOpen]);

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

	// Authentication check - don't redirect, show login prompt instead

	const loadLikedNames = useCallback(async () => {
		if (!user) return;
		try {
			const names = await getUserLikedNames(user.uid);
			setLikedNames(names);
		} catch (error) {
			console.error("Error loading liked names:", error);
		}
	}, [user]);

	// Filter and sort names based on category and sort option
	const filteredNames = useMemo(() => {
		let names = likedNames;

		// First filter by category
		if (categoryFilter === "all") {
			names = likedNames;
		} else if (categoryFilter === "boy") {
			names = likedNames.filter((name) => name.gender === "boy");
		} else if (categoryFilter === "girl") {
			names = likedNames.filter((name) => name.gender === "girl");
		} else if (categoryFilter === "gender-neutral") {
			names = likedNames.filter((name) => name.gender === "baby");
		} else if (categoryFilter === "recent") {
			const threeDaysAgo = new Date();
			threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
			names = likedNames.filter(
				(name) => name.likedAt && name.likedAt.toDate() >= threeDaysAgo
			);
		}

		// Then sort the filtered results
		switch (sortOption) {
			case "newest":
				names.sort((a, b) => {
					if (!a.likedAt || !b.likedAt) return 0;
					return b.likedAt.toMillis() - a.likedAt.toMillis();
				});
				break;
			case "oldest":
				names.sort((a, b) => {
					if (!a.likedAt || !b.likedAt) return 0;
					return a.likedAt.toMillis() - b.likedAt.toMillis();
				});
				break;
			case "alphabetical":
				names.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "reverse-alphabetical":
				names.sort((a, b) => b.name.localeCompare(a.name));
				break;
		}

		return names;
	}, [likedNames, categoryFilter, sortOption]);

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

	// Show login prompt if user is not logged in
	if (!user) {
		return (
			<div className={styles.profilePageContainer}>
				<PageHeader title="Your Name Nursery" showProfileButton={false} />
				<div className={styles.profileLayout}>
					<div className={styles.loginPrompt}>
						<div className={styles.promptIcon}>👤</div>
						<h2>Sign In to View Profile</h2>
						<p>
							To view your profile and manage your favorite names, you need to
							be signed in to your account.
						</p>
						<p>Your profile includes:</p>
						<ul className={styles.featureList}>
							<li>❤️ All your saved favorite names</li>
							<li>📊 Name preferences and history</li>
							<li>⚙️ Account settings and security</li>
							<li>📸 Profile photo and display name</li>
						</ul>
						<div className={styles.promptActions}>
							<button
								className={styles.signInButton}
								onClick={() => router.push("/?signin=true")}
							>
								Sign In to Continue
							</button>
							<button
								className={styles.goHomeButton}
								onClick={() => router.push("/")}
							>
								Go to Home Page
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.profilePageContainer}>
			<PageHeader title="Your Name Nursery" showProfileButton={false} />
			<div className={styles.profileLayout}>
				{/* Left Side - Navigation and Profile Hero */}
				<div className={styles.leftSection}>
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

						<button
							onClick={() => router.push("/blog")}
							className={styles.navBox}
						>
							<span className={styles.navIcon}>📝</span>
							<div className={styles.navContent}>
								<span className={styles.navLabel}>Blog</span>
								<span className={styles.navDescription}>
									Naming trends, Anthroponymy & more
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
									Connect with others
								</span>
							</div>
						</button>

						<button
							onClick={() => router.push("/naming-guide")}
							className={styles.navBox}
						>
							<span className={styles.navIcon}>📖</span>
							<div className={styles.navContent}>
								<span className={styles.navLabel}>Naming Guide</span>
								<span className={styles.navDescription}>
									How to choose names
								</span>
							</div>
						</button>
					</div>

					{/* Profile Hero Section */}
					<div className={styles.profileHero}>
						<div className={styles.avatarSection}>
							<div className={styles.avatarContainer}>
								<Image
									src={user.photoURL || "/default-avatar.svg"}
									alt={`Profile picture of ${user.displayName || "user"}`}
									className={styles.profileAvatar}
									width={120}
									height={120}
									loading="eager"
									priority
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
				</div>

				{/* Right Side - Liked Names Table */}
				<div className={styles.rightSection}>
					<div className={styles.likedNamesContainer}>
						<h2 className={styles.sectionTitle}>Your Favorite Names</h2>

						{/* Category Filter Buttons */}
						{likedNames.length > 0 && (
							<div className={styles.categoryFilters}>
								<button
									className={`${styles.categoryButton} ${
										categoryFilter === "all" ? styles.active : ""
									}`}
									onClick={() => setCategoryFilter("all")}
								>
									All ({likedNames.length})
								</button>
								<button
									className={`${styles.categoryButton} ${
										categoryFilter === "boy" ? styles.active : ""
									}`}
									onClick={() => setCategoryFilter("boy")}
								>
									Boys ({likedNames.filter((n) => n.gender === "boy").length})
								</button>
								<button
									className={`${styles.categoryButton} ${
										categoryFilter === "girl" ? styles.active : ""
									}`}
									onClick={() => setCategoryFilter("girl")}
								>
									Girls ({likedNames.filter((n) => n.gender === "girl").length})
								</button>
								<button
									className={`${styles.categoryButton} ${
										categoryFilter === "gender-neutral" ? styles.active : ""
									}`}
									onClick={() => setCategoryFilter("gender-neutral")}
								>
									Gender Neutral (
									{likedNames.filter((n) => n.gender === "baby").length})
								</button>
								<button
									className={`${styles.categoryButton} ${
										categoryFilter === "recent" ? styles.active : ""
									}`}
									onClick={() => setCategoryFilter("recent")}
								>
									Liked Recently (
									{(() => {
										const threeDaysAgo = new Date();
										threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
										return likedNames.filter(
											(n) => n.likedAt && n.likedAt.toDate() >= threeDaysAgo
										).length;
									})()}
									)
								</button>
							</div>
						)}

						{/* Sorting Controls */}
						{filteredNames.length > 0 && (
							<div className={styles.sortingControls}>
								<span className={styles.sortLabel}>Sort by:</span>
								<div className={styles.customDropdown} data-dropdown="sort">
									<button
										className={`${styles.sortSelect} ${
											isDropdownOpen ? styles.dropdownOpen : ""
										}`}
										onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										type="button"
									>
										{sortOptions.find((opt) => opt.value === sortOption)
											?.label || "Most Recent"}
									</button>
									{isDropdownOpen && (
										<div className={styles.dropdownMenu}>
											{sortOptions.map((option) => (
												<button
													key={option.value}
													className={`${styles.dropdownItem} ${
														sortOption === option.value ? styles.active : ""
													}`}
													onClick={() => {
														setSortOption(option.value as SortOption);
														setIsDropdownOpen(false);
													}}
													type="button"
												>
													{option.label}
												</button>
											))}
										</div>
									)}
								</div>
							</div>
						)}

						{filteredNames.length > 0 ? (
							<div className={styles.namesTable}>
								<div className={styles.tableHeader}>
									<span>Name</span>
									<span>Details</span>
									<span>Saved</span>
									<span>Actions</span>
								</div>
								{filteredNames.map((likedName, index) => (
									<div key={index} className={styles.tableRow}>
										<div className={styles.nameCell}>
											<span className={styles.nameName}>{likedName.name}</span>
										</div>
										<div className={styles.detailsCell}>
											<span className={styles.genderBadge}>
												{likedName.gender === "boy"
													? "👦 Boy"
													: likedName.gender === "girl"
													? "👧 Girl"
													: "👶 Baby"}
											</span>
										</div>
										<div className={styles.dateCell}>
											{likedName.likedAt ? (
												<span className={styles.likedDate}>
													{(() => {
														const date = likedName.likedAt!.toDate();
														const now = new Date();

														// Get dates in local timezone for accurate day comparison
														const dateLocal = new Date(
															date.getFullYear(),
															date.getMonth(),
															date.getDate()
														);
														const nowLocal = new Date(
															now.getFullYear(),
															now.getMonth(),
															now.getDate()
														);

														const diffTime =
															nowLocal.getTime() - dateLocal.getTime();
														const diffDays = Math.floor(
															diffTime / (1000 * 60 * 60 * 24)
														);

														if (diffDays === 0) {
															return `Today at ${date.toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}`;
														} else if (diffDays === 1) {
															return `Yesterday at ${date.toLocaleTimeString(
																[],
																{
																	hour: "2-digit",
																	minute: "2-digit",
																}
															)}`;
														} else if (diffDays < 7) {
															return `${diffDays} days ago at ${date.toLocaleTimeString(
																[],
																{
																	hour: "2-digit",
																	minute: "2-digit",
																}
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
													})()}
												</span>
											) : (
												<span className={styles.unknownDate}>Unknown</span>
											)}
										</div>
										<div className={styles.actionsCell}>
											<button
												onClick={() => handleUnlikeName(likedName.name)}
												className={styles.removeButton}
											>
												Remove
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className={styles.emptyState}>
								<p>
									{categoryFilter === "all"
										? "No favorite names yet!"
										: `No ${
												categoryFilter === "gender-neutral"
													? "gender neutral"
													: categoryFilter
										  } names found!`}
								</p>
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
