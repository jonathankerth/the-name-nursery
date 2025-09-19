"use client";
import { useRef } from "react";
import styles from "../app/page.module.css";

interface OriginOption {
	label: string;
	value: string;
}

interface OriginSelectionProps {
	selectedGender: "baby" | "girl" | "boy";
	selectedLetter: string;
	selectedPersonality: string;
	selectedInspiration: string;
	originIndex: number;
	setOriginIndex: (index: number | ((prev: number) => number)) => void;
	originOptions: OriginOption[];
	headerColor: string;
	wheelColor: string;
	onSkip: () => void;
}

export default function OriginSelection({
	selectedGender,
	selectedLetter,
	selectedPersonality,
	selectedInspiration,
	originIndex,
	setOriginIndex,
	originOptions,
	headerColor,
	wheelColor,
	onSkip,
}: OriginSelectionProps) {
	const originScrollRef = useRef<number>(0);
	const originTouchStartRef = useRef<number | null>(null);
	const originWheelRef = useRef<HTMLDivElement | null>(null);

	// Helper function to safely prevent default
	const safePreventDefault = (e: Event | React.SyntheticEvent) => {
		try {
			e.preventDefault();
		} catch {
			// Ignore passive event listener error on mobile
		}
	};

	const onOriginWheel = (e: React.WheelEvent) => {
		safePreventDefault(e);
		const now = Date.now();
		if (now - originScrollRef.current < 120) return;
		if (Math.abs(e.deltaY) < 5) return;
		originScrollRef.current = now;
		setOriginIndex(
			(i) =>
				(i + (e.deltaY > 0 ? 1 : -1) + originOptions.length) %
				originOptions.length
		);
	};

	const onOriginMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
	};

	const onOriginTouchStart = (e: React.TouchEvent) => {
		originTouchStartRef.current = e.touches[0].clientY;
		e.stopPropagation();
	};

	const onOriginTouchMove = (e: React.TouchEvent) => {
		e.stopPropagation();
	};

	const onOriginTouchEnd = (e: React.TouchEvent) => {
		if (originTouchStartRef.current == null) return;
		const endY = e.changedTouches[0].clientY;
		const delta = endY - originTouchStartRef.current;
		if (Math.abs(delta) > 20) {
			setOriginIndex(
				(i) =>
					(i + (delta > 0 ? -1 : 1) + originOptions.length) %
					originOptions.length
			);
			safePreventDefault(e);
		}
		originTouchStartRef.current = null;
		e.stopPropagation();
	};

	// Origin wheel display
	const topOrigin =
		originOptions[
			(originIndex - 1 + originOptions.length) % originOptions.length
		];
	const centerOrigin = originOptions[originIndex];
	const bottomOrigin = originOptions[(originIndex + 1) % originOptions.length];

	return (
		<div className={styles.multiStepContent}>
			<div className={styles.topRow} style={{ color: headerColor }}>
				<div className={styles.twoRowText}>
					<div className={styles.firstRow}>
						<span className={styles.selectedType}>
							{selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)}
						</span>{" "}
						names starting with {selectedLetter}
					</div>
					<div className={styles.secondRow}>
						for a baby who&apos;s {selectedPersonality} & inspired by{" "}
						{selectedInspiration}
					</div>
				</div>
			</div>

			<div className={styles.letterSelectionContent}>
				<div className={styles.phraseContainer}>
					<span className={styles.phrase}>
						<span className={styles.firstLine}>with</span>
					</span>
				</div>

				<div
					ref={originWheelRef}
					className={styles.wheelColumn}
					tabIndex={0}
					onWheel={onOriginWheel}
					onMouseDown={onOriginMouseDown}
					onTouchStart={onOriginTouchStart}
					onTouchMove={onOriginTouchMove}
					onTouchEnd={onOriginTouchEnd}
					role="listbox"
					aria-label="Select an origin source"
				>
					<div
						className={`${styles.wheelFaded} ${styles.wheelItem}`}
						style={{ color: wheelColor, cursor: "pointer" }}
						onClick={() =>
							setOriginIndex(
								(originIndex - 1 + originOptions.length) % originOptions.length
							)
						}
						title={`Select ${topOrigin.label}`}
					>
						{topOrigin.label}
					</div>
					<div
						className={`${styles.wheelCenter} ${styles.wheelItem}`}
						style={{ color: wheelColor, cursor: "pointer" }}
						onClick={() => setOriginIndex(originIndex)}
						title={`Select ${centerOrigin.label}`}
					>
						{centerOrigin.label}
					</div>
					<div
						className={`${styles.wheelFaded} ${styles.wheelItem}`}
						style={{ color: wheelColor, cursor: "pointer" }}
						onClick={() =>
							setOriginIndex((originIndex + 1) % originOptions.length)
						}
						title={`Select ${bottomOrigin.label}`}
					>
						{bottomOrigin.label}
					</div>
				</div>
				<div className={styles.phraseContainer}>
					<span className={styles.phrase}>
						<span className={styles.secondLine}>origin</span>
					</span>
				</div>
			</div>

			<button
				type="button"
				className={styles.moreSuggestionsButton}
				style={{
					color: headerColor,
					borderColor: headerColor,
				}}
				onClick={onSkip}
			>
				Skip
			</button>
		</div>
	);
}
