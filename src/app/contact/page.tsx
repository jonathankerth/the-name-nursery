"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import styles from "./contact.module.css";

export default function ContactPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

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

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Import Firebase at runtime to avoid SSR issues
			const { db } = await import("@/lib/firebase");
			const { collection, addDoc, serverTimestamp } = await import(
				"firebase/firestore"
			);

			// Save to Firestore first
			const messageData = {
				name: formData.name,
				email: formData.email,
				subject: formData.subject,
				message: formData.message,
				timestamp: serverTimestamp(),
			};

			const docRef = await addDoc(
				collection(db, "contact-messages"),
				messageData
			);
			console.log("Contact message saved with ID:", docRef.id);

			// Also notify the server for logging (optional)
			await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			setIsSubmitted(true);
			setFormData({ name: "", email: "", subject: "", message: "" });
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Failed to send message. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.contactContainer}>
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
				<span className={styles.breadcrumbCurrent}>Contact</span>
			</nav>

			{/* Main Content */}
			<div className={styles.content}>
				<h1 className={styles.pageTitle}>Contact Us</h1>

				<div className={styles.introSection}>
					<p>
						We&apos;d love to hear from you! Whether you have questions about
						our service, suggestions for improvement, or need assistance with
						your account, we&apos;re here to help.
					</p>
				</div>

				<div className={styles.twoColumn}>
					{/* Contact Form */}
					<div className={styles.formSection}>
						<h2>Send Us a Message</h2>

						{isSubmitted ? (
							<div className={styles.successMessage}>
								<h3>✓ Message Sent Successfully!</h3>
								<p>
									Thank you for contacting us. We&apos;ll get back to you within
									24-48 hours.
								</p>
								<button
									className={styles.newMessageButton}
									onClick={() => setIsSubmitted(false)}
								>
									Send Another Message
								</button>
							</div>
						) : (
							<form className={styles.contactForm} onSubmit={handleSubmit}>
								<div className={styles.formGroup}>
									<label htmlFor="name">Full Name *</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										placeholder="Enter your full name"
									/>
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="email">Email Address *</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										placeholder="Enter your email address"
									/>
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="subject">Subject *</label>
									<select
										id="subject"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										required
									>
										<option value="">Select a subject</option>
										<option value="general">General Inquiry</option>
										<option value="account">Account Support</option>
										<option value="technical">Technical Issue</option>
										<option value="feedback">Feedback & Suggestions</option>
										<option value="partnership">Partnership Inquiry</option>
										<option value="press">Press & Media</option>
									</select>
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="message">Message *</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows={6}
										placeholder="Tell us how we can help you..."
									/>
								</div>

								<button
									type="submit"
									className={styles.submitButton}
									disabled={isSubmitting}
								>
									{isSubmitting ? "Sending..." : "Send Message"}
								</button>
							</form>
						)}
					</div>

					{/* Contact Information */}
					<div className={styles.infoSection}>
						<h2>Other Ways to Reach Us</h2>

						<div className={styles.contactMethod}>
							<h3>📧 Email Support</h3>
							<p>
								<strong>All Inquiries:</strong> thenamenursery@outlook.com
							</p>
							<p>
								<em>
									We handle all support, technical, privacy, and business
									inquiries through our main email.
								</em>
							</p>
						</div>

						<div className={styles.contactMethod}>
							<h3>⏰ Response Times</h3>
							<p>
								<strong>General Inquiries:</strong> 24-48 hours
							</p>
							<p>
								<strong>Technical Support:</strong> 12-24 hours
							</p>
							<p>
								<strong>Urgent Issues:</strong> Same day (business days)
							</p>
						</div>

						<div className={styles.contactMethod}>
							<h3>🕒 Support Hours</h3>
							<p>
								<strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM PST
							</p>
							<p>
								<strong>Weekend:</strong> Limited support available
							</p>
							<p>
								<em>We respond to all messages within one business day.</em>
							</p>
						</div>
					</div>
				</div>

				{/* FAQ Section */}
				<div className={styles.faqSection}>
					<h2>Frequently Asked Questions</h2>

					<div className={styles.faqGrid}>
						<div className={styles.faqItem}>
							<h3>How do I create an account?</h3>
							<p>
								Click the profile button in the top right corner and follow the
								sign-up process using your email or Google account.
							</p>
						</div>

						<div className={styles.faqItem}>
							<h3>Are my saved names private?</h3>
							<p>
								Yes, all your saved names and preferences are private to your
								account and never shared with other users.
							</p>
						</div>

						<div className={styles.faqItem}>
							<h3>How accurate are the name meanings?</h3>
							<p>
								We source our name meanings from reputable databases, but
								recommend cross-referencing for important decisions.
							</p>
						</div>

						<div className={styles.faqItem}>
							<h3>Can I suggest new features?</h3>
							<p>
								Absolutely! We love hearing from users. Use the contact form
								above with &quot;Feedback & Suggestions&quot; as the subject.
							</p>
						</div>
					</div>
				</div>

				{/* Additional Resources */}
				<div className={styles.resourcesSection}>
					<h2>Additional Resources</h2>
					<div className={styles.resourceLinks}>
						<button
							onClick={() => router.push("/about")}
							className={styles.resourceLink}
						>
							📖 About The Name Nursery
						</button>
						<button
							onClick={() => router.push("/privacy-policy")}
							className={styles.resourceLink}
						>
							🔒 Privacy Policy
						</button>
						<button
							onClick={() => router.push("/terms-of-service")}
							className={styles.resourceLink}
						>
							📋 Terms of Service
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
