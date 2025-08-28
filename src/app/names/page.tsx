import React from "react";
import NamesClient from "./NamesClient";

export default function NamesPage() {
	return (
		<React.Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
			<NamesClient />
		</React.Suspense>
	);
}
