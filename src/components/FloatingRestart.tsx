"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./FloatingRestart.module.css";

export default function FloatingRestart() {
	const router = useRouter();
	const pathname = usePathname();
		// Intentionally avoid prefetch to prevent server-side prefetch evaluation
		// which can trigger unexpected server rendering behavior during navigation.

	// hide the floating restart on the alphabet (/names) page
	if (pathname && pathname.startsWith("/names")) return null;

	return (
		<div className={styles.floating}>
			<button
				className={styles.btn}
				aria-label="Restart"
				onClick={() => router.push("/")}
			>
				Restart
			</button>
		</div>
	);
}
