import React, { Suspense } from "react";
import NamesClient from "./NamesClient";

export default function NamesPage() {
	// Wrap the client component in Suspense so client-only hooks like
	// useSearchParams() are safely handled during server rendering/prerender.
	return (
		<Suspense fallback={<div style={{ display: "none" }} />}>
			<NamesClient />
		</Suspense>
	);
}
