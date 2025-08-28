"use client";
import React from "react";
import Header from "../../components/Header";
import styles from "./results.module.css";

export default function ResultsPage() {
	return (
		<div className={styles.page}>
			<Header />
			<main className={styles.centerMain}>
				<div className={styles.card}>
					<h2>Next page coming soon</h2>
					<p>We are working on showing matching names — stay tuned.</p>
				</div>
			</main>
		</div>
	);
}
