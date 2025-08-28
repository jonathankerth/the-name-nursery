"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTransitionCleaner(): null {
	const pathname = usePathname();
	useEffect(() => {
		const root = document.getElementById("app-root");
		if (!root) return;
		// apply a neutral background during route changes to avoid black flash
		const bodyStyle = getComputedStyle(document.body);
		let bg = bodyStyle.backgroundColor;
		// handle cases where computed background is transparent (rgba(0,0,0,0) or 'transparent')
		if (!bg || bg === "transparent" || bg.startsWith("rgba(0, 0, 0, 0")) {
			const docStyle = getComputedStyle(document.documentElement);
			bg = (docStyle.getPropertyValue("--background") || "#ffffff").trim() || "#ffffff";
		}
				root.style.background = bg;
				// hold a neutral background briefly while the next page paints to avoid
				// a black flash on first navigation. We set 300ms which is usually enough
				// for the next page to render its background on modern devices.
				const t = setTimeout(() => (root.style.background = "transparent"), 300);
				return () => clearTimeout(t);
	}, [pathname]);

	return null;
}

// Named export for tooling that may require explicit symbols
export const __PageTransitionCleaner = PageTransitionCleaner;
