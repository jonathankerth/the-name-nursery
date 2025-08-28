"use client";
import React, { createContext, useContext, useState } from "react";
import styles from "./LoadingProvider.module.css";

const LoadingContext = createContext<{
	setLoading: (v: boolean) => void;
} | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
	const [show, setShow] = useState(false);
	return (
		<LoadingContext.Provider value={{ setLoading: setShow }}>
			{children}
			<div
				className={`${styles.overlay} ${show ? styles.show : ""}`}
				role="status"
			>
				<div className={styles.spinner} />
			</div>
		</LoadingContext.Provider>
	);
}

export function useLoading() {
	const ctx = useContext(LoadingContext);
	if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
	return ctx;
}
