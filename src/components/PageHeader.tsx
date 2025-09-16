"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProfileButton from "./ProfileButton";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
	title?: string;
	showProfileButton?: boolean;
	showBackButton?: boolean;
	backButtonText?: string;
	backButtonPath?: string;
	className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
	title = "The Name Nursery",
	showProfileButton = true,
	showBackButton = false,
	backButtonText = "← Back",
	backButtonPath = "/",
	className = "",
}) => {
	const router = useRouter();

	const handleTitleClick = () => {
		router.push("/");
	};

	const handleBackClick = () => {
		router.push(backButtonPath);
	};

	return (
		<header className={`${styles.pageHeader} ${className}`}>
			{showProfileButton && <ProfileButton />}

			{showBackButton && (
				<button
					className={styles.backButton}
					onClick={handleBackClick}
					aria-label={`Navigate back to ${
						backButtonPath === "/" ? "home" : backButtonPath
					}`}
				>
					{backButtonText}
				</button>
			)}

			<button
				className={styles.titleButton}
				onClick={handleTitleClick}
				aria-label="Go to home page"
			>
				<h1 className={styles.title}>{title}</h1>
			</button>
		</header>
	);
};

export default PageHeader;
