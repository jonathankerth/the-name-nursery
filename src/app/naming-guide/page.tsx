"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import styles from "./naming-guide.module.css";

export default function NamingGuide() {
	const router = useRouter();

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
		<div className={styles.container}>
			{/* Header */}
			<PageHeader />

			{/* Navigation */}
			<nav className={styles.breadcrumbs}>
				<button
					onClick={() => router.push("/")}
					className={styles.breadcrumbLink}
				>
					← Back to Home
				</button>
				<span className={styles.breadcrumbSeparator}>›</span>
				<span className={styles.breadcrumbCurrent}>Naming Guide</span>
			</nav>

			<div className={styles.content}>
				<h1 className={styles.pageTitle}>Naming Guide</h1>

				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Our Naming Process</h2>
					<p className={styles.description}>
						At The Name Nursery, we believe finding the perfect baby name should
						be both meaningful and enjoyable. Our carefully crafted process
						guides you through five thoughtful steps to discover names that
						truly resonate with your family.
					</p>
				</section>

				<div className={styles.processSteps}>
					<div className={styles.step}>
						<div className={styles.stepNumber}>1</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Choose Gender</h3>
							<p className={styles.stepDescription}>
								Start by selecting whether you&apos;re looking for baby, girl,
								or boy names. This helps us tailor our recommendations to your
								preferences.
							</p>
						</div>
					</div>

					<div className={styles.step}>
						<div className={styles.stepNumber}>2</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Pick a Starting Letter</h3>
							<p className={styles.stepDescription}>
								Choose the first letter of your future baby&apos;s name. Whether
								you have a family tradition or just love how certain letters
								sound, this helps narrow down the possibilities.
							</p>
						</div>
					</div>

					<div className={styles.step}>
						<div className={styles.stepNumber}>3</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Define Personality</h3>
							<p className={styles.stepDescription}>
								Select a personality trait that reflects your hopes for your
								child - from strong and elegant to gentle and playful. Names
								carry meaning and energy.
							</p>
						</div>
					</div>

					<div className={styles.step}>
						<div className={styles.stepNumber}>4</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Find Inspiration</h3>
							<p className={styles.stepDescription}>
								Choose what inspires you - nature, virtues, flowers, gemstones,
								colors, seasons, or stars. This adds a beautiful layer of
								meaning to your name choice.
							</p>
						</div>
					</div>

					<div className={styles.step}>
						<div className={styles.stepNumber}>5</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Select Cultural Origin</h3>
							<p className={styles.stepDescription}>
								Pick from rich cultural traditions like Celtic, Latin, Hebrew,
								Greek, Norse, Arabic, or Sanskrit. Each brings its own history
								and significance.
							</p>
						</div>
					</div>
				</div>

				<section className={styles.aiSection}>
					<h2 className={styles.sectionTitle}>Powered by AI</h2>
					<p className={styles.description}>
						Our advanced AI system combines your preferences with extensive name
						databases, cultural meanings, and linguistic patterns to generate
						personalized recommendations that match your unique criteria. Each
						suggestion is thoughtfully curated based on your specific choices.
					</p>
				</section>

				<section className={styles.ctaSection}>
					<h2 className={styles.ctaTitle}>Ready to Find Your Perfect Name?</h2>
					<p className={styles.ctaDescription}>
						Start your naming journey today and discover beautiful, meaningful
						names that will grow with your child throughout their life.
					</p>
					<button onClick={() => router.push("/")} className={styles.ctaButton}>
						Start Naming Journey
					</button>
				</section>
			</div>
		</div>
	);
}
