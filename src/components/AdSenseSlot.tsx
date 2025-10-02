import { useEffect, useRef, useState } from "react";

declare global {
	interface Window {
		adsbygoogle?: unknown[];
	}
}

/**
 * Google AdSense Responsive Ad Slot
 * Place this component on a content-rich page (e.g., homepage, blog, results page)
 * Replace data-ad-slot with your AdSense slot ID from your AdSense dashboard
 */
const AdSenseSlot = () => {
	const [adLoaded, setAdLoaded] = useState(false);
	const insRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined" && insRef.current) {
			try {
				window.adsbygoogle = window.adsbygoogle || [];
				window.adsbygoogle.push({});
			} catch {
				// Ignore AdSense push errors
			}
		}
	}, []);

	// AdSense does not provide a direct onLoad event, so we use MutationObserver to detect ad rendering
	useEffect(() => {
		if (!insRef.current) return;
		const observer = new MutationObserver(() => {
			if (insRef.current && insRef.current.querySelector("iframe")) {
				setAdLoaded(true);
			}
		});
		observer.observe(insRef.current, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={insRef}
			style={{
				height: adLoaded ? undefined : 0,
				overflow: adLoaded ? undefined : "hidden",
				width: "100%",
				transition: "height 0.3s",
			}}
		>
			<ins
				className="adsbygoogle"
				style={{ display: adLoaded ? "block" : "none", width: "100%" }}
				data-ad-client="ca-pub-1895631836444724"
				data-ad-slot="YOUR_SLOT_ID" // TODO: Replace with your AdSense slot ID
				data-ad-format="auto"
				data-full-width-responsive="true"
			></ins>
		</div>
	);
};

export default AdSenseSlot;
