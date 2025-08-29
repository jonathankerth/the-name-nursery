"use client";
import React from "react";
import styles from "./FloatingRestart.module.css";

interface FloatingRestartProps {
	show?: boolean;
	onRestart?: () => void;
}

export default function FloatingRestart({ show = true, onRestart }: FloatingRestartProps) {
	// Don't render if show is false
	if (!show) return null;

	const handleRestart = () => {
		if (onRestart) {
			onRestart();
		} else {
			// Fallback to page refresh if no onRestart function provided
			window.location.reload();
		}
	};

	return (
		<div className={styles.floating}>
			<button
				className={styles.btn}
				aria-label="Restart"
				onClick={handleRestart}
			>
				Restart
			</button>
		</div>
	);
}
