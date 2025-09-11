import React from "react";
import styles from "./NavigationLayout.module.css";

interface NavigationLayoutProps {
	children: React.ReactNode;
	onBack?: () => void;
	onNext?: () => void;
	showBack?: boolean;
	showNext?: boolean;
	backLabel?: string;
	nextLabel?: string;
	buttonStyle?: React.CSSProperties;
}

export default function NavigationLayout({
	children,
	onBack,
	onNext,
	showBack = true,
	showNext = true,
	backLabel = "Back",
	nextLabel = "Next",
	buttonStyle,
}: NavigationLayoutProps) {
	return (
		<div className={styles.layout}>
			{showBack && onBack && (
				<button
					className={styles.backButton}
					onClick={onBack}
					style={buttonStyle}
					aria-label={backLabel}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						style={{ marginRight: "6px" }}
					>
						<polygon points="24,4 4,16 24,28" fill="currentColor" />
					</svg>
					<span className={styles.buttonText}>{backLabel}</span>
				</button>
			)}

			<div className={styles.content}>{children}</div>

			{showNext && onNext && (
				<button
					className={styles.nextButton}
					onClick={onNext}
					style={buttonStyle}
					aria-label={nextLabel}
				>
					<span className={styles.buttonText}>{nextLabel}</span>
					<svg
						width="16"
						height="16"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						style={{ marginLeft: "6px" }}
					>
						<polygon points="4,4 28,16 4,28" fill="currentColor" />
					</svg>
				</button>
			)}
		</div>
	);
}
