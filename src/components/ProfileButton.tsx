"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import Image from "next/image";
import AuthForms from "./AuthForms";
import styles from "./ProfileButton.module.css";

const ProfileButton = () => {
	const [showAuthForms, setShowAuthForms] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const { user, loading } = useAuth();
	const router = useRouter();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleAuthSuccess = () => {
		setShowAuthForms(false);
	};

	const openAuthForms = () => {
		setShowAuthForms(true);
	};

	const closeAuthForms = () => {
		setShowAuthForms(false);
	};

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (showAuthForms) {
			document.body.classList.add("modal-open");
		} else {
			document.body.classList.remove("modal-open");
		}

		// Cleanup on unmount
		return () => {
			document.body.classList.remove("modal-open");
		};
	}, [showAuthForms]);

	const goToProfile = () => {
		setShowDropdown(false);
		router.push("/profile");
	};

	const goToBlog = () => {
		setShowDropdown(false);
		router.push("/blog");
	};

	const goToExplore = () => {
		setShowDropdown(false);
		router.push("/explore");
	};

	const goToNamingGuide = () => {
		setShowDropdown(false);
		router.push("/naming-guide");
	};

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			setShowDropdown(false);
			router.push("/");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		};

		if (showDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	}, [showDropdown]);

	if (loading) {
		return null; // Don't show button while loading
	}

	return (
		<>
			{user ? (
				// Logged in user - show profile dropdown
				<div className={styles.profileDropdownContainer} ref={dropdownRef}>
					<button
						className={styles.profileButton}
						onClick={toggleDropdown}
						aria-label="Profile menu"
					>
						<Image
							src={user.photoURL || "/default-avatar.svg"}
							alt="Profile"
							className={styles.avatar}
							width={40}
							height={40}
						/>
						<span className={styles.profileText}>Profile</span>
						<span
							className={`${styles.dropdownArrow} ${
								showDropdown ? styles.open : ""
							}`}
						>
							▼
						</span>
					</button>

					{showDropdown && (
						<div className={styles.dropdownMenu}>
							<button className={styles.dropdownItem} onClick={goToProfile}>
								<span className={styles.dropdownIcon}>👤</span>
								View Profile
							</button>
							<button className={styles.dropdownItem} onClick={goToBlog}>
								<span className={styles.dropdownIcon}>📝</span>
								Blog
							</button>
							<button className={styles.dropdownItem} onClick={goToExplore}>
								<span className={styles.dropdownIcon}>🔍</span>
								Explore
							</button>
							<button className={styles.dropdownItem} onClick={goToNamingGuide}>
								<span className={styles.dropdownIcon}>📖</span>
								Naming Guide
							</button>
							<button className={styles.dropdownItem} onClick={handleSignOut}>
								<span className={styles.dropdownIcon}>🚪</span>
								Sign Out
							</button>
						</div>
					)}
				</div>
			) : (
				// Not logged in - show login/signup button
				<button
					className={styles.loginButton}
					onClick={openAuthForms}
					aria-label="Sign in or sign up"
				>
					<span className={styles.loginText}>Login / Sign Up</span>
				</button>
			)}

			{/* Auth Forms Modal */}
			{showAuthForms && (
				<div className={styles.modalOverlay} onClick={closeAuthForms}>
					<div
						className={styles.modalContainer}
						onClick={(e) => e.stopPropagation()}
					>
						<AuthForms onClose={closeAuthForms} onSuccess={handleAuthSuccess} />
					</div>
				</div>
			)}
		</>
	);
};

export default ProfileButton;
