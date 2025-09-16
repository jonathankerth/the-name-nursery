"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import styles from "./social.module.css";

export default function SocialPage() {
	const router = useRouter();
	const { user } = useAuth();

	// Theme initialization
	React.useEffect(() => {
		const pageColor = "#d3f3c8"; // Default baby color
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

		const sectionBg = "rgba(255, 255, 255, 0.9)";
		const sectionBorder = `2px solid ${darken(pageColor, 0.1)}`;
		const headerColor = darken(pageColor, 0.35);

		try {
			if (document.documentElement) {
				document.documentElement.style.setProperty("--background", pageColor);
				document.documentElement.style.setProperty(
					"--section-bg-color",
					sectionBg
				);
				document.documentElement.style.setProperty(
					"--section-border",
					sectionBorder
				);
				document.documentElement.style.setProperty(
					"--header-color",
					headerColor
				);
				document.documentElement.style.setProperty(
					"--header-bg-color",
					"rgba(255, 255, 255, 0.9)"
				);
			}
		} catch {
			// noop in non-browser contexts
		}
	}, []);

	return (
		<div className={styles.socialPageContainer}>
			{/* Header */}
			<PageHeader />

			{/* Navigation */}
			<nav className={styles.breadcrumbs}>
				{user ? (
					<button
						onClick={() => router.push("/profile")}
						className={styles.breadcrumbLink}
					>
						← Back to Profile
					</button>
				) : (
					<button
						onClick={() => router.push("/")}
						className={styles.breadcrumbLink}
					>
						← Back to Home
					</button>
				)}
			</nav>

			{/* Main Content */}
			<div className={styles.content}>
				<h1 className={styles.pageTitle}>Social Features</h1>

				<div className={styles.section}>
					<div className={styles.comingSoonCard}>
						<div className={styles.icon}>👥</div>
						<h2>Connect with Others</h2>
						<p>
							Share your favorite names, get feedback from other expecting
							parents, and discover what names are trending in your community.
						</p>
					</div>

					<div className={styles.comingSoonCard}>
						<div className={styles.icon}>💭</div>
						<h2>Name Discussions</h2>
						<p>
							Join conversations about name meanings, cultural significance, and
							get advice from parents who&apos;ve been through the naming
							journey.
						</p>
					</div>

					<div className={styles.comingSoonCard}>
						<div className={styles.icon}>🎯</div>
						<h2>Name Polls</h2>
						<p>
							Create polls to help decide between your final name choices, or
							vote on other parents&apos; name selections.
						</p>
					</div>
				</div>

				<div className={styles.section}>
					<div className={styles.notification}>
						<h3>🚀 Coming Soon!</h3>
						<p>
							We&apos;re working hard to bring you these exciting social
							features. Stay tuned for updates, and in the meantime, enjoy
							exploring our name generator!
						</p>
						<button
							onClick={() => router.push("/")}
							className={styles.ctaButton}
						>
							Explore Names Now →
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
