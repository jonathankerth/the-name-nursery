import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addLikedName, removeLikedName, isNameLiked } from "../lib/likedNames";
import AuthForms from "./AuthForms";
import styles from "./NamesResults.module.css";

interface NamesResultsProps {
	names: string[];
	gender: string;
	letter: string;
	personality: string;
	inspiration: string;
	origin: string;
	onBack: () => void;
	isAIGenerated?: boolean;
	onNamesUpdate?: (newNames: string[]) => void;
}

export default function NamesResults({
	names,
	gender,
	letter,
	personality,
	inspiration,
	origin,
	onBack,
	isAIGenerated = true,
	onNamesUpdate,
}: NamesResultsProps) {
	const { user } = useAuth();
	const [likedNames, setLikedNames] = useState<Set<string>>(new Set());
	const [loadingLikes, setLoadingLikes] = useState<Set<string>>(new Set());
	const [flippedCard, setFlippedCard] = useState<number | null>(null);
	const [showAuthForms, setShowAuthForms] = useState(false);
	const [refreshCount, setRefreshCount] = useState(0);
	const [isGeneratingMore, setIsGeneratingMore] = useState(false);
	const [showLimitNotification, setShowLimitNotification] = useState(false);

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

	const handleLikeToggle = async (name: string) => {
		if (!user) {
			// Show sign-up popup for non-logged-in users
			setShowAuthForms(true);
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
					isAIGenerated,
					sessionStorage.getItem("sessionId") || undefined,
					navigator.userAgent
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

	const handleNameClick = (index: number) => {
		if (!user) {
			// Toggle flip for this specific card
			setFlippedCard(flippedCard === index ? null : index);
		}
	};

	const openAuthForms = () => {
		setShowAuthForms(true);
		setFlippedCard(null); // Close any flipped cards
	};

	const closeAuthForms = () => {
		setShowAuthForms(false);
	};

	const handleAuthSuccess = () => {
		setShowAuthForms(false);
		setFlippedCard(null); // Close any flipped cards
	};

	const handleGenerateMore = async () => {
		if (refreshCount >= 5) {
			setShowLimitNotification(true);
			setTimeout(() => setShowLimitNotification(false), 5000);
			return;
		}

		setIsGeneratingMore(true);
		try {
			const response = await fetch("/api/recommend-names", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					gender,
					letter,
					personality,
					inspiration,
					origin,
					existingNames: names,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to generate more names");
			}

			const data = await response.json();
			const newNames = data.names;

			// Filter out any duplicates that might have slipped through
			const existingNamesSet = new Set(names.map((name) => name.toLowerCase()));
			const filteredNewNames = newNames
				.filter((name: string) => !existingNamesSet.has(name.toLowerCase()))
				.slice(0, 10); // Ensure we only add 10 new names

			// Update the names list
			const updatedNames = [...names, ...filteredNewNames];
			if (onNamesUpdate) {
				onNamesUpdate(updatedNames);
			}

			// Increment refresh count
			setRefreshCount((prev) => prev + 1);
		} catch (error) {
			console.error("Error generating more names:", error);
		} finally {
			setIsGeneratingMore(false);
		}
	};

	const headerColor = (() => {
		// Calculate the same header color used in the Header component
		const pageColors = {
			baby: "#d3f3c8",
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

		return darken(
			pageColors[gender as keyof typeof pageColors] || "#111827",
			0.6
		);
	})();

	const cardBackgroundColor = (() => {
		// Calculate darker version for card backgrounds
		const pageColors = {
			baby: "#d3f3c8",
			boy: "#B7E9F0",
			girl: "#EDD5EB",
		};

		const darken = (hex: string, amount = 0.4) => {
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

		return darken(
			pageColors[gender as keyof typeof pageColors] || "#111827",
			0.5
		);
	})();
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
					<h1
						className={styles.title}
						style={{
							color: headerColor,
							whiteSpace: "nowrap",
							wordBreak: "keep-all",
							display: "inline-block",
							overflow: "visible",
						}}
					>
						{gender.charAt(0).toUpperCase() + gender.slice(1)} names starting
						with {letter}
					</h1>
					<p className={styles.subtitle} style={{ color: headerColor }}>
						<span className={styles.subtitleSpan}>
							<span style={{ fontWeight: "normal" }}>For a </span>
							<span style={{ fontWeight: "bold" }}>{personality}</span>
							<span style={{ fontWeight: "normal" }}> baby inspired by </span>
							<span style={{ fontWeight: "bold" }}>{inspiration}</span>
							<span style={{ fontWeight: "normal" }}> with </span>
							<span style={{ fontWeight: "bold" }}>{origin}</span>
							<span style={{ fontWeight: "normal" }}> origin</span>
						</span>
					</p>
					{isAIGenerated && (
						<p className={styles.subtitle} style={{ color: headerColor }}>
							<span style={{ fontWeight: "normal" }}>✨ </span>
							<span style={{ fontWeight: "bold" }}>AI-curated</span>
							<span style={{ fontWeight: "normal" }}>
								{" "}
								recommendations just for you
							</span>
						</p>
					)}
				</div>

				<div className={styles.namesGrid}>
					{names.map((name, index) => (
						<div
							key={index}
							className={`${styles.nameCard} ${
								flippedCard === index ? styles.nameCardFlipped : ""
							}`}
							onClick={() => (user ? null : handleNameClick(index))}
							style={{ backgroundColor: cardBackgroundColor }}
						>
							{flippedCard === index ? (
								// Flipped side - sign up message
								<div className={styles.cardFlipContent}>
									<div className={styles.signUpMessage}>
										<h3>💖 Save Your Favorites!</h3>
										<p>Sign in to save baby names you love</p>
										<button
											className={styles.signUpButton}
											onClick={(e) => {
												e.stopPropagation();
												openAuthForms();
											}}
										>
											Sign Up Free
										</button>
										<button
											className={styles.backButton}
											onClick={(e) => {
												e.stopPropagation();
												setFlippedCard(null);
											}}
										>
											← Back
										</button>
									</div>
								</div>
							) : (
								// Normal side - name and like button
								<>
									<span className={styles.nameName}>{name}</span>
									<button
										className={`${styles.likeButton} ${
											user && likedNames.has(name) ? styles.liked : ""
										}`}
										onClick={(e) => {
											e.stopPropagation();
											handleLikeToggle(name);
										}}
										disabled={!!user && loadingLikes.has(name)}
										aria-label={
											user && likedNames.has(name)
												? `Remove ${name} from favorites`
												: `Add ${name} to favorites`
										}
									>
										{user && loadingLikes.has(name) ? (
											<span className={styles.spinner}>⟳</span>
										) : user && likedNames.has(name) ? (
											"Saved"
										) : (
											"Save"
										)}
									</button>
								</>
							)}
						</div>
					))}
				</div>

				<div className={styles.actions}>
					<button
						className={styles.actionButton}
						onClick={handleGenerateMore}
						disabled={isGeneratingMore}
					>
						{isGeneratingMore ? "Generating..." : "Generate More"}
					</button>
					<button
						className={styles.actionButton}
						onClick={() => window.location.reload()}
					>
						Start Over
					</button>
				</div>

				{showLimitNotification && (
					<div className={styles.notification}>
						<p>
							Non-subscribed users can only generate more names 5 times per
							search. Consider subscribing for unlimited generations!
						</p>
					</div>
				)}
			</div>

			{/* Auth Forms Modal */}
			{showAuthForms && (
				<>
					<div className={styles.modalOverlay} onClick={closeAuthForms}></div>
					<div className={styles.modalContainer}>
						<AuthForms onClose={closeAuthForms} onSuccess={handleAuthSuccess} />
					</div>
				</>
			)}
		</div>
	);
}
