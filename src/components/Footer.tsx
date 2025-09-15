"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
	const router = useRouter();

	return (
		<footer className={styles.footer}>
			<div className={styles.footerContent}>
				{/* Main Footer Content */}
				<div className={styles.footerGrid}>
					{/* Company Info */}
					<div className={styles.footerSection}>
						<h3 className={styles.footerTitle}>The Name Nursery</h3>
						<p className={styles.footerDescription}>
							Your trusted companion for discovering perfect baby names. Explore
							meaningful names from cultures around the world.
						</p>
						<div className={styles.socialLinks}>
							{/* Add social media links when available */}
						</div>
					</div>

					{/* Quick Links */}
					<div className={styles.footerSection}>
						<h4 className={styles.sectionTitle}>Quick Links</h4>
						<ul className={styles.linkList}>
							<li>
								<button
									onClick={() => router.push("/")}
									className={styles.footerLink}
								>
									Name Generator
								</button>
							</li>
							<li>
								<button
									onClick={() => router.push("/explore")}
									className={styles.footerLink}
								>
									Explore Names
								</button>
							</li>
							<li>
								<button
									onClick={() => router.push("/blog")}
									className={styles.footerLink}
								>
									Blog
								</button>
							</li>
							<li>
								<button
									onClick={() => router.push("/about")}
									className={styles.footerLink}
								>
									About Us
								</button>
							</li>
						</ul>
					</div>

					{/* Resources */}
					<div className={styles.footerSection}>
						<h4 className={styles.sectionTitle}>Resources</h4>
						<ul className={styles.linkList}>
							<li>
								<button
									onClick={() => router.push("/naming-guide")}
									className={styles.footerLink}
								>
									Naming Guide
								</button>
							</li>
							<li>
								<button
									onClick={() => router.push("/contact")}
									className={styles.footerLink}
								>
									Contact Us
								</button>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div className={styles.footerSection}>
						<h4 className={styles.sectionTitle}>Legal</h4>
						<ul className={styles.linkList}>
							<li>
								<button
									onClick={() => router.push("/privacy-policy")}
									className={styles.footerLink}
								>
									Privacy Policy
								</button>
							</li>
							<li>
								<button
									onClick={() => router.push("/terms-of-service")}
									className={styles.footerLink}
								>
									Terms of Service
								</button>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className={styles.footerBottom}>
					<div className={styles.copyright}>
						<p suppressHydrationWarning>
							&copy; {new Date().getFullYear()} The Name Nursery. All rights
							reserved.
						</p>
						<p className={styles.founders}>
							Created by{" "}
							<a
								href="https://www.linkedin.com/in/jonathankerth/"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.founderLink}
							>
								Jonathan Gallardo-Kerth
							</a>{" "}
							&{" "}
							<a
								href="https://www.linkedin.com/in/zac-holman/"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.founderLink}
							>
								Zac Holman
							</a>
						</p>
					</div>
					<div className={styles.bottomLinks}>
						<button
							onClick={() => router.push("/privacy-policy")}
							className={styles.bottomLink}
						>
							Privacy
						</button>
						<button
							onClick={() => router.push("/terms-of-service")}
							className={styles.bottomLink}
						>
							Terms
						</button>
						<button
							onClick={() => router.push("/contact")}
							className={styles.bottomLink}
						>
							Contact
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
