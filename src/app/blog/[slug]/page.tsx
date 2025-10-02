"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import styles from "./article.module.css";

interface BlogPost {
	id: string;
	title: string;
	content?: string;
	excerpt: string;
	date: string;
	readTime: string;
	category: string;
	slug: string;
	isAI?: boolean;
}

export default function ArticlePage() {
	const router = useRouter();
	const params = useParams();
	const slug = params.slug as string;

	const [article, setArticle] = useState<BlogPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showCopiedNotification, setShowCopiedNotification] = useState(false);

	// Simple markdown parser
	const parseMarkdownToHtml = (markdown: string): string => {
		let html = markdown;

		// Headers
		html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
		html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
		html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

		// Horizontal rules
		html = html.replace(/^---\s*$/gim, "<hr>");

		// Bold
		html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

		// Italic - process after bold to avoid conflicts
		html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

		// Convert numbered lists
		const lines = html.split("\n");
		const processedLines: string[] = [];
		let inOrderedList = false;
		let inUnorderedList = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();

			// Check for ordered list items
			if (/^\d+\.\s+/.test(line)) {
				if (!inOrderedList) {
					processedLines.push("<ol>");
					inOrderedList = true;
				}
				if (inUnorderedList) {
					processedLines.push("</ul>");
					inUnorderedList = false;
				}
				const content = line.replace(/^\d+\.\s+/, "");
				processedLines.push(`<li>${content}</li>`);
			}
			// Check for unordered list items
			else if (/^-\s+/.test(line)) {
				if (!inUnorderedList) {
					processedLines.push("<ul>");
					inUnorderedList = true;
				}
				if (inOrderedList) {
					processedLines.push("</ol>");
					inOrderedList = false;
				}
				const content = line.replace(/^-\s+/, "");
				processedLines.push(`<li>${content}</li>`);
			}
			// Regular line
			else {
				if (inOrderedList) {
					processedLines.push("</ol>");
					inOrderedList = false;
				}
				if (inUnorderedList) {
					processedLines.push("</ul>");
					inUnorderedList = false;
				}
				processedLines.push(line);
			}
		}

		// Close any remaining lists
		if (inOrderedList) processedLines.push("</ol>");
		if (inUnorderedList) processedLines.push("</ul>");

		html = processedLines.join("\n");

		// Convert double newlines to paragraph breaks
		const paragraphs = html.split(/\n\s*\n/);
		html = paragraphs
			.map((p) => {
				p = p.trim();
				if (
					p &&
					!p.startsWith("<h") &&
					!p.startsWith("<ul>") &&
					!p.startsWith("<ol>") &&
					!p.startsWith("<li>")
				) {
					return `<p>${p}</p>`;
				}
				return p;
			})
			.join("\n\n");

		return html;
	};

	// Theme initialization
	useEffect(() => {
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

	useEffect(() => {
		loadArticle();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug]);

	const loadArticle = async () => {
		setLoading(true);
		setError(null);

		try {
			// For now, we'll generate content dynamically based on the slug
			// In a real app, you'd fetch from a database
			const response = await fetch("/api/generate-article?action=generate");
			const data = await response.json();

			if (data.success) {
				setArticle({
					...data.article,
					slug,
					isAI: true,
				});
			} else {
				setError("Article not found");
			}
		} catch (err) {
			console.error("Error loading article:", err);
			setError("Failed to load article");
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleShare = async () => {
		try {
			// Get current URL
			const currentUrl = window.location.href;

			// Copy to clipboard
			await navigator.clipboard.writeText(currentUrl);

			// Show notification
			setShowCopiedNotification(true);

			// Hide notification after 3 seconds
			setTimeout(() => {
				setShowCopiedNotification(false);
			}, 3000);
		} catch (err) {
			console.error("Failed to copy URL:", err);
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = window.location.href;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);

			setShowCopiedNotification(true);
			setTimeout(() => {
				setShowCopiedNotification(false);
			}, 3000);
		}
	};

	if (loading) {
		return (
			<div className={styles.articleContainer}>
				<PageHeader
					showBackButton={true}
					backButtonText="← Back to Blog"
					backButtonPath="/blog"
				/>
				<div className={styles.loading}>
					<div className={styles.loadingSpinner}></div>
					<p>Loading article...</p>
				</div>
			</div>
		);
	}

	if (error || !article) {
		return (
			<div className={styles.articleContainer}>
				<PageHeader
					showBackButton={true}
					backButtonText="← Back to Blog"
					backButtonPath="/blog"
				/>
				<div className={styles.error}>
					<h2>Article Not Found</h2>
					<p>{error || "The requested article could not be found."}</p>
					<button
						className={styles.backButton}
						onClick={() => router.push("/blog")}
					>
						← Back to Blog
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.articleContainer}>
			<PageHeader
				showBackButton={true}
				backButtonText="← Back to Blog"
				backButtonPath="/blog"
			/>

			{/* Navigation */}
			<nav className={styles.breadcrumbs}>
				<button
					onClick={() => router.push("/")}
					className={styles.breadcrumbLink}
				>
					Home
				</button>
				<span className={styles.breadcrumbSeparator}>›</span>
				<button
					onClick={() => router.push("/blog")}
					className={styles.breadcrumbLink}
				>
					Blog
				</button>
				<span className={styles.breadcrumbSeparator}>›</span>
				<span className={styles.breadcrumbCurrent}>Article</span>
			</nav>

			{/* Article Content */}
			<article className={styles.article}>
				<header className={styles.articleHeader}>
					<div className={styles.articleMeta}>
						<span className={styles.category}>{article.category}</span>
						{article.isAI && (
							<span className={styles.aiTag}>✨ AI Generated</span>
						)}
						<span className={styles.date}>{formatDate(article.date)}</span>
						<span className={styles.readTime}>{article.readTime}</span>
					</div>
					<h1 className={styles.articleTitle}>{article.title}</h1>
					<p className={styles.articleExcerpt}>{article.excerpt}</p>
				</header>

				<div className={styles.articleContent}>
					{article.content ? (
						<div
							dangerouslySetInnerHTML={{
								__html: parseMarkdownToHtml(article.content),
							}}
						/>
					) : (
						<div>
							<p>
								This article is being generated. Please check back soon for the
								full content.
							</p>
						</div>
					)}
				</div>

				<footer className={styles.articleFooter}>
					<div className={styles.shareSection}>
						<h3>Found this helpful?</h3>
						<p>Share this article with other parents-to-be!</p>
						<div className={styles.shareButtons}>
							<button className={styles.shareButton} onClick={handleShare}>
								Share
							</button>
						</div>
					</div>

					<div className={styles.navigation}>
						<button
							className={styles.backButton}
							onClick={() => router.push("/blog")}
						>
							← Back to Blog
						</button>
						<button
							className={styles.homeButton}
							onClick={() => router.push("/")}
						>
							Try Name Generator →
						</button>
					</div>
				</footer>
			</article>

			{/* Copied to clipboard notification */}
			{showCopiedNotification && (
				<div className={styles.notification}>
					<div className={styles.notificationContent}>
						<span className={styles.checkIcon}>✓</span>
						URL copied to clipboard!
					</div>
				</div>
			)}
		</div>
	);
}
