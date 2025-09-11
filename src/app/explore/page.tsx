"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { addLikedName } from "../../lib/likedNames";
import styles from "./explore.module.css";

type Gender = "boy" | "girl" | "baby";

interface NameCard {
	id: string;
	name: string;
	gender: Gender;
}

const GENDERS: { value: Gender; label: string; emoji: string }[] = [
	{ value: "boy", label: "Boys", emoji: "👦" },
	{ value: "girl", label: "Girls", emoji: "👧" },
	{ value: "baby", label: "Gender-Neutral", emoji: "🍼" },
];

export default function ExplorePage() {
	const router = useRouter();
	const { user } = useAuth();
	const [currentGender, setCurrentGender] = useState<Gender>("baby");
	const [names, setNames] = useState<NameCard[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);

	const cardRef = useRef<HTMLDivElement>(null);
	const startX = useRef<number>(0);
	const startY = useRef<number>(0);
	const currentX = useRef<number>(0);
	const currentY = useRef<number>(0);
	const isDragging = useRef<boolean>(false);

	// Generate session ID for tracking
	const sessionId = useRef(
		`explore_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
	);

	// Generate names using OpenAI API
	const generateNames = useCallback(async (gender: Gender, existingNames: string[] = []) => {
		try {
			setIsGenerating(true);
			const response = await fetch("/api/recommend-names", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					gender,
					letter: "", // Empty letter for explore mode
					personality: "",
					inspiration: "",
					origin: "",
					existingNames,
					exploreMode: true, // Flag to indicate explore mode
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to generate names");
			}

			const data = await response.json();
			return data.names || [];
		} catch (error) {
			console.error("Error generating names:", error);
			return [];
		} finally {
			setIsGenerating(false);
		}
	}, []);

	// Load initial names
	const loadInitialNames = useCallback(async (gender: Gender) => {
		setIsLoading(true);
		const newNames = await generateNames(gender);

		const nameCards: NameCard[] = newNames.map((name: string, index: number) => ({
			id: `${gender}_${Date.now()}_${index}`,
			name,
			gender,
		}));

		setNames(nameCards);
		setCurrentIndex(0);
		setIsLoading(false);
	}, [generateNames]);

	// Load more names when running low
	const loadMoreNames = useCallback(async () => {
		if (isGenerating) return;

		const existingNames = names.map(card => card.name);
		const newNames = await generateNames(currentGender, existingNames);

		if (newNames.length > 0) {
			const nameCards: NameCard[] = newNames.map((name: string, index: number) => ({
				id: `${currentGender}_${Date.now()}_${names.length + index}`,
				name,
				gender: currentGender,
			}));

			setNames(prev => [...prev, ...nameCards]);
		}
	}, [currentGender, names, generateNames, isGenerating]);

	// Handle swipe/save action
	const handleSwipe = useCallback(async (direction: "left" | "right") => {
		if (isAnimating) return;

		setIsAnimating(true);
		setSwipeDirection(direction);

		// If swiping right, save the name
		if (direction === "right" && user && names[currentIndex]) {
			const currentName = names[currentIndex];
			await addLikedName(
				user.uid,
				currentName.name,
				currentName.gender,
				"", // No specific letter for explore mode
				false, // Not AI generated in the traditional sense
				sessionId.current,
				navigator.userAgent
			);
		}

		// Move to next card after animation
		setTimeout(() => {
			setCurrentIndex(prev => prev + 1);
			setSwipeDirection(null);
			setIsAnimating(false);
		}, 300);
	}, [currentIndex, names, user, isAnimating]);

	// Touch event handlers
	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		if (isAnimating) return;

		const touch = e.touches[0];
		startX.current = touch.clientX;
		startY.current = touch.clientY;
		currentX.current = touch.clientX;
		currentY.current = touch.clientY;
		isDragging.current = true;
	}, [isAnimating]);

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		if (!isDragging.current || isAnimating) return;

		const touch = e.touches[0];
		currentX.current = touch.clientX;
		currentY.current = touch.clientY;

		e.preventDefault();
	}, [isAnimating]);

	const handleTouchEnd = useCallback(() => {
		if (!isDragging.current || isAnimating) return;

		const deltaX = currentX.current - startX.current;
		const deltaY = currentY.current - startY.current;
		const absDeltaX = Math.abs(deltaX);
		const absDeltaY = Math.abs(deltaY);

		// Only trigger swipe if horizontal movement is greater than vertical
		if (absDeltaX > absDeltaY && absDeltaX > 50) {
			if (deltaX > 0) {
				handleSwipe("right");
			} else {
				handleSwipe("left");
			}
		}

		isDragging.current = false;
	}, [handleSwipe, isAnimating]);

	// Mouse event handlers for desktop
	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		if (isAnimating) return;

		startX.current = e.clientX;
		startY.current = e.clientY;
		currentX.current = e.clientX;
		currentY.current = e.clientY;
		isDragging.current = true;

		e.preventDefault();
	}, [isAnimating]);

	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		if (!isDragging.current || isAnimating) return;

		currentX.current = e.clientX;
		currentY.current = e.clientY;

		e.preventDefault();
	}, [isAnimating]);

	const handleMouseUp = useCallback(() => {
		if (!isDragging.current || isAnimating) return;

		const deltaX = currentX.current - startX.current;
		const deltaY = currentY.current - startY.current;
		const absDeltaX = Math.abs(deltaX);
		const absDeltaY = Math.abs(deltaY);

		// Only trigger swipe if horizontal movement is greater than vertical
		if (absDeltaX > absDeltaY && absDeltaX > 50) {
			if (deltaX > 0) {
				handleSwipe("right");
			} else {
				handleSwipe("left");
			}
		}

		isDragging.current = false;
	}, [handleSwipe, isAnimating]);

	// Keyboard handlers
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (isAnimating) return;

			if (e.key === "ArrowLeft") {
				e.preventDefault();
				handleSwipe("left");
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				handleSwipe("right");
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [handleSwipe, isAnimating]);

	// Load initial names when gender changes
	useEffect(() => {
		loadInitialNames(currentGender);
	}, [currentGender, loadInitialNames]);

	// Load more names when running low
	useEffect(() => {
		const remainingNames = names.length - currentIndex;
		if (remainingNames <= 5 && !isGenerating && names.length > 0) {
			loadMoreNames();
		}
	}, [currentIndex, names.length, loadMoreNames, isGenerating]);

	// Calculate card transform based on drag
	const getCardTransform = () => {
		if (!isDragging.current || isAnimating) return "";

		const deltaX = currentX.current - startX.current;
		const deltaY = currentY.current - startY.current;
		const rotate = deltaX * 0.1;

		return `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;
	};

	const currentCard = names[currentIndex];
	const nextCard = names[currentIndex + 1];

	return (
		<div className={styles.exploreContainer}>
			{/* Header */}
			<div className={styles.header}>
				<button
					className={styles.backButton}
					onClick={() => router.push("/profile")}
					aria-label="Back to profile"
				>
					← Back
				</button>
				<h1 className={styles.title}>Explore Names</h1>
				<div className={styles.spacer}></div>
			</div>

			{/* Gender Selector */}
			<div className={styles.genderSelector}>
				{GENDERS.map((gender) => (
					<button
						key={gender.value}
						className={`${styles.genderButton} ${
							currentGender === gender.value ? styles.active : ""
						}`}
						onClick={() => setCurrentGender(gender.value)}
						disabled={isLoading}
					>
						<span className={styles.emoji}>{gender.emoji}</span>
						<span className={styles.label}>{gender.label}</span>
					</button>
				))}
			</div>

			{/* Main Content */}
			<div className={styles.content}>
				{isLoading ? (
					<div className={styles.loading}>
						<div className={styles.spinner}></div>
						<p>Loading {currentGender} names...</p>
					</div>
				) : currentCard ? (
					<div className={styles.cardContainer}>
						{/* Next Card (Background) */}
						{nextCard && (
							<div className={styles.cardWrapper}>
								<div className={`${styles.card} ${styles.nextCard}`}>
									<div className={styles.cardContent}>
										<h2 className={styles.cardName}>{nextCard.name}</h2>
										<div className={styles.cardGender}>
											{nextCard.gender === "boy" ? "👦" : nextCard.gender === "girl" ? "👧" : "🍼"}
											{nextCard.gender}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Current Card */}
						<div
							ref={cardRef}
							className={`${styles.cardWrapper} ${isAnimating ? styles.animating : ""} ${
								swipeDirection === "left" ? styles.swipeLeft : ""
							} ${swipeDirection === "right" ? styles.swipeRight : ""}`}
							style={{
								transform: getCardTransform(),
							}}
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseUp}
						>
							<div className={styles.card}>
								<div className={styles.cardContent}>
									<h2 className={styles.cardName}>{currentCard.name}</h2>
									<div className={styles.cardGender}>
										{currentCard.gender === "boy" ? "👦" : currentCard.gender === "girl" ? "👧" : "🍼"}
										{currentCard.gender}
									</div>
								</div>

								{/* Action Buttons */}
								<div className={styles.cardActions}>
									<button
										className={`${styles.actionButton} ${styles.dislikeButton}`}
										onClick={(e) => {
											e.stopPropagation();
											handleSwipe("left");
										}}
										aria-label="Skip this name"
									>
										✕
									</button>
									<button
										className={`${styles.actionButton} ${styles.likeButton}`}
										onClick={(e) => {
											e.stopPropagation();
											handleSwipe("right");
										}}
										aria-label="Save this name"
									>
										❤️
									</button>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className={styles.emptyState}>
						<h2>No more names to explore!</h2>
						<p>Try changing the gender or come back later for more names.</p>
						<button
							className={styles.refreshButton}
							onClick={() => loadInitialNames(currentGender)}
						>
							🔄 Refresh
						</button>
					</div>
				)}
			</div>

			{/* Instructions */}
			<div className={styles.instructions}>
				<p>
					{user
						? "Swipe right to save ❤️, left to skip ✕"
						: "Sign in to save your favorite names! For now, just swipe to explore."
					}
				</p>
				<p className={styles.keyboardHint}>
					Use arrow keys ← → or click the buttons
				</p>
			</div>

			{/* Loading indicator for generating more names */}
			{isGenerating && (
				<div className={styles.generatingIndicator}>
					<div className={styles.miniSpinner}></div>
					<span>Generating more names...</span>
				</div>
			)}
		</div>
	);
}
