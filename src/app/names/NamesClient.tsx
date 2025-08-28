"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Header, { Gender } from "../../components/Header";
import styles from "./names.module.css";

export default function NamesClient() {
	const searchParams = useSearchParams();
	const type = (searchParams?.get("type") || "baby") as string;

	const pageColors: Record<string, string> = {
		baby: "#EFD9AA",
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

	const wheelColor = darken(pageColors[type] || "#ffffff", 0.22);

	const alphabet = useMemo(
		() => Array.from({ length: 26 }).map((_, i) => String.fromCharCode(65 + i)),
		[]
	);
	const [index, setIndex] = useState(0);
	const lastScrollRef = useRef<number>(0);
	const touchStartRef = useRef<number | null>(null);
	const wheelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (wheelRef.current) wheelRef.current.focus();
	}, []);

	useEffect(() => {
		const onGlobalKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (target) {
				const tag = target.tagName;
				const editable =
					target.getAttribute &&
					target.getAttribute("contenteditable") === "true";
				if (tag === "INPUT" || tag === "TEXTAREA" || editable) return;
			}
			if (e.key === "ArrowDown" || e.key === "ArrowRight") {
				e.preventDefault();
				setIndex((i) => (i + 1) % alphabet.length);
			} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
				e.preventDefault();
				setIndex((i) => (i - 1 + alphabet.length) % alphabet.length);
			}
		};
		window.addEventListener("keydown", onGlobalKey);
		return () => window.removeEventListener("keydown", onGlobalKey);
	}, [alphabet.length]);

	const onWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const now = Date.now();
		if (now - lastScrollRef.current < 120) return;
		if (Math.abs(e.deltaY) < 5) return;
		lastScrollRef.current = now;
		setIndex(
			(i) => (i + (e.deltaY > 0 ? 1 : -1) + alphabet.length) % alphabet.length
		);
	};

	const onTouchStart = (e: React.TouchEvent) => {
		touchStartRef.current = e.touches[0].clientY;
	};

	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchStartRef.current == null) return;
		const endY = e.changedTouches[0].clientY;
		const delta = endY - touchStartRef.current;
		if (Math.abs(delta) > 30)
			setIndex(
				(i) => (i + (delta > 0 ? -1 : 1) + alphabet.length) % alphabet.length
			);
		touchStartRef.current = null;
	};

		const doSubmit = () => {
			const letter = alphabet[index];
			window.location.href = `/results?type=${encodeURIComponent(type)}&letter=${encodeURIComponent(
				letter
			)}`;
		};

		const submit = (e: React.FormEvent) => {
			e.preventDefault();
			doSubmit();
		};

	const top = alphabet[(index - 1 + alphabet.length) % alphabet.length];
	const center = alphabet[index];
	const bottom = alphabet[(index + 1) % alphabet.length];

	return (
		<div
			className={styles.page}
			style={{ background: pageColors[type] || undefined }}
		>
			<Header type={type as Gender} />
			<main className={styles.centerMain}>
						<form
							className={styles.sentenceForm}
							onSubmit={submit}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									doSubmit();
								}
							}}
						>
					<span className={styles.phrase}>{`A ${
						type.charAt(0).toUpperCase() + type.slice(1)
					} name that starts with`}</span>

					<div
						ref={wheelRef}
						className={styles.wheelColumn}
						tabIndex={0}
						onWheel={onWheel}
						onTouchStart={onTouchStart}
						onTouchEnd={onTouchEnd}
						role="listbox"
						aria-label="Select a starting letter"
					>
						<div className={styles.wheelFaded} style={{ color: wheelColor }}>
							{top}
						</div>
						<div className={styles.wheelCenter} style={{ color: wheelColor }}>
							{center}
						</div>
						<div className={styles.wheelFaded} style={{ color: wheelColor }}>
							{bottom}
						</div>
					</div>

					<button
						className={styles.triangleBtn}
						aria-label="Choose letter"
						type="submit"
					>
						<svg
							width="36"
							height="36"
							viewBox="0 0 32 32"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<polygon points="8,4 28,16 8,28" fill={wheelColor} />
						</svg>
					</button>
				</form>
			</main>
		</div>
	);
}
