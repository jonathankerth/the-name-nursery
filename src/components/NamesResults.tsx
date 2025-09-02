import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addLikedName, removeLikedName, isNameLiked } from "../lib/likedNames";
import AuthForms from "./AuthForms";
import styles from "./NamesResults.module.css";

interface NamesResultsProps {
	names: string[];
	gender: string;
	letter: string;
	onBack: () => void;
	isAIGenerated?: boolean;
}

export default function NamesResults({
	names,
	gender,
	letter,
	onBack,
	isAIGenerated = true,
}: NamesResultsProps) {
	const { user } = useAuth();
	const [likedNames, setLikedNames] = useState<Set<string>>(new Set());
	const [loadingLikes, setLoadingLikes] = useState<Set<string>>(new Set());
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [hoveredName, setHoveredName] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Load liked status for all names when component mounts
	useEffect(() => {
		if (!user) return;

		const checkLikedStatus = async () => {
			const likedSet = new Set<string>();

			for (const name of names) {
				const liked = await isNameLiked(user.uid, name);
				if (liked) {
					likedSet.add(name);
				}
			}

			setLikedNames(likedSet);
		};

		checkLikedStatus();
	}, [user, names]);

	// Check if device is mobile
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (tooltipTimeoutRef.current) {
				clearTimeout(tooltipTimeoutRef.current);
			}
		};
	}, []);

	const handleLikeToggle = async (name: string) => {
		if (!user) {
			setShowAuthModal(true);
			return;
		}

		setLoadingLikes((prev) => new Set(prev).add(name));

		try {
			const isLiked = likedNames.has(name);

			if (isLiked) {
				const success = await removeLikedName(user.uid, name);
				if (success) {
					setLikedNames((prev) => {
						const newSet = new Set(prev);
						newSet.delete(name);
						return newSet;
					});
				}
			} else {
				const success = await addLikedName(
					user.uid,
					name,
					gender,
					letter,
					isAIGenerated
				);
				if (success) {
					setLikedNames((prev) => new Set(prev).add(name));
				}
			}
		} catch {
			// Handle error silently
		} finally {
			setLoadingLikes((prev) => {
				const newSet = new Set(prev);
				newSet.delete(name);
				return newSet;
			});
		}
	};

	const handleAuthSuccess = () => {
		setShowAuthModal(false);
		// Reload liked status after successful auth
		window.location.reload();
	};

	const handleNameClick = () => {
		if (!user) {
			if (isMobile) {
				// On mobile - show tooltip with click-to-signin
				setHoveredName("mobile-tooltip");
				// Clear any existing timeout
				if (tooltipTimeoutRef.current) {
					clearTimeout(tooltipTimeoutRef.current);
				}
				// Set new timeout
				tooltipTimeoutRef.current = setTimeout(
					() => setHoveredName(null),
					15000
				);
			} else {
				// Desktop - show modal immediately
				setShowAuthModal(true);
			}
		}
	};

	const handleNameHover = (name: string, isHovering: boolean) => {
		if (!user && !isMobile) {
			setHoveredName(isHovering ? name : null);
		}
	};

	const handleCloseTooltip = () => {
		// Clear any existing timeout when manually closing
		if (tooltipTimeoutRef.current) {
			clearTimeout(tooltipTimeoutRef.current);
			tooltipTimeoutRef.current = null;
		}
		setHoveredName(null);
	};

	const handleTooltipClick = () => {
		// Clicking anywhere on tooltip (except close button) opens auth modal
		handleCloseTooltip();
		setShowAuthModal(true);
	};

	// Calculate the same header color used in the Header component
	const pageColors = {
		baby: "#EFD9AA",
		boy: "#B7E9F0",
		girl: "#EDD5EB",
	};

	const darken = (hex: string, amount = 0.22) => {
		const c = hex.replace("#", "");
		const r = parseInt(c.substring(0, 2), 16);
		const g = parseInt(c.substring(2, 4), 16);
		const b = parseInt(c.substring(4, 6), 16);
		const dr = Math.max(0, Math.round(r * (1 - amount)));
		const dg = Math.max(0, Math.round(g * (1 - amount)));
		const db = Math.max(0, Math.round(b * (1 - amount)));
		const toHex = (v: number) => v.toString(16).padStart(2, "0");
		return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
	};

	const headerColor = darken(
		pageColors[gender as keyof typeof pageColors] || "#111827",
		0.22
	);
	return (
		<div className={styles.container}>
			<button
				className={styles.backButton}
				type="button"
				aria-label="Back to letter selection"
				onClick={onBack}
			>
				<svg
					width="36"
					height="36"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<polygon points="24,4 4,16 24,28" fill="currentColor" />
				</svg>
			</button>

			<div className={styles.content}>
				<div className={styles.header}>
					<h1 className={styles.title} style={{ color: headerColor }}>
						{gender.charAt(0).toUpperCase() + gender.slice(1)} names starting
						with {letter}
					</h1>
					{isAIGenerated && (
						<p className={styles.subtitle} style={{ color: headerColor }}>
							✨ AI-curated recommendations just for you
						</p>
					)}
				</div>

				<div className={styles.namesGrid}>
					{names.map((name, index) => (
						<div
							key={index}
							className={`${styles.nameCard} ${
								!user ? styles.nameCardUnauth : ""
							}`}
							onClick={handleNameClick}
							onMouseEnter={() => handleNameHover(name, true)}
							onMouseLeave={() => handleNameHover(name, false)}
						>
							<span className={styles.nameName}>{name}</span>
							{user && (
								<button
									className={`${styles.likeButton} ${
										likedNames.has(name) ? styles.liked : ""
									}`}
									onClick={(e) => {
										e.stopPropagation();
										handleLikeToggle(name);
									}}
									disabled={loadingLikes.has(name)}
									aria-label={
										likedNames.has(name)
											? `Remove ${name} from favorites`
											: `Add ${name} to favorites`
									}
								>
									{loadingLikes.has(name) ? (
										<span className={styles.spinner}>⟳</span>
									) : likedNames.has(name) ? (
										"❤️"
									) : (
										"🤍"
									)}
								</button>
							)}
						</div>
					))}
				</div>

				{/* Global tooltip - renders above everything */}
				{!user && hoveredName && (
					<div className={styles.tooltip} onClick={handleCloseTooltip}>
						<div className={styles.tooltipContent} onClick={handleTooltipClick}>
							<button
								className={styles.tooltipClose}
								onClick={(e) => {
									e.stopPropagation();
									handleCloseTooltip();
								}}
								aria-label="Close tooltip"
							>
								×
							</button>
							<strong>Sign in to save names!</strong>
							<p>
								Create an account to save your favorite names and unlock more
								features
							</p>
							{isMobile && (
								<p
									style={{
										marginTop: "0.5rem",
										fontSize: "0.8rem",
										opacity: 0.8,
									}}
								>
									Tap here to sign in
								</p>
							)}
						</div>
					</div>
				)}

				<div className={styles.actions}>
					<button
						className={styles.actionButton}
						onClick={() => window.location.reload()}
					>
						Get New Names
					</button>
				</div>
			</div>

			{/* Auth Modal for unauthenticated users */}
			{showAuthModal && (
				<>
					<div
						className={styles.modalOverlay}
						onClick={() => setShowAuthModal(false)}
					></div>
					<div className={styles.modalContainer}>
						<AuthForms
							onClose={() => setShowAuthModal(false)}
							onSuccess={handleAuthSuccess}
						/>
					</div>
				</>
			)}
		</div>
	);
}
