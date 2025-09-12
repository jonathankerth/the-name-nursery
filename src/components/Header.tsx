"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

export type Gender = "baby" | "girl" | "boy";

export default function Header({
	type: propType,
	showRestartButton,
}: {
	type?: Gender;
	showRestartButton?: boolean;
}) {
	const [queryType, setQueryType] = useState<Gender | null>(null);
	const pathname = usePathname();

	useEffect(() => {
		try {
			const params = new URLSearchParams(window.location.search);
			const q = (params.get("type") || null) as Gender | null;
			setQueryType(q);
			// keep pathname logic removed since header no longer conditionally renders restart
		} catch {
			// noop
		}
	}, []);

	const type = (propType as Gender) || queryType || "baby";

	const pageColors: Record<Gender, string> = {
		baby: "#d3f3c8",
		boy: "#B7E9F0",
		girl: "#EDD5EB",
	};

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

	const headerColor = darken(pageColors[type] || "#111827", 0.6);

	// Determine redirect URL based on current page and environment
	const getRedirectUrl = () => {
		const isLocalhost =
			typeof window !== "undefined" &&
			(window.location.hostname === "localhost" ||
				window.location.hostname === "127.0.0.1" ||
				window.location.hostname.includes(".local"));

		if (pathname === "/profile" || pathname === "/explore") {
			return "/";
		}

		// For localhost/development, go to root, otherwise go to external site
		return isLocalhost ? "/" : "https://www.thenamenursery.com/";
	};

	const getAriaLabel = () => {
		if (pathname === "/profile" || pathname === "/explore") {
			return "Go to home page";
		}
		return "Go to The Name Nursery website";
	};

	return (
		<header className={styles.header}>
			{pathname === "/" && !showRestartButton ? (
				<h1 className={styles.title} style={{ color: headerColor }}>
					The Name Nursery
				</h1>
			) : (
				<button
					className={styles.titleButton}
					onClick={() => {
						const url = getRedirectUrl();
						if (url.startsWith("http")) {
							window.location.href = url;
						} else {
							// For internal routes, we need to import and use Next.js router
							window.location.href = url;
						}
					}}
					aria-label={getAriaLabel()}
				>
					<h1 className={styles.title} style={{ color: headerColor }}>
						The Name Nursery
					</h1>
				</button>
			)}
		</header>
	);
}
