"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import styles from "./about.module.css";

export default function AboutPage() {
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
		<div className={styles.aboutContainer}>
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
				<span className={styles.breadcrumbCurrent}>About</span>
			</nav>

			{/* Main Content */}
			<div className={styles.content}>
				<h1 className={styles.pageTitle}>About The Name Nursery</h1>

				<div className={styles.section}>
					<h2>Your Guide to Finding the Perfect Baby Name</h2>
					<p>
						Welcome to The Name Nursery, the ultimate destination for expecting
						parents seeking the perfect name for their bundle of joy. We
						understand that choosing a baby name is one of the most important
						decisions you&apos;ll make as a parent, and we&apos;re here to make
						that journey both enjoyable and meaningful.
					</p>
				</div>

				<div className={styles.section}>
					<h2>What Makes Us Different</h2>
					<p>
						Unlike traditional baby name websites that simply list names
						alphabetically, The Name Nursery offers an interactive, personalized
						experience that considers your preferences for personality traits,
						cultural origins, and inspirational themes. Our unique wheel-based
						interface makes exploring names fun and engaging.
					</p>

					<div className={styles.features}>
						<div className={styles.feature}>
							<h3>🎯 Personalized Recommendations</h3>
							<p>
								Get name suggestions based on your specific preferences for
								personality, origin, and inspiration.
							</p>
						</div>
						<div className={styles.feature}>
							<h3>🎪 Interactive Experience</h3>
							<p>
								Our intuitive wheel interface makes browsing names entertaining
								and user-friendly.
							</p>
						</div>
						<div className={styles.feature}>
							<h3>💾 Save Your Favorites</h3>
							<p>
								Create an account to save and organize your favorite names for
								future reference.
							</p>
						</div>
						<div className={styles.feature}>
							<h3>📱 Mobile Optimized</h3>
							<p>
								Enjoy a seamless experience across all devices - desktop,
								tablet, and mobile.
							</p>
						</div>
					</div>
				</div>

				<div className={styles.section}>
					<h2>Meet Our Founders</h2>
					<div className={styles.founders}>
						<div className={styles.founder}>
							<h3>Jonathan Gallardo-Kerth</h3>
							<p className={styles.founderRole}>Developer & Co-Founder</p>
							<p>
								Jonathan is a passionate full-stack developer who brings The
								Name Nursery&apos;s interactive features to life. With expertise
								in modern web technologies, he ensures a seamless, user-friendly
								experience for expecting parents.
							</p>
							<a
								href="https://www.linkedin.com/in/jonathankerth/"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.linkedinLink}
							>
								Connect on LinkedIn →
							</a>
						</div>
						<div className={styles.founder}>
							<h3>Zac Holman</h3>
							<p className={styles.founderRole}>Designer & Co-Founder</p>
							<p>
								Zac is the creative visionary behind The Name Nursery&apos;s
								beautiful, intuitive design. His user-centered approach ensures
								that finding the perfect baby name is both delightful and
								meaningful.
							</p>
							<a
								href="https://www.linkedin.com/in/zac-holman/"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.linkedinLink}
							>
								Connect on LinkedIn →
							</a>
						</div>
					</div>
				</div>

				<div className={styles.section}>
					<h2>Our Mission</h2>
					<p>
						Our mission is to help parents discover meaningful, beautiful names
						that resonate with their family&apos;s values and heritage. We
						believe that every child deserves a name that tells a story and
						carries significance.
					</p>
				</div>

				<div className={styles.section}>
					<h2>How It Works</h2>
					<ol className={styles.steps}>
						<li>
							<strong>Choose Gender:</strong> Select whether you&apos;re looking
							for boy names, girl names, or gender-neutral options.
						</li>
						<li>
							<strong>Pick Your Letter:</strong> Use our interactive alphabet
							wheel to choose your preferred starting letter.
						</li>
						<li>
							<strong>Select Personality:</strong> Choose traits that reflect
							the personality you envision for your child.
						</li>
						<li>
							<strong>Find Inspiration:</strong> Select themes that inspire you,
							from nature to mythology.
						</li>
						<li>
							<strong>Choose Origin:</strong> Explore names from different
							cultural backgrounds and traditions.
						</li>
						<li>
							<strong>Discover Names:</strong> Get personalized recommendations
							based on all your preferences.
						</li>
					</ol>
				</div>

				<div className={styles.section}>
					<h2>Name Categories We Cover</h2>
					<div className={styles.categories}>
						<div className={styles.category}>
							<h3>Cultural Origins</h3>
							<p>
								Celtic, Germanic, Latin, Greek, Hebrew, Arabic, Sanskrit, and
								many more cultural traditions.
							</p>
						</div>
						<div className={styles.category}>
							<h3>Personality Traits</h3>
							<p>
								Strong, gentle, creative, wise, brave, peaceful, and other
								meaningful characteristics.
							</p>
						</div>
						<div className={styles.category}>
							<h3>Inspirational Themes</h3>
							<p>
								Nature, mythology, literature, music, celestial bodies, and
								artistic influences.
							</p>
						</div>
					</div>
				</div>

				<div className={styles.section}>
					<h2>Privacy & Security</h2>
					<p>
						We take your privacy seriously. All personal information is securely
						stored and never shared with third parties. Your saved names and
						preferences remain private to your account. Read our{" "}
						<button
							onClick={() => router.push("/privacy-policy")}
							className={styles.inlineLink}
						>
							Privacy Policy
						</button>{" "}
						for complete details.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Get Started Today</h2>
					<p>
						Ready to find the perfect name for your little one?
						<button
							onClick={() => router.push("/")}
							className={styles.ctaButton}
						>
							Start Exploring Names
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
