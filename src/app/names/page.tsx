import React from "react";
import NamesClient from "./NamesClient";

export default function NamesPage() {
	// render the client component directly to avoid showing any suspense fallback
	return <NamesClient />;
}
