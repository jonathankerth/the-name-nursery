"use client";
import NamesClient from "./NamesClient";

export default function NamesPage() {
	// Render the interactive client component directly. Keeping this route
	// fully client-side avoids server-side suspense/await overhead and makes
	// client navigation feel instant (no server roundtrip to await searchParams).
	return <NamesClient />;
}
