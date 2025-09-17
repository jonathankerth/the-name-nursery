import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://www.thenamenursery.com";

	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/explore`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/privacy-policy`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/terms-of-service`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
	];

	// Dynamic blog posts - add common blog post slugs based on our initial posts
	const blogPosts = [
		{
			slug: "psychology-baby-name-selection",
			lastModified: "2024-12-15",
		},
		{
			slug: "global-naming-traditions",
			lastModified: "2024-12-10",
		},
		{
			slug: "gender-neutral-names-trend",
			lastModified: "2024-12-05",
		},
		{
			slug: "nature-inspired-baby-names",
			lastModified: "2024-12-01",
		},
		{
			slug: "name-pronunciation-science",
			lastModified: "2024-11-28",
		},
	];

	const dynamicPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: new Date(post.lastModified),
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	return [...staticPages, ...dynamicPages];
}
