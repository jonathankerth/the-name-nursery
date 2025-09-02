"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import Image from "next/image";
import AuthForms from "./AuthForms";
import UserProfile from "./UserProfile";
import styles from "./HamburgerMenu.module.css";

const HamburgerMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [showAuthForms, setShowAuthForms] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	const [profileInitialTab, setProfileInitialTab] = useState<
		"profile" | "security" | "liked"
	>("profile");
	const { user, loading } = useAuth();

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			setIsOpen(false);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const handleAuthSuccess = () => {
		setShowAuthForms(false);
		setIsOpen(false);
	};

	const toggleMenu = () => {
		setIsOpen(!isOpen);
		setShowAuthForms(false); // Close auth forms when menu closes
		setShowProfile(false); // Close profile when menu closes
	};

	const openAuthForms = () => {
		setShowAuthForms(true);
		setShowProfile(false);
	};

	const closeAuthForms = () => {
		setShowAuthForms(false);
	};

	const openProfile = (tab: "profile" | "security" | "liked" = "profile") => {
		setProfileInitialTab(tab);
		setShowProfile(true);
		setShowAuthForms(false);
		setIsOpen(false);
	};

	const closeProfile = () => {
		setShowProfile(false);
	};

	if (loading) {
		return null; // Don't show menu while loading
	}

	return (
		<>
			<button
				className={styles.hamburgerButton}
				onClick={toggleMenu}
				aria-label="Menu"
			>
				<div
					className={`${styles.hamburgerLine} ${isOpen ? styles.open : ""}`}
				></div>
				<div
					className={`${styles.hamburgerLine} ${isOpen ? styles.open : ""}`}
				></div>
				<div
					className={`${styles.hamburgerLine} ${isOpen ? styles.open : ""}`}
				></div>
			</button>

			{isOpen && (
				<>
					<div className={styles.overlay} onClick={toggleMenu}></div>
					<div className={styles.menu}>
						<div className={styles.menuHeader}>
							<h3>Menu</h3>
							<button
								className={styles.closeButton}
								onClick={toggleMenu}
								aria-label="Close menu"
							>
								×
							</button>
						</div>

						<div className={styles.menuItems}>
							{user ? (
								<>
									<div className={styles.userInfo}>
										<Image
											src={user.photoURL || "/default-avatar.svg"}
											alt="Profile"
											className={styles.avatar}
											width={48}
											height={48}
										/>
										<div>
											<p className={styles.userName}>
												{user.displayName || user.email}
											</p>
											<p className={styles.userEmail}>{user.email}</p>
										</div>
									</div>

									<button
										className={styles.menuItem}
										onClick={() => openProfile("profile")}
									>
										👤 My Profile
									</button>

									<button
										className={styles.menuItem}
										onClick={() => openProfile("liked")}
									>
										❤️ Liked Names
									</button>

									<button className={styles.menuItem} onClick={handleSignOut}>
										🚪 Sign Out
									</button>
								</>
							) : (
								<button className={styles.menuItem} onClick={openAuthForms}>
									🔐 Sign In / Sign Up
								</button>
							)}
						</div>
					</div>
				</>
			)}

			{/* Auth Forms Modal */}
			{showAuthForms && (
				<>
					<div className={styles.modalOverlay} onClick={closeAuthForms}></div>
					<div className={styles.modalContainer}>
						<AuthForms onClose={closeAuthForms} onSuccess={handleAuthSuccess} />
					</div>
				</>
			)}
			{/* User Profile Modal */}
			{showProfile && (
				<>
					<div className={styles.modalOverlay} onClick={closeProfile}></div>
					<div className={styles.modalContainer}>
						<UserProfile
							onClose={closeProfile}
							initialTab={profileInitialTab}
						/>
					</div>
				</>
			)}
		</>
	);
};

export default HamburgerMenu;
