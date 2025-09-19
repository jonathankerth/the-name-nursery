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
}

export default function InspirationSelection({
	selectedGender,
	selectedLetter,
	selectedPersonality,
	selectedInspiration,
	setSelectedInspiration,
	inspirationOptions,
	headerColor,
}: InspirationSelectionProps) {
	// Function to get more inspiration suggestions (for now, just cycle through options)
	const getMoreSuggestions = () => {
		// Could implement shuffling or cycling through different inspiration sets
		// For now, just keep the same options
	};

	return (
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

			<div
				className={styles.personalityPrompt}
				style={{ color: headerColor }}
			>
				Inspired by...
			</div>

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

						<button
							type="button"
							className={styles.moreSuggestionsButton}
							style={{
								color: headerColor,
								borderColor: headerColor,
							}}
							onClick={getMoreSuggestions}
						>
							More Suggestions
						</button>
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
		</div>
	);
}
