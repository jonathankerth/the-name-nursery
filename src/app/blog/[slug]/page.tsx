"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

	if (loading) {
		return (
			<div className={styles.articleContainer}>
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
			{/* Header */}
			<div className={styles.header}>
				<button
					className={styles.titleButton}
					onClick={() => router.push("/")}
					aria-label="Go to home page"
				>
					<h1 className={styles.mainTitle}>The Name Nursery</h1>
				</button>
			</div>

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
								__html: article.content.replace(/\n/g, "<br/>"),
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
							<button className={styles.shareButton}>Share</button>
							<button className={styles.bookmarkButton}>Bookmark</button>
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
		</div>
	);
}
