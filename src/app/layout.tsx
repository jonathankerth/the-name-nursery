import type { Metadata } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "../contexts/AuthContext";

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
	title: "The Name Nursery",
	description: "Explore baby names and generate ideas with The Name Nursery",
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
			</head>
			<body
				className={`${inter.variable} ${crimsonText.variable}`}
				style={{ background: "var(--background)" }}
			>
				{/* Firebase Warning Suppression */}
				<Script
					id="firebase-warning-suppression"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: `
							// Completely suppress Firebase connection warnings in development
							if (typeof window !== 'undefined' && typeof console !== 'undefined') {
								const originalWarn = console.warn;
								const originalError = console.error;
								const originalLog = console.log;
								
								console.warn = function(...args) {
									const message = args.join(' ');
									if (
										message.includes('webchannel') ||
										message.includes('persistent_stream') ||
										message.includes('stream_bridge') ||
										message.includes('Firestore') ||
										message.includes('backoff') ||
										message.includes('remote_store') ||
										message.includes('async_queue') ||
										message.includes('defaultLogHandler') ||
										message.includes('__PRIVATE_')
									) {
										return; // Don't log Firebase internal warnings
									}
									originalWarn.apply(console, args);
								};
								
								console.error = function(...args) {
									const message = args.join(' ');
									if (
										message.includes('webchannel') ||
										message.includes('persistent_stream') ||
										message.includes('stream_bridge') ||
										message.includes('backoff') ||
										message.includes('remote_store') ||
										message.includes('__PRIVATE_')
									) {
										return; // Don't log Firebase internal errors
									}
									originalError.apply(console, args);
								};
								
								console.log = function(...args) {
									const message = args.join(' ');
									if (
										message.includes('Firebase initialized successfully')
									) {
										return; // Don't log our Firebase init message
									}
									originalLog.apply(console, args);
								};
							}
						`,
					}}
				/>

				{/* Google Analytics */}
				{GA_TRACKING_ID && (
					<>
						<Script
							strategy="afterInteractive"
							src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
						/>
						<Script
							id="gtag-init"
							strategy="afterInteractive"
							dangerouslySetInnerHTML={{
								__html: `
									window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());
									gtag('config', '${GA_TRACKING_ID}', {
										page_path: window.location.pathname,
									});
								`,
							}}
						/>
					</>
				)}

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
					<AuthProvider>{children}</AuthProvider>
				</div>
			</body>
		</html>
	);
}
