"use client";
import React, { useEffect, useState } from "react";
import styles from "./header.module.css";

export type Gender = "baby" | "girl" | "boy";

export default function Header({ type: propType }: { type?: Gender }) {
	const [queryType, setQueryType] = useState<Gender | null>(null);

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

	return (
		<header className={styles.header}>
			<h1 className={styles.title} style={{ color: headerColor }}>
				The Name Nursery
			</h1>
		</header>
	);
}
