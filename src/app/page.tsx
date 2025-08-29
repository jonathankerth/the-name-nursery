"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "./page.module.css";
import Header from "../components/Header";
import FloatingRestart from "../components/FloatingRestart";

type Step = "gender" | "letter" | "results";

export default function Home() {
	const [currentStep, setCurrentStep] = useState<Step>("gender");
	const [selectedGender, setSelectedGender] = useState<"baby" | "girl" | "boy">("baby");
	const [selectedLetter, setSelectedLetter] = useState("A");

	const options = useMemo(
		() => [
			{ label: "Baby", value: "baby" },
			{ label: "Girl", value: "girl" },
			{ label: "Boy", value: "boy" },
		],
		[]
	);

	const alphabet = useMemo(
		() => Array.from({ length: 26 }).map((_, i) => String.fromCharCode(65 + i)),
		[]
	);

	// Wheel effect logic for gender selection
	const selectedIndex = options.findIndex((opt) => opt.value === selectedGender);
	const lastScrollRef = useRef<number>(0);
	const touchStartRef = useRef<number | null>(null);
	const wheelRef = useRef<HTMLDivElement | null>(null);

	// Letter selection state
	const [letterIndex, setLetterIndex] = useState(0);
	const letterScrollRef = useRef<number>(0);
	const letterTouchStartRef = useRef<number | null>(null);
	const letterWheelRef = useRef<HTMLDivElement | null>(null);

	const pageColors = useMemo(() => ({
		baby: "#EFD9AA",
		boy: "#B7E9F0",
		girl: "#EDD5EB",
	}), []);

	// Restart function to reset all data
	const handleRestart = useCallback(() => {
		setCurrentStep("gender");
		setSelectedGender("baby");
		setSelectedLetter("A");
		setLetterIndex(0);
		// Reset background to baby color
		try {
			if (document.documentElement) {
				document.documentElement.style.setProperty("--background", pageColors.baby);
			}
		} catch {
			// noop in non-browser contexts
		}
	}, [pageColors.baby]);

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

	const wheelColor = darken(pageColors[selectedGender] || "#111827", 0.22);
	const headerColor = darken(pageColors[selectedGender] || "#111827", 0.35);

	// Update background color and selected letter when step changes
	useEffect(() => {
		const bg = pageColors[selectedGender] || "#ffffff";
		try {
			if (document.documentElement) {
				document.documentElement.style.setProperty("--background", bg);
			}
		} catch {
			// noop in non-browser contexts
		}
		setSelectedLetter(alphabet[letterIndex]);
	}, [selectedGender, letterIndex, alphabet, pageColors]);

	const changeGender = useCallback((delta: number) => {
		const idx = options.findIndex((opt) => opt.value === selectedGender);
		const newIdx = (idx + delta + options.length) % options.length;
		setSelectedGender(options[newIdx].value as "baby" | "girl" | "boy");
	}, [selectedGender, options]);

	// Keyboard handlers
	useEffect(() => {
		const onGlobalKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (target) {
				const tag = target.tagName;
				const editable =
					target.getAttribute &&
					target.getAttribute("contenteditable") === "true";
				if (tag === "INPUT" || tag === "TEXTAREA" || editable) return;
			}

			if (currentStep === "gender") {
				if (e.key === "ArrowDown" || e.key === "ArrowRight") {
					e.preventDefault();
					changeGender(1);
				} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					changeGender(-1);
				} else if (e.key === "Enter") {
					e.preventDefault();
					setCurrentStep("letter");
				}
			} else if (currentStep === "letter") {
				if (e.key === "ArrowDown" || e.key === "ArrowRight") {
					e.preventDefault();
					setLetterIndex((i) => (i + 1) % alphabet.length);
				} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					setLetterIndex((i) => (i - 1 + alphabet.length) % alphabet.length);
				} else if (e.key === "Enter") {
					e.preventDefault();
					setCurrentStep("results");
				} else if (e.key === "Escape" || e.key === "Backspace") {
					e.preventDefault();
					setCurrentStep("gender");
				}
			} else if (currentStep === "results") {
				if (e.key === "Escape" || e.key === "Backspace") {
					e.preventDefault();
					setCurrentStep("letter");
				}
			}
		};
		window.addEventListener("keydown", onGlobalKey);
		return () => window.removeEventListener("keydown", onGlobalKey);
	}, [currentStep, alphabet.length, changeGender]);

	// Gender wheel handlers
	const onGenderWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const now = Date.now();
		if (now - lastScrollRef.current < 150) return;
		if (Math.abs(e.deltaY) < 5) return;
		lastScrollRef.current = now;
		changeGender(e.deltaY > 0 ? 1 : -1);
	};

	const onGenderTouchStart = (e: React.TouchEvent) => {
		touchStartRef.current = e.touches[0].clientY;
		e.preventDefault(); // Prevent scrolling
	};

	const onGenderTouchEnd = (e: React.TouchEvent) => {
		if (touchStartRef.current == null) return;
		const endY = e.changedTouches[0].clientY;
		const delta = endY - touchStartRef.current;
		if (Math.abs(delta) > 20) { // Reduced threshold for easier mobile interaction
			changeGender(delta > 0 ? -1 : 1);
		}
		touchStartRef.current = null;
		e.preventDefault();
	};

	// Letter wheel handlers
	const onLetterWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const now = Date.now();
		if (now - letterScrollRef.current < 120) return;
		if (Math.abs(e.deltaY) < 5) return;
		letterScrollRef.current = now;
		setLetterIndex(
			(i) => (i + (e.deltaY > 0 ? 1 : -1) + alphabet.length) % alphabet.length
		);
	};

	const onLetterTouchStart = (e: React.TouchEvent) => {
		letterTouchStartRef.current = e.touches[0].clientY;
		e.preventDefault(); // Prevent scrolling
	};

	const onLetterTouchEnd = (e: React.TouchEvent) => {
		if (letterTouchStartRef.current == null) return;
		const endY = e.changedTouches[0].clientY;
		const delta = endY - letterTouchStartRef.current;
		if (Math.abs(delta) > 20) // Reduced threshold for easier mobile interaction
			setLetterIndex(
				(i) => (i + (delta > 0 ? -1 : 1) + alphabet.length) % alphabet.length
			);
		letterTouchStartRef.current = null;
		e.preventDefault();
	};

	// Wheel order for gender selection
	const getWheelOrder = () => {
		if (selectedIndex === 0) return [2, 0, 1]; // Baby selected
		if (selectedIndex === 1) return [0, 1, 2]; // Girl selected
		return [1, 2, 0]; // Boy selected
	};

	// Letter wheel display
	const topLetter = alphabet[(letterIndex - 1 + alphabet.length) % alphabet.length];
	const centerLetter = alphabet[letterIndex];
	const bottomLetter = alphabet[(letterIndex + 1) % alphabet.length];

	return (
		<div
			className={styles.page}
			style={{ background: pageColors[selectedGender] || undefined }}
		>
			<Header type={selectedGender} />
			<main className={styles.centerMain}>
				{currentStep === "gender" && (
					<form
						className={styles.sentenceForm}
						onSubmit={(e) => {
							e.preventDefault();
							setCurrentStep("letter");
						}}
					>
						<span className={styles.fixedA}>A</span>
						<div
							ref={wheelRef}
							className={styles.wheelColumn}
							onWheel={onGenderWheel}
							onTouchStart={onGenderTouchStart}
							onTouchEnd={onGenderTouchEnd}
							tabIndex={0}
							role="listbox"
							aria-label="Name type selector"
						>
							<div
								className={styles.wheelOptionFaded}
								style={{ color: wheelColor }}
							>
								{options[getWheelOrder()[0]].label}
							</div>
							<div
								className={styles.wheelOptionSelected}
								style={{ color: wheelColor }}
							>
								{options[getWheelOrder()[1]].label}
							</div>
							<div
								className={styles.wheelOptionFaded}
								style={{ color: wheelColor }}
							>
								{options[getWheelOrder()[2]].label}
							</div>
						</div>
						<span className={styles.fixedName}>Name</span>
						<button
							type="submit"
							className={styles.triangleBtn}
							aria-label="Continue to letter selection"
						>
							<svg
								width="32"
								height="32"
								viewBox="0 0 32 32"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<polygon points="8,4 28,16 8,28" fill={wheelColor} />
							</svg>
						</button>
					</form>
				)}

				{currentStep === "letter" && (
					<form
						className={styles.sentenceForm}
						onSubmit={(e) => {
							e.preventDefault();
							setCurrentStep("results");
						}}
					>
						<button
							className={styles.backTriangle}
							type="button"
							aria-label="Back to gender selection"
							onClick={() => setCurrentStep("gender")}
						>
							<svg
								width="36"
								height="36"
								viewBox="0 0 32 32"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<polygon points="24,4 4,16 24,28" fill={wheelColor} />
							</svg>
						</button>

						<div className={styles.letterSelectionContent}>
							<div className={styles.phraseContainer}>
								<span className={styles.phrase}>
									<span
										className={styles.selectedType}
										style={{ color: headerColor }}
									>
										{selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)}
									</span>{" "}
									names starting with
								</span>
							</div>

							<div
								ref={letterWheelRef}
								className={styles.wheelColumn}
								tabIndex={0}
								onWheel={onLetterWheel}
								onTouchStart={onLetterTouchStart}
								onTouchEnd={onLetterTouchEnd}
								role="listbox"
								aria-label="Select a starting letter"
							>
								<div className={styles.wheelFaded} style={{ color: wheelColor }}>
									{topLetter}
								</div>
								<div className={styles.wheelCenter} style={{ color: wheelColor }}>
									{centerLetter}
								</div>
								<div className={styles.wheelFaded} style={{ color: wheelColor }}>
									{bottomLetter}
								</div>
							</div>
						</div>

						<button
							className={styles.triangleBtn}
							aria-label="See results"
							type="submit"
						>
							<svg
								width="36"
								height="36"
								viewBox="0 0 32 32"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<polygon points="8,4 28,16 8,28" fill={wheelColor} />
							</svg>
						</button>
					</form>
				)}

				{currentStep === "results" && (
					<div className={styles.resultsContainer}>
						<button
							className={styles.backTriangle}
							type="button"
							aria-label="Back to letter selection"
							onClick={() => setCurrentStep("letter")}
						>
							<svg
								width="36"
								height="36"
								viewBox="0 0 32 32"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<polygon points="24,4 4,16 24,28" fill={wheelColor} />
							</svg>
						</button>
						<div className={styles.resultsCard}>
							<h2>
								{selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)} names starting with {selectedLetter}
							</h2>
							<p>Coming soon! We&apos;re working on showing matching names — stay tuned.</p>
						</div>
					</div>
				)}
			</main>
			<FloatingRestart 
				show={currentStep !== "gender"} 
				onRestart={handleRestart} 
			/>
		</div>
	);
}
