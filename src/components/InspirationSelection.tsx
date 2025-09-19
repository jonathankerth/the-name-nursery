"use client";
import styles from "../app/page.module.css";

interface InspirationOption {
	label: string;
	value: string;
}

interface InspirationSelectionProps {
	selectedGender: "baby" | "girl" | "boy";
	selectedLetter: string;
	selectedPersonality: string;
	selectedInspiration: string;
	setSelectedInspiration: (inspiration: string) => void;
	inspirationOptions: InspirationOption[];
	headerColor: string;
	loadingInspirations: boolean;
	fetchInspirations: () => void;
	onSkip?: () => void;
}

export default function InspirationSelection({
	selectedGender,
	selectedLetter,
	selectedPersonality,
	selectedInspiration,
	setSelectedInspiration,
	inspirationOptions,
	headerColor,
	loadingInspirations,
	fetchInspirations,
	onSkip,
}: InspirationSelectionProps) {
	// Function to get more inspiration suggestions (generate new ones from AI)
	const getMoreSuggestions = () => {
		fetchInspirations();
		// Clear current selection to force user to pick again
		setSelectedInspiration("");
	};

	return (
		<div className={styles.personalityContent}>
			<div className={styles.personalityTopText} style={{ color: headerColor }}>
				<span className={styles.selectedType}>
					{selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)}
				</span>{" "}
				names starting with {selectedLetter} for a baby who is{" "}
				{selectedPersonality} and
			</div>

			<div className={styles.personalityPrompt} style={{ color: headerColor }}>
				Inspired by...
			</div>

			{loadingInspirations ? (
				<div
					className={styles.loadingAdjectives}
					style={{ color: headerColor }}
				>
					Loading inspiration options...
				</div>
			) : (
				<div>
					{Array.isArray(inspirationOptions) &&
					inspirationOptions.length > 0 ? (
						<>
							<div className={styles.adjectiveGrid}>
								{inspirationOptions.map((option) => (
									<button
										key={option.value}
										type="button"
										className={`${styles.adjectiveCard} ${
											selectedInspiration === option.value
												? styles.selected
												: ""
										}`}
										style={{
											color: headerColor,
											borderColor: headerColor,
										}}
										onClick={() => setSelectedInspiration(option.value)}
									>
										{option.label}
									</button>
								))}
							</div>

							<div
								style={{
									display: "flex",
									gap: "0.5rem",
									alignItems: "center",
									justifyContent: "center",
									flexWrap: "wrap",
								}}
							>
								<button
									type="button"
									className={styles.moreSuggestionsButton}
									style={{
										color: headerColor,
										borderColor: headerColor,
									}}
									onClick={getMoreSuggestions}
									disabled={loadingInspirations}
								>
									{loadingInspirations ? "Generating..." : "More Suggestions"}
								</button>

								{onSkip && (
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
								)}
							</div>
						</>
					) : (
						<div
							className={styles.loadingAdjectives}
							style={{ color: headerColor }}
						>
							Loading inspiration options...
						</div>
					)}
				</div>
			)}
		</div>
	);
}
