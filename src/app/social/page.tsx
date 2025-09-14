"use client";

import { useRouter } from "next/navigation";
import styles from "./social.module.css";

export default function SocialPage() {
	const router = useRouter();

	return (
		<div className={styles.socialPageContainer}>
			<div className={styles.content}>
				<h1>Social Features</h1>
				<p>Connect with others andshare name ideas!</p>
				<p>This feature is coming soon...</p>

				<button onClick={() => router.push("/")} className={styles.backButton}>
					← Back to Home
				</button>
			</div>
		</div>
	);
}
