"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import {
	getBlogPosts,
	initializeBlogPosts,
	shouldGenerateNewPost,
	generateAndSaveNewPost,
	BlogPost,
} from "@/lib/blogService";
import styles from "./blog.module.css";

export default function BlogPage() {
	const router = useRouter();
	const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
	const [loading, setLoading] = React.useState(true);

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

	// Load blog posts from Firebase with fallback
	React.useEffect(() => {
		const loadContent = async () => {
			setLoading(true);
			try {
				// First try to initialize blog posts in Firebase if needed
				await initializeBlogPosts();

				// Then get posts from Firebase
				const posts = await getBlogPosts();

				setBlogPosts(posts);

				// Check if new post generation is needed
				if (posts.length > 0) {
					const shouldGenerate = await shouldGenerateNewPost();
					if (shouldGenerate) {
						const newPost = await generateAndSaveNewPost();
						if (newPost) {
							setBlogPosts((prev) => [newPost, ...prev]);
						}
					}
				}
			} catch {
				// Set empty array on error - no fallbacks
				setBlogPosts([]);
			} finally {
				setLoading(false);
			}
		};

		loadContent();
	}, []);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (loading) {
		return (
			<div className={styles.blogContainer}>
				<PageHeader />
				<div className={styles.loading}>
					<div className={styles.loadingSpinner}></div>
					<p>Loading articles...</p>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.blogContainer}>
			{/* Breadcrumb Schema */}
			<BreadcrumbSchema
				items={[
					{ name: "Home", url: "https://www.thenamenursery.com" },
					{ name: "Blog", url: "https://www.thenamenursery.com/blog" },
				]}
			/>

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
				<span className={styles.breadcrumbCurrent}>Blog</span>
			</nav>

			{/* Main Content */}
			<div className={styles.content}>
				<div className={styles.blogHeader}>
					<h1 className={styles.pageTitle}>Get Inspired</h1>
					<p className={styles.pageSubtitle}>
						Discover insights and guidance to help you find the perfect baby
						name. New AI-powered articles are generated every 3 days!
					</p>
				</div>

				{/* No Posts Message */}
				{blogPosts.length === 0 && (
					<div className={styles.noPostsMessage}>
						<h2>No articles available</h2>
						<p>Please check back later or refresh the page.</p>
					</div>
				)}

				{/* Featured Post */}
				{blogPosts.length > 0 && (
					<div className={styles.featuredSection}>
						<h2 className={styles.sectionTitle}>Latest Article</h2>
						<article className={styles.featuredPost}>
							<div className={styles.featuredContent}>
								<div className={styles.postMeta}>
									{blogPosts[0].isAI && (
										<span className={styles.aiTag}>✨ AI Generated</span>
									)}
									<span className={styles.date}>
										{formatDate(blogPosts[0].date)}
									</span>
									<span className={styles.readTime}>
										{blogPosts[0].readTime}
									</span>
								</div>
								<h3 className={styles.featuredTitle}>{blogPosts[0].title}</h3>
								<p className={styles.featuredExcerpt}>{blogPosts[0].excerpt}</p>
								<button
									className={styles.readMoreButton}
									onClick={() => router.push(`/blog/${blogPosts[0].slug}`)}
								>
									Read Full Article →
								</button>
							</div>
						</article>
					</div>
				)}

				{/* All Posts */}
				<div className={styles.postsSection}>
					<h2 className={styles.sectionTitle}>All Articles</h2>
					<div className={styles.postsGrid}>
						{blogPosts.slice(1).map((post: BlogPost) => (
							<article key={post.id} className={styles.postCard}>
								<div className={styles.postMeta}>
									{post.isAI && (
										<span className={styles.aiTag}>✨ AI Generated</span>
									)}
									<span className={styles.date}>{formatDate(post.date)}</span>
								</div>
								<h3 className={styles.postTitle}>{post.title}</h3>
								<p className={styles.postExcerpt}>{post.excerpt}</p>
								<div className={styles.postFooter}>
									<span className={styles.readTime}>{post.readTime}</span>
									<button
										className={styles.readMoreLink}
										onClick={() => router.push(`/blog/${post.slug}`)}
									>
										Read More →
									</button>
								</div>
							</article>
						))}
					</div>
				</div>

				{/* Info Section */}
				<div className={styles.infoSection}>
					<div className={styles.infoContent}>
						<h2>About Our Articles</h2>
						<p>
							Our blog combines carefully curated content with AI-generated
							insights to provide you with comprehensive guidance on baby
							naming. New articles are automatically generated when users log in
							after 3 days, ensuring fresh content without overwhelming our
							systems.
						</p>
						<p>
							Ready to put these insights into practice?{" "}
							<button
								onClick={() => router.push("/")}
								className={styles.inlineLink}
							>
								Try our interactive name generator
							</button>{" "}
							or{" "}
							<button
								onClick={() => router.push("/explore")}
								className={styles.inlineLink}
							>
								explore trending names
							</button>{" "}
							to discover your perfect baby name.
						</p>
						<div className={styles.infoStats}>
							<div className={styles.stat}>
								<strong>{blogPosts.length}</strong>
								<span>Total Articles</span>
							</div>
							<div className={styles.stat}>
								<strong>{blogPosts.filter((p) => p.isAI).length}</strong>
								<span>AI Generated</span>
							</div>
							<div className={styles.stat}>
								<strong>{blogPosts.filter((p) => !p.isAI).length}</strong>
								<span>Curated Content</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
