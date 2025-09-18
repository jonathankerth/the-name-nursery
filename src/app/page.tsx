"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
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
	const [selectedPersonality, setSelectedPersonality] = useState("");
	const [selectedInspiration, setSelectedInspiration] = useState("ocean");
	const [selectedOrigin, setSelectedOrigin] = useState("Celtic");
	const [recommendedNames, setRecommendedNames] = useState<string[]>([]);
	const [isAIGenerated, setIsAIGenerated] = useState(false);

	// New state for adjectives - initialize with fallback to prevent map error
	const [personalityAdjectives, setPersonalityAdjectives] = useState<string[]>([
		"strong",
		"gentle",
		"creative",
		"brave",
		"wise",
		"joyful",
		"calm",
		"spirited",
		"kind",
	]);

	const [loadingAdjectives, setLoadingAdjectives] = useState(false);

	// Helper function to safely prevent default
	const safePreventDefault = (e: Event | React.SyntheticEvent) => {
		try {
			e.preventDefault();
		} catch {
			// Ignore passive event listener error on mobile
		}
	};

	const genderOptions = useMemo(
		() => [
			{ label: "Baby", value: "baby", icon: "/icons/stroller_icon.png" },
			{ label: "Girl", value: "girl", icon: "/icons/raddle_icon.png" },
			{ label: "Boy", value: "boy", icon: "/icons/bear_icon.png" },
		],
		[]
	);
	const alphabet = useMemo(
		() => Array.from({ length: 26 }).map((_, i) => String.fromCharCode(65 + i)),
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
	const letterDragStartRef = useRef<number | null>(null);
	const letterIsDraggingRef = useRef<boolean>(false);

	// Inspiration selection state
	const [inspirationIndex, setInspirationIndex] = useState(0);
	const inspirationScrollRef = useRef<number>(0);
	const inspirationTouchStartRef = useRef<number | null>(null);
	const inspirationWheelRef = useRef<HTMLDivElement | null>(null);
	const inspirationDragStartRef = useRef<number | null>(null);
	const inspirationIsDraggingRef = useRef<boolean>(false);

	// Origin selection state
	const [originIndex, setOriginIndex] = useState(0);
	const originScrollRef = useRef<number>(0);
	const originTouchStartRef = useRef<number | null>(null);
	const originWheelRef = useRef<HTMLDivElement | null>(null);
	const originDragStartRef = useRef<number | null>(null);
	const originIsDraggingRef = useRef<boolean>(false);

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

	// Function to fetch adjectives from AI
	const fetchAdjectives = useCallback(async () => {
		console.log("fetchAdjectives called with:", {
			gender: selectedGender,
			letter: selectedLetter,
		});
		setLoadingAdjectives(true);
		try {
			const response = await fetch("/api/generate-adjectives", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					gender: selectedGender,
					letter: selectedLetter,
				}),
			});

			console.log("Response status:", response.status, response.statusText);

			if (!response.ok) {
				throw new Error(`Failed to fetch adjectives: ${response.status}`);
			}

			const data = await response.json();
			console.log("Response data:", data);
			const adjectives = Array.isArray(data.adjectives) ? data.adjectives : [];
			console.log("Setting adjectives to:", adjectives);
			setPersonalityAdjectives(adjectives);
		} catch (error) {
			console.error("Error fetching adjectives:", error);
			// Fallback adjectives
			const fallbackAdjectives = [
				"strong",
				"gentle",
				"creative",
				"brave",
				"wise",
				"joyful",
				"calm",
				"spirited",
				"kind",
			];
			console.log("Setting fallback adjectives:", fallbackAdjectives);
			setPersonalityAdjectives(fallbackAdjectives);
		} finally {
			setLoadingAdjectives(false);
		}
	}, [selectedGender, selectedLetter]);

	// Fetch adjectives when entering personality step
	useEffect(() => {
		console.log("Personality useEffect - currentStep:", currentStep);
		if (currentStep === "personality") {
			console.log("On personality step, fetching new adjectives...");
			fetchAdjectives();
		}
	}, [currentStep, fetchAdjectives]);

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
					const currentIdx = genderOptions.findIndex(
						(opt) => opt.value === selectedGender
					);
					const nextIdx = (currentIdx + 1) % genderOptions.length;
					setSelectedGender(
						genderOptions[nextIdx].value as "baby" | "girl" | "boy"
					);
				} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					const currentIdx = genderOptions.findIndex(
						(opt) => opt.value === selectedGender
					);
					const prevIdx =
						(currentIdx - 1 + genderOptions.length) % genderOptions.length;
					setSelectedGender(
						genderOptions[prevIdx].value as "baby" | "girl" | "boy"
					);
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
				if (e.key === "Enter" && selectedPersonality) {
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
		inspirationOptions.length,
		originOptions.length,
		genderOptions,
		selectedGender,
		selectedPersonality,
		fetchNameRecommendations,
	]);

	// Letter wheel handlers
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

	const onLetterMouseMove = useCallback(
		(e: MouseEvent) => {
			if (letterDragStartRef.current === null) return;

			const deltaY = e.clientY - letterDragStartRef.current;
			if (Math.abs(deltaY) > 10) {
				letterIsDraggingRef.current = true;
			}

			if (letterIsDraggingRef.current) {
				const dragThreshold = 30; // pixels per item
				const indexChange = Math.round(deltaY / dragThreshold);
				if (indexChange !== 0) {
					setLetterIndex((i) => {
						const newIndex =
							(i - indexChange + alphabet.length) % alphabet.length;
						letterDragStartRef.current = e.clientY; // Reset for continuous dragging
						return newIndex;
					});
				}
			}
		},
		[alphabet.length]
	);

	const onLetterMouseUp = useCallback(() => {
		letterDragStartRef.current = null;
		letterIsDraggingRef.current = false;
	}, []);

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

	// Elevator shaft ref and height calculation
	const elevatorShaftRef = useRef<HTMLDivElement>(null);

	const onInspirationWheel = (e: React.WheelEvent) => {
		safePreventDefault(e);
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

	const onInspirationMouseDown = (e: React.MouseEvent) => {
		inspirationDragStartRef.current = e.clientY;
		inspirationIsDraggingRef.current = false;
		e.preventDefault();
	};

	const onInspirationMouseMove = useCallback(
		(e: MouseEvent) => {
			if (inspirationDragStartRef.current === null) return;

			const deltaY = e.clientY - inspirationDragStartRef.current;
			if (Math.abs(deltaY) > 10) {
				inspirationIsDraggingRef.current = true;
			}

			if (inspirationIsDraggingRef.current) {
				const dragThreshold = 30; // pixels per item
				const indexChange = Math.round(deltaY / dragThreshold);
				if (indexChange !== 0) {
					setInspirationIndex((i) => {
						const newIndex =
							(i - indexChange + inspirationOptions.length) %
							inspirationOptions.length;
						inspirationDragStartRef.current = e.clientY; // Reset for continuous dragging
						return newIndex;
					});
				}
			}
		},
		[inspirationOptions.length]
	);

	const onInspirationMouseUp = useCallback(() => {
		inspirationDragStartRef.current = null;
		inspirationIsDraggingRef.current = false;
	}, []);

	const onInspirationTouchStart = (e: React.TouchEvent) => {
		inspirationTouchStartRef.current = e.touches[0].clientY;
		e.stopPropagation();
	};

	const onInspirationTouchMove = (e: React.TouchEvent) => {
		e.stopPropagation();
	};

	const onInspirationTouchEnd = (e: React.TouchEvent) => {
		if (inspirationTouchStartRef.current == null) return;
		const endY = e.changedTouches[0].clientY;
		const delta = endY - inspirationTouchStartRef.current;
		if (Math.abs(delta) > 20) {
			setInspirationIndex(
				(i) =>
					(i + (delta > 0 ? -1 : 1) + inspirationOptions.length) %
					inspirationOptions.length
			);
			safePreventDefault(e);
		}
		inspirationTouchStartRef.current = null;
		e.stopPropagation();
	};

	// Inspiration wheel handlers
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
		originDragStartRef.current = e.clientY;
		originIsDraggingRef.current = false;
		e.preventDefault();
	};

	const onOriginMouseMove = useCallback(
		(e: MouseEvent) => {
			if (originDragStartRef.current === null) return;

			const deltaY = e.clientY - originDragStartRef.current;
			if (Math.abs(deltaY) > 10) {
				originIsDraggingRef.current = true;
			}

			if (originIsDraggingRef.current) {
				const dragThreshold = 30; // pixels per item
				const indexChange = Math.round(deltaY / dragThreshold);
				if (indexChange !== 0) {
					setOriginIndex((i) => {
						const newIndex =
							(i - indexChange + originOptions.length) % originOptions.length;
						originDragStartRef.current = e.clientY; // Reset for continuous dragging
						return newIndex;
					});
				}
			}
		},
		[originOptions.length]
	);

	const onOriginMouseUp = useCallback(() => {
		originDragStartRef.current = null;
		originIsDraggingRef.current = false;
	}, []);

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
		setSelectedInspiration(inspirationOptions[inspirationIndex].value);
	}, [inspirationIndex, inspirationOptions]);

	useEffect(() => {
		setSelectedOrigin(originOptions[originIndex].value);
	}, [originIndex, originOptions]);

	// Document event listeners for mouse drag
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			onLetterMouseMove(e);
			onInspirationMouseMove(e);
			onOriginMouseMove(e);
		};

		const handleMouseUp = () => {
			onLetterMouseUp();
			onInspirationMouseUp();
			onOriginMouseUp();
		};

		// Global touch event handlers to prevent page scrolling when interacting with wheels
		const handleTouchMove = (e: TouchEvent) => {
			// Check if the touch is within a wheel element
			const target = e.target as HTMLElement;
			if (target && target.closest(".wheelColumn")) {
				e.preventDefault();
			}
		};

		const handleTouchStart = (e: TouchEvent) => {
			// Check if the touch is within a wheel element
			const target = e.target as HTMLElement;
			if (target && target.closest(".wheelColumn")) {
				e.preventDefault();
			}
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		document.addEventListener("touchstart", handleTouchStart, {
			passive: false,
		});

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchstart", handleTouchStart);
		};
	}, [
		onLetterMouseMove,
		onLetterMouseUp,
		onInspirationMouseMove,
		onInspirationMouseUp,
		onOriginMouseMove,
		onOriginMouseUp,
	]);

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
									{genderOptions.map((option) => (
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
												<span className={styles.genderButtonContent}>
													{option.label}
													<Image
														src={option.icon}
														alt={`${option.label} icon`}
														className={styles.genderIcon}
														width={34}
														height={34}
													/>
												</span>
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
									<span className={styles.genderLine}>
										<span
											className={styles.selectedType}
											style={{ color: headerColor }}
										>
											{selectedGender.charAt(0).toUpperCase() +
												selectedGender.slice(1)}
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
									onClick={() =>
										setLetterIndex((letterIndex + 1) % alphabet.length)
									}
									title={`Select ${bottomLetter}`}
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
							if (selectedPersonality) {
								trackStepProgression("personality", "inspiration");
								setCurrentStep("inspiration");
							}
						}}
						backLabel="Back"
						nextLabel="Next"
						nextDisabled={!selectedPersonality}
						buttonStyle={{
							borderColor: wheelColor,
							backgroundColor: pageColors[selectedGender],
							color: headerColor,
						}}
					>
						<div className={styles.personalityContent}>
							<div
								className={styles.personalityTopText}
								style={{ color: headerColor }}
							>
								<span className={styles.selectedType}>
									{selectedGender.charAt(0).toUpperCase() +
										selectedGender.slice(1)}
								</span>{" "}
								names starting with {selectedLetter}
							</div>

							<div
								className={styles.personalityPrompt}
								style={{ color: headerColor }}
							>
								Who is...
							</div>

							{loadingAdjectives ? (
								<div
									className={styles.loadingAdjectives}
									style={{ color: headerColor }}
								>
									Loading personality options...
								</div>
							) : (
								<div>
									{Array.isArray(personalityAdjectives) &&
									personalityAdjectives.length > 0 ? (
										<>
											<div className={styles.adjectiveGrid}>
												{personalityAdjectives.map((adjective) => (
													<button
														key={adjective}
														type="button"
														className={`${styles.adjectiveCard} ${
															selectedPersonality === adjective
																? styles.selected
																: ""
														}`}
														style={{
															color: headerColor,
															borderColor: headerColor,
														}}
														onClick={() => setSelectedPersonality(adjective)}
													>
														{adjective}
													</button>
												))}
											</div>

											<button
												type="button"
												className={styles.moreSuggestionsButton}
												style={{
													color: headerColor,
													borderColor: headerColor,
												}}
												onClick={fetchAdjectives}
											>
												More Suggestions
											</button>
										</>
									) : (
										<div
											className={styles.loadingAdjectives}
											style={{ color: headerColor }}
										>
											<button
												type="button"
												className={styles.moreSuggestionsButton}
												style={{
													color: headerColor,
													borderColor: headerColor,
												}}
												onClick={fetchAdjectives}
											>
												Load Personality Options
											</button>
										</div>
									)}
								</div>
							)}
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
							if (selectedInspiration) {
								trackStepProgression("inspiration", "origin");
								setCurrentStep("origin");
							}
						}}
						nextDisabled={!selectedInspiration}
						backLabel="Back"
						nextLabel="Next"
						buttonStyle={{
							borderColor: wheelColor,
							backgroundColor: pageColors[selectedGender],
							color: headerColor,
						}}
					>
						<div className={styles.personalityContent}>
							<div
								className={styles.personalityTopText}
								style={{ color: headerColor }}
							>
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
									onMouseDown={onInspirationMouseDown}
									onTouchStart={onInspirationTouchStart}
									onTouchMove={onInspirationTouchMove}
									onTouchEnd={onInspirationTouchEnd}
									role="listbox"
									aria-label="Select an inspiration source"
								>
									<div
										className={`${styles.wheelFaded} ${styles.wheelItem}`}
										style={{ color: wheelColor, cursor: "pointer" }}
										onClick={() =>
											setInspirationIndex(
												(inspirationIndex - 1 + inspirationOptions.length) %
													inspirationOptions.length
											)
										}
										title={`Select ${topInspiration.label}`}
									>
										{topInspiration.label}
									</div>
									<div
										className={`${styles.wheelCenter} ${styles.wheelItem}`}
										style={{ color: wheelColor, cursor: "pointer" }}
										onClick={() => setInspirationIndex(inspirationIndex)}
										title={`Select ${centerInspiration.label}`}
									>
										{centerInspiration.label}
									</div>
									<div
										className={`${styles.wheelFaded} ${styles.wheelItem}`}
										style={{ color: wheelColor, cursor: "pointer" }}
										onClick={() =>
											setInspirationIndex(
												(inspirationIndex + 1) % inspirationOptions.length
											)
										}
										title={`Select ${bottomInspiration.label}`}
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
												(originIndex - 1 + originOptions.length) %
													originOptions.length
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
