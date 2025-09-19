import type { Metadata } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "../contexts/AuthContext";
import Footer from "../components/Footer";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

const crimsonText = Crimson_Text({
	variable: "--font-crimson-text",
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
	title: "The Name Nursery - Discover Perfect Baby Names",
	description:
		"Find the perfect baby name with our interactive name generator. Explore thousands of meaningful names from different cultures, origins, and inspirations. Get personalized name recommendations for boys, girls, and gender-neutral options.",
	keywords:
		"baby names, name generator, boy names, girl names, gender neutral names, name meanings, baby naming, cultural names, unique names, popular names",
	authors: [
		{
			name: "Jonathan Gallardo-Kerth",
			url: "https://www.linkedin.com/in/jonathankerth/",
		},
		{ name: "Zac Holman", url: "https://www.linkedin.com/in/zac-holman/" },
	],
	creator: "Jonathan Gallardo-Kerth & Zac Holman",
	publisher: "The Name Nursery",
	openGraph: {
		title: "The Name Nursery - Discover Perfect Baby Names",
		description:
			"Find the perfect baby name with our interactive name generator. Explore meaningful names from different cultures and get personalized recommendations.",
		url: "https://www.thenamenursery.com",
		siteName: "The Name Nursery",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "The Name Nursery - Discover Perfect Baby Names",
		description:
			"Find the perfect baby name with our interactive name generator.",
		creator: "@thenamenursery",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			"index": true,
			"follow": true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

	return (
		<html lang="en" style={{ background: "var(--background)" }}>
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<meta name="google-adsense-account" content="ca-pub-1895631836444724" />
				<meta
					name="google-site-verification"
					content="BHOA515GANMUAP2tKVJadskikxEcZgwrdl9ghPtPW_0"
				/>
				<link rel="canonical" href="https://www.thenamenursery.com" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, viewport-fit=cover"
				/>
				<meta name="theme-color" content="#d3f3c8" />
				<link rel="manifest" href="/site.webmanifest" />
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
					crossOrigin="anonymous"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
				<link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

				{/* Google AdSense */}
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1895631836444724"
					crossOrigin="anonymous"
				></script>

				{/* Google Consent Management Platform */}
				<script
					async
					src="https://fundingchoicesmessages.google.com/i/pub-1895631836444724/consent?base_cid=1895631836444724"
				></script>
			</head>
			<body
				className={`${inter.variable} ${crimsonText.variable}`}
				style={{ background: "var(--background)" }}
				suppressHydrationWarning={true}
			>
				{/* Firebase Warning Suppression */}
				{/* Schema.org structured data */}
				<Script
					id="schema-organization"
					type="application/ld+json"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							"name": "The Name Nursery",
							"description":
								"Your trusted companion for discovering perfect baby names. We help expecting parents explore meaningful names from cultures around the world.",
							"url": "https://www.thenamenursery.com",
							"logo": "https://www.thenamenursery.com/favicon.ico",
							"sameAs": [
								"https://www.linkedin.com/in/jonathankerth/",
								"https://www.linkedin.com/in/zac-holman/",
							],
							"founder": [
								{
									"@type": "Person",
									"name": "Jonathan Gallardo-Kerth",
									"url": "https://www.linkedin.com/in/jonathankerth/",
								},
								{
									"@type": "Person",
									"name": "Zac Holman",
									"url": "https://www.linkedin.com/in/zac-holman/",
								},
							],
							"contactPoint": {
								"@type": "ContactPoint",
								"contactType": "Customer Service",
								"email": "thenamenursery@outlook.com",
							},
						}),
					}}
				/>
				<Script
					id="schema-website"
					type="application/ld+json"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							"name": "The Name Nursery",
							"alternateName": "Name Nursery",
							"description":
								"Find the perfect baby name with our interactive name generator. Explore meaningful names from different cultures and get personalized recommendations.",
							"url": "https://www.thenamenursery.com",
							"publisher": {
								"@type": "Organization",
								"name": "The Name Nursery",
							},
							"potentialAction": {
								"@type": "SearchAction",
								"target": {
									"@type": "EntryPoint",
									"urlTemplate":
										"https://www.thenamenursery.com/?search={search_term_string}",
								},
								"query-input": "required name=search_term_string",
							},
							"mainEntity": {
								"@type": "WebApplication",
								"name": "Baby Name Generator",
								"description":
									"Interactive baby name generator with AI-powered recommendations",
								"applicationCategory": "UtilitiesApplication",
								"operatingSystem": "Web Browser",
							},
						}),
					}}
				/>
				{/* Google Analytics */}
				{GA_TRACKING_ID && (
					<>
						<Script
							id="consent-mode"
							strategy="beforeInteractive"
							dangerouslySetInnerHTML={{
								__html: `
									window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('consent', 'default', {
										'ad_storage': 'denied',
										'ad_user_data': 'denied',
										'ad_personalization': 'denied',
										'analytics_storage': 'denied'
									});
								`,
							}}
						/>
						<Script
							strategy="afterInteractive"
							src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
						/>
						<Script
							id="gtag-init"
							strategy="afterInteractive"
							dangerouslySetInnerHTML={{
								__html: `
									gtag('js', new Date());
									gtag('config', '${GA_TRACKING_ID}', {
										page_path: window.location.pathname,
									});
								`,
							}}
						/>
					</>
				)}{" "}
				{/* Critical CSS for instant paint */}
				<style
					dangerouslySetInnerHTML={{
						__html: `
							:root { --background: #ffffff; }
							#app-root { background: var(--background); min-height: 100vh; }
							@media (prefers-color-scheme: dark) {
								:root { --background: #0a0a0a; }
							}
							/* critical header styles to prevent layout shift */
							header { min-height: 72px; display: flex; flex-direction: column; align-items: center; padding: 20px 0 8px 0; }
							header h1 { font-size: 2rem; font-weight: 700; margin: 0; line-height: 1.2; letter-spacing: -0.6px; }
							/* critical page styles for instant paint */
							.page { min-height: 100vh; display: flex; flex-direction: column; }
							.centerMain { width: 100%; flex: 1; display: flex; align-items: center; justify-content: center; }
							/* ensure fonts load with fallback */
							body { font-family: var(--font-crimson-text), var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
						`,
					}}
				/>
				<div id="app-root">
					<AuthProvider>
						<div
							style={{
								minHeight: "100vh",
								display: "flex",
								flexDirection: "column",
							}}
						>
							{children}
							<Footer />
						</div>
					</AuthProvider>
				</div>
			</body>
		</html>
	);
}
