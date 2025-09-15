import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", "/profile/", "/social/"],
		},
		sitemap: "https://www.thenamenursery.com/sitemap.xml",
	};
}
