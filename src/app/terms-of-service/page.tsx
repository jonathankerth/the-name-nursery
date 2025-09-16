"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import styles from "./terms-of-service.module.css";

export default function TermsOfServicePage() {
	const router = useRouter();

	return (
		<div className={styles.termsContainer}>
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
				<span className={styles.breadcrumbCurrent}>Terms of Service</span>
			</nav>

			{/* Main Content */}
			<div className={styles.content}>
				<h1 className={styles.pageTitle}>Terms of Service</h1>

				<div className={styles.lastUpdated}>
					<p suppressHydrationWarning>
						<strong>Last updated:</strong> {new Date().toLocaleDateString()}
					</p>
				</div>

				<div className={styles.section}>
					<h2>Agreement to Terms</h2>
					<p>
						By accessing and using The Name Nursery website and services, you
						accept and agree to be bound by the terms and provision of this
						agreement. If you do not agree to abide by the above, please do not
						use this service.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Description of Service</h2>
					<p>
						The Name Nursery is a web-based platform that provides baby name
						discovery and recommendation services. Our service includes:
					</p>
					<ul>
						<li>Interactive name exploration tools</li>
						<li>Personalized name recommendations based on user preferences</li>
						<li>Name saving and organization features for registered users</li>
						<li>Educational content about name meanings and origins</li>
					</ul>
				</div>

				<div className={styles.section}>
					<h2>User Accounts</h2>
					<h3>Account Creation</h3>
					<ul>
						<li>You must be at least 18 years old to create an account</li>
						<li>You must provide accurate and complete information</li>
						<li>
							You are responsible for maintaining the confidentiality of your
							account credentials
						</li>
						<li>
							You are responsible for all activities that occur under your
							account
						</li>
					</ul>

					<h3>Account Termination</h3>
					<ul>
						<li>You may terminate your account at any time by contacting us</li>
						<li>We may terminate accounts that violate these terms</li>
						<li>
							Upon termination, your right to use the service ceases immediately
						</li>
					</ul>
				</div>

				<div className={styles.section}>
					<h2>Acceptable Use</h2>
					<p>
						You agree to use The Name Nursery only for lawful purposes and in
						accordance with these Terms. You agree NOT to:
					</p>
					<ul>
						<li>
							Use the service for any unlawful purpose or to solicit unlawful
							activity
						</li>
						<li>
							Attempt to gain unauthorized access to our systems or user
							accounts
						</li>
						<li>
							Interfere with or disrupt the service or servers connected to the
							service
						</li>
						<li>
							Use automated means to access the service or collect information
						</li>
						<li>
							Impersonate any person or entity or misrepresent your affiliation
						</li>
						<li>
							Post or transmit any harmful, offensive, or inappropriate content
						</li>
						<li>
							Violate any applicable local, state, national, or international
							law
						</li>
					</ul>
				</div>

				<div className={styles.section}>
					<h2>Intellectual Property Rights</h2>
					<h3>Our Content</h3>
					<p>
						The Name Nursery and its original content, features, and
						functionality are owned by us and are protected by international
						copyright, trademark, patent, trade secret, and other intellectual
						property laws.
					</p>

					<h3>User Content</h3>
					<p>
						By using our service, you retain ownership of any content you create
						or upload. However, you grant us a worldwide, non-exclusive,
						royalty-free license to use, reproduce, and display such content
						solely for the purpose of providing our services.
					</p>

					<h3>Name Information</h3>
					<p>
						The name meanings, origins, and cultural information provided are
						for educational purposes. While we strive for accuracy, we make no
						guarantees about the completeness or accuracy of this information.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Privacy</h2>
					<p>
						Your privacy is important to us. Please review our{" "}
						<button
							onClick={() => router.push("/privacy-policy")}
							className={styles.inlineLink}
						>
							Privacy Policy
						</button>
						, which also governs your use of the service, to understand our
						practices.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Disclaimers and Limitation of Liability</h2>
					<h3>Service Availability</h3>
					<p>
						We strive to maintain service availability but do not guarantee
						uninterrupted access. The service is provided &quot;as is&quot; and
						&quot;as available&quot; without warranties of any kind.
					</p>

					<h3>Content Accuracy</h3>
					<p>
						While we make efforts to provide accurate name information, we do
						not guarantee the accuracy, completeness, or usefulness of any
						information provided through our service.
					</p>

					<h3>Limitation of Liability</h3>
					<p>
						In no event shall The Name Nursery be liable for any indirect,
						incidental, special, consequential, or punitive damages, including
						loss of profits, data, or goodwill, arising from your use of the
						service.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Third-Party Services</h2>
					<p>
						Our service may contain links to third-party websites or services
						that are not owned or controlled by The Name Nursery. We have no
						control over and assume no responsibility for the content, privacy
						policies, or practices of any third-party services.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Advertising</h2>
					<p>
						The Name Nursery may display advertisements from third parties. We
						are not responsible for the content or accuracy of these
						advertisements. Your interactions with advertisers are solely
						between you and the advertiser.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Modifications to Terms</h2>
					<p>
						We reserve the right to modify these Terms of Service at any time.
						We will notify users of significant changes by posting the updated
						terms on our website. Your continued use of the service after such
						modifications constitutes acceptance of the updated terms.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Governing Law</h2>
					<p>
						These Terms shall be interpreted and governed by the laws of the
						United States, without regard to conflict of law provisions. Any
						disputes arising under these terms will be subject to the
						jurisdiction of the courts in the United States.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Severability</h2>
					<p>
						If any provision of these Terms is found to be unenforceable or
						invalid, that provision will be limited or eliminated to the minimum
						extent necessary so that the remaining terms will remain in full
						force and effect.
					</p>
				</div>

				<div className={styles.section}>
					<h2>Contact Information</h2>
					<p>
						If you have any questions about these Terms of Service, please
						contact us at:
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
							By using The Name Nursery, you acknowledge that you have read and
							understood these Terms of Service and agree to be bound by them.
						</strong>
					</p>
				</div>
			</div>
		</div>
	);
}
