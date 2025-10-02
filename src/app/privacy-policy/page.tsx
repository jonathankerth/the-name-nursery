"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import styles from "./privacy-policy.module.css";

export default function PrivacyPolicyPage() {
	const router = useRouter();

	return (
		<div className={styles.privacyContainer}>
			{/* Header */}
			<PageHeader />

			{/* Navigation */}
			<nav className={styles.breadcrumbs}>
				<button
					onClick={() => router.push("/")}
					className={styles.breadcrumbLink}
				>
					← Home
				</button>
				<span className={styles.breadcrumbSeparator}>›</span>
				<span className={styles.breadcrumbCurrent}>Privacy Policy</span>
			</nav>

			{/* Main Content */}
			<div className={styles.content}>
				<h1 className={styles.pageTitle}>
					<span>Privacy Policy</span>
					<svg
						className={styles.trustBadge}
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Trust badge"
					>
						<circle cx="16" cy="16" r="16" fill="#22c55e" />
						<path
							d="M10 17.5l4 4 8-8"
							stroke="#fff"
							strokeWidth="2.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</h1>

				<div className={styles.lastUpdated}>
					<p suppressHydrationWarning>
						<strong>Last updated:</strong> {new Date().toLocaleDateString()}
					</p>
				</div>

				<div className={styles.section}>
					<h2>Introduction</h2>
					<p>
						At The Name Nursery, we are committed to protecting your privacy and
						ensuring the security of your personal information. This Privacy
						Policy explains how we collect, use, store, and protect your
						information when you use our baby name discovery platform.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Information We Collect</h2>

					<h3>Personal Information</h3>
					<ul>
						<li>
							<strong>Account Information:</strong> When you create an account,
							we collect your email address and any profile information you
							choose to provide.
						</li>
						<li>
							<strong>Saved Preferences:</strong> Your name preferences, saved
							names, and search history to provide personalized recommendations.
						</li>
						<li>
							<strong>Usage Data:</strong> Information about how you interact
							with our platform, including pages visited and features used.
						</li>
					</ul>

					<h3>Automatically Collected Information</h3>
					<ul>
						<li>
							<strong>Device Information:</strong> Browser type, operating
							system, and device characteristics.
						</li>
						<li>
							<strong>Analytics Data:</strong> We use Google Analytics to
							understand user behavior and improve our service.
						</li>
						<li>
							<strong>Cookies:</strong> We use cookies to enhance your
							experience and remember your preferences.
						</li>
					</ul>
				</div>

				<div className={styles.section}>
					<h2>How We Use Your Information</h2>
					<ul>
						<li>
							<strong>Service Provision:</strong> To provide personalized name
							recommendations and maintain your saved lists.
						</li>
						<li>
							<strong>Account Management:</strong> To create and manage your
							account, authenticate your identity, and communicate with you.
						</li>
						<li>
							<strong>Platform Improvement:</strong> To analyze usage patterns
							and improve our features and user experience.
						</li>
						<li>
							<strong>Communication:</strong> To send important updates about
							our service (with your consent for promotional emails).
						</li>
						<li>
							<strong>Legal Compliance:</strong> To comply with applicable laws
							and protect our rights and users.
						</li>
					</ul>
				</div>

				<div className={styles.section}>
					<h2>Information Sharing and Disclosure</h2>
					<p>
						We do not sell, trade, or rent your personal information to third
						parties. We may share your information only in the following
						circumstances:
					</p>
					<ul>
						<li>
							<strong>Service Providers:</strong> With trusted third-party
							services that help us operate our platform (such as hosting
							providers and analytics services).
						</li>
						<li>
							<strong>Legal Requirements:</strong> When required by law or to
							protect our rights, privacy, safety, or property.
						</li>
						<li>
							<strong>Business Transfers:</strong> In connection with any
							merger, acquisition, or sale of assets (users will be notified
							beforehand).
						</li>
						<li>
							<strong>Consent:</strong> With your explicit consent for any other
							purpose.
						</li>
					</ul>
				</div>

				<div className={styles.section}>
					<h2>Data Security</h2>
					<p>
						We implement appropriate technical and organizational security
						measures to protect your personal information against unauthorized
						access, alteration, disclosure, or destruction. These measures
						include:
					</p>
					<ul>
						<li>Encryption of data in transit and at rest</li>
						<li>Regular security assessments and updates</li>
						<li>Access controls and authentication mechanisms</li>
						<li>Secure hosting infrastructure</li>
					</ul>
				</div>

				<div className={styles.section}>
					<h2>Your Rights and Choices</h2>
					<p>
						You have the following rights regarding your personal information:
					</p>
					<ul>
						<li>
							<strong>Access:</strong> Request a copy of the personal
							information we hold about you.
						</li>
						<li>
							<strong>Correction:</strong> Request correction of inaccurate or
							incomplete information.
						</li>
						<li>
							<strong>Deletion:</strong> Request deletion of your personal
							information (subject to legal requirements).
						</li>
						<li>
							<strong>Portability:</strong> Request a copy of your data in a
							portable format.
						</li>
						<li>
							<strong>Opt-out:</strong> Unsubscribe from promotional
							communications at any time.
						</li>
					</ul>
				</div>

				<div className={styles.section}>
					<h2>Cookies and Tracking</h2>
					<p>We use cookies and similar technologies to:</p>
					<ul>
						<li>Remember your preferences and settings</li>
						<li>Analyze site usage and improve performance</li>
						<li>Provide personalized content and recommendations</li>
						<li>Enable social media features</li>
					</ul>
					<p>
						You can control cookies through your browser settings, though this
						may affect site functionality.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Third-Party Services</h2>
					<p>Our platform integrates with third-party services:</p>
					<ul>
						<li>
							<strong>Google Analytics:</strong> For understanding user behavior
							and site performance
						</li>
						<li>
							<strong>Firebase:</strong> For authentication and database
							services
						</li>
						<li>
							<strong>Google AdSense:</strong> For displaying relevant
							advertisements
						</li>
					</ul>
					<p>
						These services have their own privacy policies, which we encourage
						you to review.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Children&apos;s Privacy</h2>
					<p>
						The Name Nursery is intended for use by adults (18+) who are
						expecting or planning for children. We do not knowingly collect
						personal information from children under 13. If we become aware that
						we have collected such information, we will take steps to delete it
						promptly.
					</p>
				</div>

				<div className={styles.section}>
					<h2>International Users</h2>
					<p>
						If you are accessing our service from outside the United States,
						please be aware that your information may be transferred to and
						processed in the United States, where our servers are located and
						our database is operated.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Changes to This Policy</h2>
					<p>
						We may update this Privacy Policy from time to time to reflect
						changes in our practices or for legal, operational, or regulatory
						reasons. We will notify users of significant changes by posting the
						updated policy on our website and updating the &quot;Last
						updated&quot; date above.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Contact Us</h2>
					<p>
						If you have any questions about this Privacy Policy or our privacy
						practices, please contact us at:
					</p>
					<div className={styles.contactInfo}>
						<p>
							<strong>Email:</strong> thenamenursery@outlook.com
						</p>
						<p>
							<strong>Website:</strong>{" "}
							<button
								onClick={() => router.push("/")}
								className={styles.inlineLink}
							>
								www.thenamenursery.com
							</button>
						</p>
					</div>
				</div>

				<div className={styles.section}>
					<p>
						<strong>
							Your continued use of The Name Nursery after any changes to this
							Privacy Policy constitutes your acceptance of such changes.
						</strong>
					</p>
				</div>
			</div>
		</div>
	);
}
