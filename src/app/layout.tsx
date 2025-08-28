import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingRestart from "@/components/FloatingRestart";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap", // prevent font blocking
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap", // prevent font blocking
});

export const metadata: Metadata = {
	title: "The Name Nursery",
	description: "Explore baby names and generate ideas with The Name Nursery",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			style={{ background: "var(--background)" }}
		>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable}`}
				style={{ background: "var(--background)" }}
			>
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
							body { font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
						`,
					}}
				/>
				<div id="app-root">
					{children}
					<FloatingRestart />
				</div>
			</body>
		</html>
	);
}
