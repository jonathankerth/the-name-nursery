"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "./page.module.css";
import Header from "../components/Header";
import LoadingNames from "../components/LoadingNames";
import NamesResults from "../components/NamesResults";
import NavigationLayout from "../components/NavigationLayout";
import ProfileButton from "../components/ProfileButton";
import {
	trackNameSearch,
	trackNameView,
	trackStepProgression,
} from "../lib/gtag";

type Step =
	| "gender"
	| "letter"
	| "personality"
	| "inspiration"
	| "origin"
	| "loading"
	| "results";

export default function Home() {
	const [currentStep, setCurrentStep] = useState<Step>("gender");
	const [selectedGender, setSelectedGender] = useState<"baby" | "girl" | "boy">(
		"baby"
	);
	const [selectedLetter, setSelectedLetter] = useState("A");
	const [selectedPersonality, setSelectedPersonality] = useState("strong");
	const [selectedInspiration, setSelectedInspiration] = useState("nature");
	const [selectedOrigin, setSelectedOrigin] = useState("Celtic");
	const [recommendedNames, setRecommendedNames] = useState<string[]>([]);
	const [isAIGenerated, setIsAIGenerated] = useState(false);

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

	const personalityOptions = useMemo(
		() => [
			{ label: "strong", value: "strong" },
			{ label: "gentle", value: "gentle" },
			{ label: "modern", value: "modern" },
			{ label: "classic", value: "classic" },
			{ label: "unique", value: "unique" },
			{ label: "elegant", value: "elegant" },
			{ label: "playful", value: "playful" },
		],
		[]
	);

	const inspirationOptions = useMemo(
		() => [
			{ label: "nature", value: "nature" },
			{ label: "virtues", value: "virtues" },
			{ label: "flowers", value: "flowers" },
			{ label: "gemstones", value: "gemstones" },
			{ label: "colors", value: "colors" },
			{ label: "seasons", value: "seasons" },
			{ label: "stars", value: "stars" },
		],
		[]
	);

	const originOptions = useMemo(
		() => [
			{ label: "Celtic", value: "Celtic" },
			{ label: "Latin", value: "Latin" },
			{ label: "Hebrew", value: "Hebrew" },
			{ label: "Greek", value: "Greek" },
			{ label: "Norse", value: "Norse" },
			{ label: "Arabic", value: "Arabic" },
			{ label: "Sanskrit", value: "Sanskrit" },
		],
		[]
	);

	// Letter selection state
	const [letterIndex, setLetterIndex] = useState(0);
	const letterScrollRef = useRef<number>(0);
	const letterTouchStartRef = useRef<number | null>(null);
	const letterWheelRef = useRef<HTMLDivElement | null>(null);

	// Personality selection state
	const [personalityIndex, setPersonalityIndex] = useState(0);
	const personalityScrollRef = useRef<number>(0);
	const personalityTouchStartRef = useRef<number | null>(null);
	const personalityWheelRef = useRef<HTMLDivElement | null>(null);

	// Inspiration selection state
	const [inspirationIndex, setInspirationIndex] = useState(0);
	const inspirationScrollRef = useRef<number>(0);
	const inspirationTouchStartRef = useRef<number | null>(null);
	const inspirationWheelRef = useRef<HTMLDivElement | null>(null);

	// Origin selection state
	const [originIndex, setOriginIndex] = useState(0);
	const originScrollRef = useRef<number>(0);
	const originTouchStartRef = useRef<number | null>(null);
	const originWheelRef = useRef<HTMLDivElement | null>(null);

	const pageColors = useMemo(
		() => ({
			baby: "#d3f3c8",
			boy: "#B7E9F0",
			girl: "#EDD5EB",
		}),
		[]
	);

	// Function to fetch name recommendations
	const fetchNameRecommendations = useCallback(async () => {
		setCurrentStep("loading");
		trackStepProgression("origin", "loading");
		trackNameSearch(selectedGender, selectedLetter);

		try {
			const response = await fetch("/api/recommend-names", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					gender: selectedGender,
					letter: selectedLetter,
					personality: selectedPersonality,
					inspiration: selectedInspiration,
					origin: selectedOrigin,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch recommendations");
			}

			const data = await response.json();
			setRecommendedNames(data.names || []);
			setIsAIGenerated(!data.fallback);
			setCurrentStep("results");
			trackStepProgression("loading", "results");
			trackNameView(selectedGender, selectedLetter, !data.fallback);
		} catch {
			// Fallback to some default names
			const fallbackNames =
				selectedGender === "baby"
					? [
							"Alex",
							"Avery",
							"Casey",
							"Jordan",
							"Morgan",
							"Quinn",
							"Riley",
							"Sage",
							"Taylor",
							"River",
					  ]
					: selectedGender === "girl"
					? [
							"Ava",
							"Alice",
							"Anna",
							"Amy",
							"Aria",
							"Aurora",
							"Abigail",
							"Addison",
							"Aubrey",
							"Andrea",
					  ]
					: [
							"Alexander",
							"Andrew",
							"Anthony",
							"Adrian",
							"Aaron",
							"Adam",
							"Austin",
							"Antonio",
							"Abraham",
							"Axel",
					  ];

			const filteredNames = fallbackNames.filter((name) =>
				name.toLowerCase().startsWith(selectedLetter.toLowerCase())
			);

			setRecommendedNames(
				filteredNames.length > 0
					? filteredNames.slice(0, 10)
					: fallbackNames.slice(0, 10)
			);
			setIsAIGenerated(false);
			setCurrentStep("results");
			trackStepProgression("loading", "results");
			trackNameView(selectedGender, selectedLetter, false);
		}
	}, [
		selectedGender,
		selectedLetter,
		selectedPersonality,
		selectedInspiration,
		selectedOrigin,
	]);

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

	const handleNamesUpdate = useCallback((newNames: string[]) => {
		setRecommendedNames(newNames);
	}, []);

	const wheelColor = darken(pageColors[selectedGender] || "#111827", 0.5);
	const headerColor = darken(pageColors[selectedGender] || "#111827", 0.6);

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
					const currentIdx = options.findIndex(
						(opt) => opt.value === selectedGender
					);
					const nextIdx = (currentIdx + 1) % options.length;
					setSelectedGender(options[nextIdx].value as "baby" | "girl" | "boy");
				} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					const currentIdx = options.findIndex(
						(opt) => opt.value === selectedGender
					);
					const prevIdx = (currentIdx - 1 + options.length) % options.length;
					setSelectedGender(options[prevIdx].value as "baby" | "girl" | "boy");
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
					trackStepProgression("letter", "personality");
					setCurrentStep("personality");
				} else if (e.key === "Escape" || e.key === "Backspace") {
					e.preventDefault();
					setCurrentStep("gender");
				}
			} else if (currentStep === "personality") {
				if (e.key === "ArrowDown" || e.key === "ArrowRight") {
					e.preventDefault();
					setPersonalityIndex((i) => (i + 1) % personalityOptions.length);
				} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					setPersonalityIndex(
						(i) =>
							(i - 1 + personalityOptions.length) % personalityOptions.length
					);
				} else if (e.key === "Enter") {
					e.preventDefault();
					trackStepProgression("personality", "inspiration");
					setCurrentStep("inspiration");
				} else if (e.key === "Escape" || e.key === "Backspace") {
					e.preventDefault();
					setCurrentStep("letter");
				}
			} else if (currentStep === "inspiration") {
				if (e.key === "ArrowDown" || e.key === "ArrowRight") {
					e.preventDefault();
					setInspirationIndex((i) => (i + 1) % inspirationOptions.length);
				} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					setInspirationIndex(
						(i) =>
							(i - 1 + inspirationOptions.length) % inspirationOptions.length
					);
				} else if (e.key === "Enter") {
					e.preventDefault();
					trackStepProgression("inspiration", "origin");
					setCurrentStep("origin");
				} else if (e.key === "Escape" || e.key === "Backspace") {
					e.preventDefault();
					setCurrentStep("personality");
				}
			} else if (currentStep === "origin") {
				if (e.key === "ArrowDown" || e.key === "ArrowRight") {
					e.preventDefault();
					setOriginIndex((i) => (i + 1) % originOptions.length);
				} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					setOriginIndex(
						(i) => (i - 1 + originOptions.length) % originOptions.length
					);
				} else if (e.key === "Enter") {
					e.preventDefault();
					fetchNameRecommendations();
				} else if (e.key === "Escape" || e.key === "Backspace") {
					e.preventDefault();
					setCurrentStep("inspiration");
				}
			} else if (currentStep === "results") {
				if (e.key === "Escape" || e.key === "Backspace") {
					e.preventDefault();
					setCurrentStep("origin");
				}
			}
		};
		window.addEventListener("keydown", onGlobalKey);
		return () => window.removeEventListener("keydown", onGlobalKey);
	}, [
		currentStep,
		alphabet.length,
		personalityOptions.length,
		inspirationOptions.length,
		originOptions.length,
		options,
		selectedGender,
		fetchNameRecommendations,
	]);

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
		if (Math.abs(delta) > 20)
			// Reduced threshold for easier mobile interaction
			setLetterIndex(
				(i) => (i + (delta > 0 ? -1 : 1) + alphabet.length) % alphabet.length
			);
		letterTouchStartRef.current = null;
		e.preventDefault();
	};

	// Elevator shaft ref and height calculation
	const elevatorShaftRef = useRef<HTMLDivElement>(null); // Personality wheel handlers
	const onPersonalityWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const now = Date.now();
		if (now - personalityScrollRef.current < 120) return;
		if (Math.abs(e.deltaY) < 5) return;
		personalityScrollRef.current = now;
		setPersonalityIndex(
			(i) =>
				(i + (e.deltaY > 0 ? 1 : -1) + personalityOptions.length) %
				personalityOptions.length
		);
	};

	const onPersonalityTouchStart = (e: React.TouchEvent) => {
		personalityTouchStartRef.current = e.touches[0].clientY;
		e.preventDefault();
	};

	const onPersonalityTouchEnd = (e: React.TouchEvent) => {
		if (personalityTouchStartRef.current == null) return;
		const endY = e.changedTouches[0].clientY;
		const delta = endY - personalityTouchStartRef.current;
		if (Math.abs(delta) > 20)
			setPersonalityIndex(
				(i) =>
					(i + (delta > 0 ? -1 : 1) + personalityOptions.length) %
					personalityOptions.length
			);
		personalityTouchStartRef.current = null;
		e.preventDefault();
	};

	const onInspirationWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const now = Date.now();
		if (now - inspirationScrollRef.current < 120) return;
		if (Math.abs(e.deltaY) < 5) return;
		inspirationScrollRef.current = now;
		setInspirationIndex(
			(i) =>
				(i + (e.deltaY > 0 ? 1 : -1) + inspirationOptions.length) %
				inspirationOptions.length
		);
	};

	const onInspirationTouchStart = (e: React.TouchEvent) => {
		inspirationTouchStartRef.current = e.touches[0].clientY;
		e.preventDefault();
	};

	const onInspirationTouchEnd = (e: React.TouchEvent) => {
		if (inspirationTouchStartRef.current == null) return;
		const endY = e.changedTouches[0].clientY;
		const delta = endY - inspirationTouchStartRef.current;
		if (Math.abs(delta) > 20)
			setInspirationIndex(
				(i) =>
					(i + (delta > 0 ? -1 : 1) + inspirationOptions.length) %
					inspirationOptions.length
			);
		inspirationTouchStartRef.current = null;
		e.preventDefault();
	};

	// Inspiration wheel handlers
	const onOriginWheel = (e: React.WheelEvent) => {
		e.preventDefault();
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

	const onOriginTouchStart = (e: React.TouchEvent) => {
		originTouchStartRef.current = e.touches[0].clientY;
		e.preventDefault();
	};

	const onOriginTouchEnd = (e: React.TouchEvent) => {
		if (originTouchStartRef.current == null) return;
		const endY = e.changedTouches[0].clientY;
		const delta = endY - originTouchStartRef.current;
		if (Math.abs(delta) > 20)
			setOriginIndex(
				(i) =>
					(i + (delta > 0 ? -1 : 1) + originOptions.length) %
					originOptions.length
			);
		originTouchStartRef.current = null;
		e.preventDefault();
	};

	// Letter wheel display
	const topLetter =
		alphabet[(letterIndex - 1 + alphabet.length) % alphabet.length];
	const centerLetter = alphabet[letterIndex];
	const bottomLetter = alphabet[(letterIndex + 1) % alphabet.length];

	// Update selected values when wheel indices change
	useEffect(() => {
		setSelectedLetter(alphabet[letterIndex]);
	}, [letterIndex, alphabet]);

	useEffect(() => {
		setSelectedPersonality(personalityOptions[personalityIndex].value);
	}, [personalityIndex, personalityOptions]);

	useEffect(() => {
		setSelectedInspiration(inspirationOptions[inspirationIndex].value);
	}, [inspirationIndex, inspirationOptions]);

	useEffect(() => {
		setSelectedOrigin(originOptions[originIndex].value);
	}, [originIndex, originOptions]);

	// Personality wheel display
	const topPersonality =
		personalityOptions[
			(personalityIndex - 1 + personalityOptions.length) %
				personalityOptions.length
		];
	const centerPersonality = personalityOptions[personalityIndex];
	const bottomPersonality =
		personalityOptions[(personalityIndex + 1) % personalityOptions.length];

	// Inspiration wheel display
	const topInspiration =
		inspirationOptions[
			(inspirationIndex - 1 + inspirationOptions.length) %
				inspirationOptions.length
		];
	const centerInspiration = inspirationOptions[inspirationIndex];
	const bottomInspiration =
		inspirationOptions[(inspirationIndex + 1) % inspirationOptions.length];

	// Origin wheel display
	const topOrigin =
		originOptions[
			(originIndex - 1 + originOptions.length) % originOptions.length
		];
	const centerOrigin = originOptions[originIndex];
	const bottomOrigin = originOptions[(originIndex + 1) % originOptions.length];

	return (
		<div
			className={styles.page}
			style={{ background: pageColors[selectedGender] || undefined }}
		>
			<ProfileButton />
			<Header
				type={selectedGender}
				showRestartButton={currentStep === "results"}
			/>
			<main className={styles.centerMain}>
				{currentStep === "gender" && (
					<NavigationLayout
						onNext={() => {
							trackStepProgression("gender", "letter");
							setCurrentStep("letter");
						}}
						showBack={false}
						nextLabel="Next"
						buttonStyle={{
							borderColor: wheelColor,
							backgroundColor: pageColors[selectedGender],
							color: headerColor,
						}}
					>
						<div className={styles.genderElevator}>
							<div className={styles.elevatorShaft} ref={elevatorShaftRef}>
								<div className={styles.elevatorFloors}>
									{options.map((option) => (
										<div
											key={option.value}
											className={`${styles.genderRow} ${
												selectedGender === option.value
													? styles.genderRowSelected
													: styles.genderRowUnselected
											}`}
										>
											{selectedGender === option.value && (
												<span className={styles.elevatorText}>A</span>
											)}
											<button
												type="button"
												className={`${styles.genderOption} ${
													selectedGender === option.value
														? styles.genderOptionSelected
														: styles.genderOptionUnselected
												}`}
												onClick={() =>
													setSelectedGender(
														option.value as "baby" | "girl" | "boy"
													)
												}
											>
												{option.label}
											</button>
											{selectedGender === option.value && (
												<span className={styles.elevatorText}>Name</span>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</NavigationLayout>
				)}{" "}
				{currentStep === "letter" && (
					<NavigationLayout
						onBack={() => {
							trackStepProgression("letter", "gender");
							setCurrentStep("gender");
						}}
						onNext={() => {
							trackStepProgression("letter", "personality");
							setCurrentStep("personality");
						}}
						backLabel="Back"
						nextLabel="Next"
						buttonStyle={{
							borderColor: wheelColor,
							backgroundColor: pageColors[selectedGender],
							color: headerColor,
						}}
					>
						<div className={styles.letterSelectionContent}>
							<div className={styles.phraseContainer}>
								<span className={styles.phrase}>
									<span className={styles.firstLine}>
										<span
											className={styles.selectedType}
											style={{ color: headerColor }}
										>
											{selectedGender.charAt(0).toUpperCase() +
												selectedGender.slice(1)}
										</span>{" "}
										names
									</span>
									<span className={styles.secondLine}>starting with</span>
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
								<div
									className={styles.wheelFaded}
									style={{ color: wheelColor }}
								>
									{topLetter}
								</div>
								<div
									className={styles.wheelCenter}
									style={{ color: wheelColor }}
								>
									{centerLetter}
								</div>
								<div
									className={styles.wheelFaded}
									style={{ color: wheelColor }}
								>
									{bottomLetter}
								</div>
							</div>
						</div>
					</NavigationLayout>
				)}
				{currentStep === "personality" && (
					<NavigationLayout
						onBack={() => {
							trackStepProgression("personality", "letter");
							setCurrentStep("letter");
						}}
						onNext={() => {
							trackStepProgression("personality", "inspiration");
							setCurrentStep("inspiration");
						}}
						backLabel="Back"
						nextLabel="Next"
						buttonStyle={{
							borderColor: wheelColor,
							backgroundColor: pageColors[selectedGender],
							color: headerColor,
						}}
					>
						<div className={styles.multiStepContent}>
							<div className={styles.topRow} style={{ color: headerColor }}>
								<span className={styles.selectedType}>
									{selectedGender.charAt(0).toUpperCase() +
										selectedGender.slice(1)}
								</span>{" "}
								names starting with {selectedLetter} for a baby
							</div>

							<div className={styles.letterSelectionContent}>
								<div className={styles.phraseContainer}>
									<span className={styles.phrase}>
										<span className={styles.firstLine}>who is</span>
									</span>
								</div>

								<div
									ref={personalityWheelRef}
									className={styles.wheelColumn}
									tabIndex={0}
									onWheel={onPersonalityWheel}
									onTouchStart={onPersonalityTouchStart}
									onTouchEnd={onPersonalityTouchEnd}
									role="listbox"
									aria-label="Select a personality trait"
								>
									<div
										className={styles.wheelFaded}
										style={{ color: wheelColor }}
									>
										{topPersonality.label}
									</div>
									<div
										className={styles.wheelCenter}
										style={{ color: wheelColor }}
									>
										{centerPersonality.label}
									</div>
									<div
										className={styles.wheelFaded}
										style={{ color: wheelColor }}
									>
										{bottomPersonality.label}
									</div>
								</div>
							</div>
						</div>
					</NavigationLayout>
				)}
				{currentStep === "inspiration" && (
					<NavigationLayout
						onBack={() => {
							trackStepProgression("inspiration", "personality");
							setCurrentStep("personality");
						}}
						onNext={() => {
							trackStepProgression("inspiration", "origin");
							setCurrentStep("origin");
						}}
						backLabel="Back"
						nextLabel="Next"
						buttonStyle={{
							borderColor: wheelColor,
							backgroundColor: pageColors[selectedGender],
							color: headerColor,
						}}
					>
						<div className={styles.multiStepContent}>
							<div className={styles.topRow} style={{ color: headerColor }}>
								<span className={styles.selectedType}>
									{selectedGender.charAt(0).toUpperCase() +
										selectedGender.slice(1)}
								</span>{" "}
								names starting with {selectedLetter} for a baby who is{" "}
								{selectedPersonality}
							</div>

							<div className={styles.letterSelectionContent}>
								<div className={styles.phraseContainer}>
									<span className={styles.phrase}>
										<span className={styles.firstLine}>& inspired</span>
										<span className={styles.secondLine}>by</span>
									</span>
								</div>

								<div
									ref={inspirationWheelRef}
									className={styles.wheelColumn}
									tabIndex={0}
									onWheel={onInspirationWheel}
									onTouchStart={onInspirationTouchStart}
									onTouchEnd={onInspirationTouchEnd}
									role="listbox"
									aria-label="Select an inspiration source"
								>
									<div
										className={styles.wheelFaded}
										style={{ color: wheelColor }}
									>
										{topInspiration.label}
									</div>
									<div
										className={styles.wheelCenter}
										style={{ color: wheelColor }}
									>
										{centerInspiration.label}
									</div>
									<div
										className={styles.wheelFaded}
										style={{ color: wheelColor }}
									>
										{bottomInspiration.label}
									</div>
								</div>
							</div>
						</div>
					</NavigationLayout>
				)}
				{currentStep === "origin" && (
					<NavigationLayout
						onBack={() => {
							trackStepProgression("origin", "inspiration");
							setCurrentStep("inspiration");
						}}
						onNext={fetchNameRecommendations}
						backLabel="Back"
						nextLabel="Next"
						buttonStyle={{
							borderColor: wheelColor,
							backgroundColor: pageColors[selectedGender],
							color: headerColor,
						}}
					>
						<div className={styles.multiStepContent}>
							<div className={styles.topRow} style={{ color: headerColor }}>
								<div className={styles.twoRowText}>
									<div className={styles.firstRow}>
										<span className={styles.selectedType}>
											{selectedGender.charAt(0).toUpperCase() +
												selectedGender.slice(1)}
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
									onTouchStart={onOriginTouchStart}
									onTouchEnd={onOriginTouchEnd}
									role="listbox"
									aria-label="Select an origin source"
								>
									<div
										className={styles.wheelFaded}
										style={{ color: wheelColor }}
									>
										{topOrigin.label}
									</div>
									<div
										className={styles.wheelCenter}
										style={{ color: wheelColor }}
									>
										{centerOrigin.label}
									</div>
									<div
										className={styles.wheelFaded}
										style={{ color: wheelColor }}
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
						</div>
					</NavigationLayout>
				)}
				{currentStep === "loading" && (
					<LoadingNames
						gender={selectedGender}
						letter={selectedLetter}
						personality={selectedPersonality}
						inspiration={selectedInspiration}
						origin={selectedOrigin}
					/>
				)}
				{currentStep === "results" && (
					<NamesResults
						names={recommendedNames}
						gender={selectedGender}
						letter={selectedLetter}
						personality={selectedPersonality}
						inspiration={selectedInspiration}
						origin={selectedOrigin}
						onBack={() => setCurrentStep("origin")}
						isAIGenerated={isAIGenerated}
						onNamesUpdate={handleNamesUpdate}
					/>
				)}
			</main>
		</div>
	);
}
