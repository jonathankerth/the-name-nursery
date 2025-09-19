"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "./page.module.css";
import Header from "../components/Header";
import LoadingNames from "../components/LoadingNames";
import NamesResults from "../components/NamesResults";
import NavigationLayout from "../components/NavigationLayout";
import ProfileButton from "../components/ProfileButton";
import GenderSelection from "../components/GenderSelection";
import LetterSelection from "../components/LetterSelection";
import PersonalitySelection from "../components/PersonalitySelection";
import InspirationSelection from "../components/InspirationSelection";
import OriginSelection from "../components/OriginSelection";
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

	const genderOptions = useMemo(
		() => [
			{
				label: "Baby",
				value: "baby" as const,
				icon: "/icons/stroller_icon.png",
			},
			{ label: "Girl", value: "girl" as const, icon: "/icons/raddle_icon.png" },
			{ label: "Boy", value: "boy" as const, icon: "/icons/bear_icon.png" },
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

	// Origin selection state
	const [originIndex, setOriginIndex] = useState(0);

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

	const handleSkipOrigin = useCallback(() => {
		// Set a default origin (first option) and proceed to generate names
		setSelectedOrigin(originOptions[0].value);
		fetchNameRecommendations();
	}, [originOptions, fetchNameRecommendations]);

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
					const currentIdx = inspirationOptions.findIndex(
						(opt) => opt.value === selectedInspiration
					);
					const nextIdx = (currentIdx + 1) % inspirationOptions.length;
					setSelectedInspiration(inspirationOptions[nextIdx].value);
				} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					const currentIdx = inspirationOptions.findIndex(
						(opt) => opt.value === selectedInspiration
					);
					const prevIdx =
						(currentIdx - 1 + inspirationOptions.length) % inspirationOptions.length;
					setSelectedInspiration(inspirationOptions[prevIdx].value);
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
		inspirationOptions,
		originOptions.length,
		genderOptions,
		selectedGender,
		selectedPersonality,
		selectedInspiration,
		fetchNameRecommendations,
	]);

	// Elevator shaft ref and height calculation
	const elevatorShaftRef = useRef<HTMLDivElement>(null);

	// Update selected values when wheel indices change
	useEffect(() => {
		setSelectedLetter(alphabet[letterIndex]);
	}, [letterIndex, alphabet]);

	useEffect(() => {
		setSelectedOrigin(originOptions[originIndex].value);
	}, [originIndex, originOptions]);

	// Document event listeners for mouse drag
	useEffect(() => {
		const handleMouseMove = () => {
			// Wheel handling moved to individual components
		};

		const handleMouseUp = () => {
			// Wheel handling moved to individual components
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
	}, []);

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
						<GenderSelection
							genderOptions={genderOptions}
							selectedGender={selectedGender}
							setSelectedGender={setSelectedGender}
							ref={elevatorShaftRef}
						/>
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
						<LetterSelection
							selectedGender={selectedGender}
							letterIndex={letterIndex}
							setLetterIndex={setLetterIndex}
							alphabet={alphabet}
							headerColor={headerColor}
							wheelColor={wheelColor}
						/>
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
						<PersonalitySelection
							selectedGender={selectedGender}
							selectedLetter={selectedLetter}
							selectedPersonality={selectedPersonality}
							setSelectedPersonality={setSelectedPersonality}
							personalityAdjectives={personalityAdjectives}
							loadingAdjectives={loadingAdjectives}
							fetchAdjectives={fetchAdjectives}
							headerColor={headerColor}
						/>
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
						<InspirationSelection
							selectedGender={selectedGender}
							selectedLetter={selectedLetter}
							selectedPersonality={selectedPersonality}
							selectedInspiration={selectedInspiration}
							setSelectedInspiration={setSelectedInspiration}
							inspirationOptions={inspirationOptions}
							headerColor={headerColor}
						/>
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
						<OriginSelection
							selectedGender={selectedGender}
							selectedLetter={selectedLetter}
							selectedPersonality={selectedPersonality}
							selectedInspiration={selectedInspiration}
							originIndex={originIndex}
							setOriginIndex={setOriginIndex}
							originOptions={originOptions}
							headerColor={headerColor}
							wheelColor={wheelColor}
							onSkip={handleSkipOrigin}
						/>
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
