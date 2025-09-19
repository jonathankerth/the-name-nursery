"use client";
import { useRef } from "react";
import styles from "../app/page.module.css";

interface LetterSelectionProps {
	selectedGender: "baby" | "girl" | "boy";
	letterIndex: number;
	setLetterIndex: (index: number | ((prev: number) => number)) => void;
	alphabet: string[];
	headerColor: string;
	wheelColor: string;
}

export default function LetterSelection({
	selectedGender,
	letterIndex,
	setLetterIndex,
	alphabet,
	headerColor,
	wheelColor,
}: LetterSelectionProps) {
	const letterScrollRef = useRef<number>(0);
	const letterTouchStartRef = useRef<number | null>(null);
	const letterWheelRef = useRef<HTMLDivElement | null>(null);
	const letterDragStartRef = useRef<number | null>(null);
	const letterIsDraggingRef = useRef<boolean>(false);

	// Helper function to safely prevent default
	const safePreventDefault = (e: Event | React.SyntheticEvent) => {
		try {
			e.preventDefault();
		} catch {
			// Ignore passive event listener error on mobile
		}
	};

	const onLetterWheel = (e: React.WheelEvent) => {
		safePreventDefault(e);
		const now = Date.now();
		if (now - letterScrollRef.current < 120) return;
		if (Math.abs(e.deltaY) < 5) return;
		letterScrollRef.current = now;
		setLetterIndex(
			(i) => (i + (e.deltaY > 0 ? 1 : -1) + alphabet.length) % alphabet.length
		);
	};

	const onLetterMouseDown = (e: React.MouseEvent) => {
		letterDragStartRef.current = e.clientY;
		letterIsDraggingRef.current = false;
		e.preventDefault();
	};

	const onLetterTouchStart = (e: React.TouchEvent) => {
		letterTouchStartRef.current = e.touches[0].clientY;
		e.stopPropagation();
	};

	const onLetterTouchMove = (e: React.TouchEvent) => {
		e.stopPropagation();
	};

	const onLetterTouchEnd = (e: React.TouchEvent) => {
		if (letterTouchStartRef.current == null) return;
		const endY = e.changedTouches[0].clientY;
		const delta = endY - letterTouchStartRef.current;
		if (Math.abs(delta) > 20) {
			setLetterIndex(
				(i) => (i + (delta > 0 ? -1 : 1) + alphabet.length) % alphabet.length
			);
			safePreventDefault(e);
		}
		letterTouchStartRef.current = null;
		e.stopPropagation();
	};

	// Letter wheel display
	const topLetter =
		alphabet[(letterIndex - 1 + alphabet.length) % alphabet.length];
	const centerLetter = alphabet[letterIndex];
	const bottomLetter = alphabet[(letterIndex + 1) % alphabet.length];

	return (
		<div className={styles.letterSelectionContent}>
			<div className={styles.phraseContainer}>
				<span className={styles.phrase}>
					<span className={styles.genderLine}>
						<span
							className={styles.selectedType}
							style={{ color: headerColor }}
						>
							{selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)}
						</span>{" "}
						names
					</span>
					<span className={styles.startingWithLine}>starting with</span>
				</span>
			</div>{" "}
			<div
				ref={letterWheelRef}
				className={styles.wheelColumn}
				tabIndex={0}
				onWheel={onLetterWheel}
				onMouseDown={onLetterMouseDown}
				onTouchStart={onLetterTouchStart}
				onTouchMove={onLetterTouchMove}
				onTouchEnd={onLetterTouchEnd}
				role="listbox"
				aria-label="Select a starting letter"
			>
				<div
					className={`${styles.wheelFaded} ${styles.wheelItem}`}
					style={{ color: wheelColor, cursor: "pointer" }}
					onClick={() =>
						setLetterIndex(
							(letterIndex - 1 + alphabet.length) % alphabet.length
						)
					}
					title={`Select ${topLetter}`}
				>
					{topLetter}
				</div>
				<div
					className={`${styles.wheelCenter} ${styles.wheelItem}`}
					style={{ color: wheelColor, cursor: "pointer" }}
					onClick={() => setLetterIndex(letterIndex)}
					title={`Select ${centerLetter}`}
				>
					{centerLetter}
				</div>
				<div
					className={`${styles.wheelFaded} ${styles.wheelItem}`}
					style={{ color: wheelColor, cursor: "pointer" }}
					onClick={() => setLetterIndex((letterIndex + 1) % alphabet.length)}
					title={`Select ${bottomLetter}`}
				>
					{bottomLetter}
				</div>
			</div>
		</div>
	);
}
