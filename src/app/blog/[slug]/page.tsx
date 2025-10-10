"use client";
import React, { useEffect, useState } from "react";
import { marked } from "marked";
import Image from "next/image";
import { useParams } from "next/navigation";
import AdSenseSlot from "@/components/AdSenseSlot";
// import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import styles from "./article.module.css";

type BlogPost = {
	title: string;
	slug: string;
	content: string;
	publishedAt: string;
	author?: string;
	coverImage?: string;
	excerpt?: string;
};

export default function BlogArticlePage() {
	const params = useParams<{ slug: string }>();
	const [post, setPost] = useState<BlogPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchPost() {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(`/api/blog/${params.slug}`);
				if (!res.ok) throw new Error("Not found");
				const data = await res.json();
				setPost(data);
			} catch {
				setError("Article not found");
			} finally {
				setLoading(false);
			}
		}
		if (params.slug) fetchPost();
	}, [params.slug]);

	if (loading) {
		return (
			<main className={styles.articleContainer}>
				<header className={styles.header}>
					<h1 className={styles.mainTitle}>The Name Nursery</h1>
				</header>
				<div>Loading article...</div>
			</main>
		);
	}

	if (error || !post) {
		return (
			<main className={styles.articleContainer}>
				<header className={styles.header}>
					<h1 className={styles.mainTitle}>The Name Nursery</h1>
				</header>
				<div>{error || "Article not found."}</div>
			</main>
		);
	}

	const showAd = post.content && post.content.length > 300;

	return (
		<main className={styles.articleContainer}>
			{/* Global header */}
			<header className={styles.header}>
				<h1 className={styles.mainTitle}>The Name Nursery</h1>
			</header>

			{/* Back button and article title */}
			<div
				style={{
					width: "100vw",
					position: "relative",
					left: "calc(-50vw + 50%)",
					margin: "0 0 1.2rem 0",
					display: "flex",
					justifyContent: "flex-start",
				}}
			>
				<Link href="/blog" className={styles.styledBackButton}>
					← Back to Blog
				</Link>
			</div>
			{post.coverImage && (
				<Image
					src={post.coverImage}
					alt={post.title}
					className={styles.coverImage}
					width={800}
					height={400}
					priority={true}
				/>
			)}
			<article className={styles.articleContent}>
				<div
					dangerouslySetInnerHTML={{ __html: marked.parse(post.content || "") }}
				/>
			</article>
			{showAd && (
				<div className={styles.adContainer}>
					<AdSenseSlot />
				</div>
			)}
		</main>
	);
}
