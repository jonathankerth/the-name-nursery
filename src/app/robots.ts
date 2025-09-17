import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/profile/",
					"/_next/",
					"/private/",
					"/admin/",
					"/*?*signin=*",
					"/*?*auth=*",
				],
			},
			{
				userAgent: "GPTBot",
				disallow: "/",
			},
			{
				userAgent: "ChatGPT-User",
				disallow: "/",
			},
			{
				userAgent: "CCBot",
				disallow: "/",
			},
			{
				userAgent: "anthropic-ai",
				disallow: "/",
			},
		],
		sitemap: "https://www.thenamenursery.com/sitemap.xml",
		host: "https://www.thenamenursery.com",
	};
}
