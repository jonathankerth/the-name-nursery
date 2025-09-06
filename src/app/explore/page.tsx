"use client";

import { useRouter } from "next/navigation";
import styles from "./explore.module.css";

export default function ExplorePage() {
	const router = useRouter();

	return (
		<div className={styles.explorePageContainer}>
			<div className={styles.content}>
				<h1>Explore Names</h1>
				<p>Discover trending baby names and popular choices!</p>
				<p>This feature is coming soon...</p>
				
				<button 
					onClick={() => router.push("/")}
					className={styles.backButton}
				>
					← Back to Home
				</button>
			</div>
		</div>
	);
}
