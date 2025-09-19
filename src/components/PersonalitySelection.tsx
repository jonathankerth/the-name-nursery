"use client";
import styles from "../app/page.module.css";

interface PersonalitySelectionProps {
	selectedGender: "baby" | "girl" | "boy";
	selectedLetter: string;
	selectedPersonality: string;
	setSelectedPersonality: (personality: string) => void;
	personalityAdjectives: string[];
	loadingAdjectives: boolean;
	fetchAdjectives: () => void;
	headerColor: string;
}

export default function PersonalitySelection({
	selectedGender,
	selectedLetter,
	selectedPersonality,
	setSelectedPersonality,
	personalityAdjectives,
	loadingAdjectives,
	fetchAdjectives,
	headerColor,
}: PersonalitySelectionProps) {
	return (
		<div className={styles.personalityContent}>
			<div className={styles.personalityTopText} style={{ color: headerColor }}>
				<span className={styles.selectedType}>
					{selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)}
				</span>{" "}
				names starting with {selectedLetter}
			</div>

			<div className={styles.personalityPrompt} style={{ color: headerColor }}>
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
											selectedPersonality === adjective ? styles.selected : ""
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
	);
}
