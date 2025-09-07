"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Image from "next/image";
import AuthForms from "./AuthForms";
import styles from "./ProfileButton.module.css";

const ProfileButton = () => {
	const [showAuthForms, setShowAuthForms] = useState(false);
	const { user, loading } = useAuth();
	const router = useRouter();

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
		router.push("/profile");
	};

	if (loading) {
		return null; // Don't show button while loading
	}

	return (
		<>
			{user ? (
				// Logged in user - show profile button
				<button
					className={styles.profileButton}
					onClick={goToProfile}
					aria-label="View profile and liked names"
				>
					<Image
						src={user.photoURL || "/default-avatar.svg"}
						alt="Profile"
						className={styles.avatar}
						width={40}
						height={40}
					/>
					<span className={styles.profileText}>Profile</span>
				</button>
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
