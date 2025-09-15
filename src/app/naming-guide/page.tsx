"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./naming-guide.module.css";

export default function NamingGuide() {
	const router = useRouter();

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<button
					onClick={() => router.back()}
					className={styles.backButton}
					aria-label="Go back"
				>
					← Back
				</button>
				<h1 className={styles.title}>The Name Nursery Guide</h1>
			</div>

			<div className={styles.content}>
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Our Naming Process</h2>
					<p className={styles.description}>
						At The Name Nursery, we believe finding the perfect baby name should be both meaningful and enjoyable. Our carefully crafted process guides you through five thoughtful steps to discover names that truly resonate with your family.
					</p>
				</section>

				<div className={styles.processSteps}>
					<div className={styles.step}>
						<div className={styles.stepNumber}>1</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Choose Gender</h3>
							<p className={styles.stepDescription}>
								Start by selecting whether you&apos;re looking for baby, girl, or boy names. This helps us tailor our recommendations to your preferences.
							</p>
						</div>
					</div>

					<div className={styles.step}>
						<div className={styles.stepNumber}>2</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Pick a Starting Letter</h3>
							<p className={styles.stepDescription}>
								Choose the first letter of your future baby&apos;s name. Whether you have a family tradition or just love how certain letters sound, this helps narrow down the possibilities.
							</p>
						</div>
					</div>

					<div className={styles.step}>
						<div className={styles.stepNumber}>3</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Define Personality</h3>
							<p className={styles.stepDescription}>
								Select a personality trait that reflects your hopes for your child - from strong and elegant to gentle and playful. Names carry meaning and energy.
							</p>
						</div>
					</div>

					<div className={styles.step}>
						<div className={styles.stepNumber}>4</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Find Inspiration</h3>
							<p className={styles.stepDescription}>
								Choose what inspires you - nature, virtues, flowers, gemstones, colors, seasons, or stars. This adds a beautiful layer of meaning to your name choice.
							</p>
						</div>
					</div>

					<div className={styles.step}>
						<div className={styles.stepNumber}>5</div>
						<div className={styles.stepContent}>
							<h3 className={styles.stepTitle}>Select Cultural Origin</h3>
							<p className={styles.stepDescription}>
								Pick from rich cultural traditions like Celtic, Latin, Hebrew, Greek, Norse, Arabic, or Sanskrit. Each brings its own history and significance.
							</p>
						</div>
					</div>
				</div>

				<section className={styles.aiSection}>
					<h2 className={styles.sectionTitle}>Powered by AI</h2>
					<p className={styles.description}>
						Our advanced AI system combines your preferences with extensive name databases, cultural meanings, and linguistic patterns to generate personalized recommendations that match your unique criteria. Each suggestion is thoughtfully curated based on your specific choices.
					</p>
				</section>

				<section className={styles.ctaSection}>
					<h2 className={styles.ctaTitle}>Ready to Find Your Perfect Name?</h2>
					<p className={styles.ctaDescription}>
						Start your naming journey today and discover beautiful, meaningful names that will grow with your child throughout their life.
					</p>
					<button
						onClick={() => router.push("/")}
						className={styles.ctaButton}
					>
						Start Naming Journey
					</button>
				</section>
			</div>
		</div>
	);
}
