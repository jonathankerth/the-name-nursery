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

			// Create the document structure for Trigger Email extension
			// Following the official docs format exactly
			const emailDocument = {
				// Required fields for Trigger Email extension (exact format from docs)
				to: "thenamenursery@outlook.com", // Try string format first
				message: {
					subject: `New Contact from The Name Nursery: ${formData.name}`,
					text: `New contact message from The Name Nursery website:

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

Please respond to: ${formData.email}

This message was sent via The Name Nursery contact form on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.`,
					html: `
						<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
							<h2 style="color: #2d3748; border-bottom: 2px solid #4ade80; padding-bottom: 10px;">
								New Contact Message from The Name Nursery
							</h2>
							<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
								<p><strong>Name:</strong> ${formData.name}</p>
								<p><strong>Email:</strong> ${formData.email}</p>
								<p><strong>Subject:</strong> ${formData.subject}</p>
							</div>
							<div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
								<h4 style="margin-top: 0; color: #2d3748;">Message:</h4>
								<p style="line-height: 1.6; color: #4a5568;">${formData.message.replace(/\n/g, '<br>')}</p>
							</div>
							<hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
							<p style="color: #718096; font-size: 14px;">
								Please respond to: <a href="mailto:${formData.email}" style="color: #4ade80;">${formData.email}</a>
							</p>
							<p style="color: #718096; font-size: 12px;">
								This message was sent via The Name Nursery contact form on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.
							</p>
						</div>
					`
				},
				// Store original details for your records in the same document
				senderName: formData.name,
				senderEmail: formData.email,
				senderSubject: formData.subject,
				originalMessage: formData.message,
				timestamp: serverTimestamp(),
				processed: false, // You can use this to track if you've responded
			};

			// Save to the 'mail' collection as expected by the Trigger Email extension
			const docRef = await addDoc(
				collection(db, "mail"),
				emailDocument
			);
			console.log("Email queued for delivery via Trigger Email extension with ID:", docRef.id);

			// The Trigger Email extension will automatically detect this document in the 'mail' collection
			// and send an email to thenamenursery@outlook.com
			// You can monitor delivery status in Firebase Console under the 'mail' collection

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
