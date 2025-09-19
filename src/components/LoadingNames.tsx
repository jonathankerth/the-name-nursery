import React from "react";
import styles from "../app/page.module.css";
import loadingStyles from "./LoadingNames.module.css";

interface LoadingNamesProps {
	gender: string;
	letter: string;
	personality: string;
	inspiration: string;
	origin: string;
}

export default function LoadingNames({
	gender,
	letter,
	personality,
	inspiration,
	origin,
}: LoadingNamesProps) {
	// Calculate the same header color used in other components
	const headerColor = (() => {
		const pageColors = {
			baby: "#d3f3c8",
			boy: "#B7E9F0",
			girl: "#EDD5EB",
		};

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

		return darken(
			pageColors[gender as keyof typeof pageColors] || "#111827",
			0.6
		);
	})();

	return (
		<div className={styles.multiStepContent}>
			<div className={styles.topRow} style={{ color: headerColor }}>
				<div className={styles.twoRowText}>
					<div className={styles.firstRow}>
						<span className={styles.selectedType}>
							{gender.charAt(0).toUpperCase() + gender.slice(1)}
						</span>{" "}
						names starting with {letter}
					</div>
					<div className={styles.secondRow}>
						for a baby who&apos;s {personality}
						{inspiration && ` & inspired by ${inspiration}`}
						{origin && (
							<>
								{inspiration ? ' with ' : ' with '}
								<span style={{ fontWeight: "normal" }}>
									{origin} origin
								</span>
							</>
						)}
					</div>
				</div>
			</div>
			<div className={styles.letterSelectionContent}>
				<div className={loadingStyles.spinner}>
					<div className={loadingStyles.spinnerRing}></div>
				</div>
			</div>
			<div className={styles.personalityPrompt} style={{ color: headerColor }}>
				✨ AI-curated recommendations just for you
			</div>
		</div>
	);
}
