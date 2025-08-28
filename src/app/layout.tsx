import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingRestart from "@/components/FloatingRestart";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
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
					// set the initial css variable so page scripts can flip it before navigation
					style={{ background: "var(--background)", /* fallback while CSS loads */ }}
				>
					<body
						className={`${geistSans.variable} ${geistMono.variable}`}
						style={{ background: "var(--background)" }}
					>
						{/* Inline styles ensure an immediate CSS custom property is available before global CSS loads */}
						<style
							dangerouslySetInnerHTML={{
								__html: `
									:root { --background: #ffffff; }
									#app-root { background: var(--background); }
									@media (prefers-color-scheme: dark) {
										:root { --background: #0a0a0a; }
									}
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
