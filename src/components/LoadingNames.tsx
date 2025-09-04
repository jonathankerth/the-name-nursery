import React from "react";
import styles from "./LoadingNames.module.css";

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
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.spinner}>
					<div className={styles.spinnerRing}></div>
				</div>
				<h2 className={styles.title}>
					Finding perfect {gender} names starting with {letter}...
				</h2>
				<p className={styles.subtitle}>
					For a {personality} baby inspired by {inspiration} with {origin}{" "}
					origin
				</p>
			</div>
		</div>
	);
}
