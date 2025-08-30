import React from "react";
import styles from "./NamesResults.module.css";

interface NamesResultsProps {
	names: string[];
	gender: string;
	letter: string;
	onBack: () => void;
	isAIGenerated?: boolean;
}

export default function NamesResults({
	names,
	gender,
	letter,
	onBack,
	isAIGenerated = true,
}: NamesResultsProps) {
	// Calculate the same header color used in the Header component
	const pageColors = {
		baby: "#EFD9AA",
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

	const headerColor = darken(
		pageColors[gender as keyof typeof pageColors] || "#111827",
		0.22
	);
	return (
		<div className={styles.container}>
			<button
				className={styles.backButton}
				type="button"
				aria-label="Back to letter selection"
				onClick={onBack}
			>
				<svg
					width="36"
					height="36"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<polygon points="24,4 4,16 24,28" fill="currentColor" />
				</svg>
			</button>

			<div className={styles.content}>
				<div className={styles.header}>
					<h1 className={styles.title} style={{ color: headerColor }}>
						{gender.charAt(0).toUpperCase() + gender.slice(1)} names starting
						with {letter}
					</h1>
					{isAIGenerated && (
						<p className={styles.subtitle} style={{ color: headerColor }}>
							✨ AI-curated recommendations just for you
						</p>
					)}
				</div>

				<div className={styles.namesGrid}>
					{names.map((name, index) => (
						<div key={index} className={styles.nameCard}>
							<span className={styles.nameName}>{name}</span>
						</div>
					))}
				</div>

				<div className={styles.actions}>
					<button
						className={styles.actionButton}
						onClick={() => window.location.reload()}
					>
						Get New Names
					</button>
				</div>
			</div>
		</div>
	);
}
