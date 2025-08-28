

"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import Header from "../components/Header";

export default function Home() {
	const [picked, setPicked] = useState<"baby" | "girl" | "boy">("baby");

	const options = useMemo(() => [
		{ label: "Baby", value: "baby" },
		{ label: "Girl", value: "girl" },
		{ label: "Boy", value: "boy" },
	], []);

		  // Wheel effect logic
						const selectedIndex = options.findIndex(opt => opt.value === picked);
						const lastScrollRef = useRef<number>(0);
						const touchStartRef = useRef<number | null>(null);
						const wheelRef = useRef<HTMLDivElement | null>(null);

						useEffect(() => {
							// Add a global keydown handler so arrow keys always work,
							// even when the wheel isn't focused. Ignore when typing in inputs.
							const changeByLocal = (delta: number) => {
								const idx = options.findIndex(opt => opt.value === picked);
								const newIdx = (idx + delta + options.length) % options.length;
								setPicked(options[newIdx].value as "baby" | "girl" | "boy");
							};

							const onGlobalKey = (e: KeyboardEvent) => {
								const target = e.target as HTMLElement | null;
								if (target) {
									const tag = target.tagName;
									const editable = target.getAttribute && (target.getAttribute('contenteditable') === 'true');
									if (tag === 'INPUT' || tag === 'TEXTAREA' || editable) return;
								}
								if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
									e.preventDefault();
									changeByLocal(1);
								} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
									e.preventDefault();
									changeByLocal(-1);
								}
							};
							window.addEventListener('keydown', onGlobalKey);
							return () => window.removeEventListener('keydown', onGlobalKey);
						}, [picked, options]);

						const changeBy = (delta: number) => {
							const idx = options.findIndex(opt => opt.value === picked);
							const newIdx = (idx + delta + options.length) % options.length;
							setPicked(options[newIdx].value as "baby" | "girl" | "boy");
						};

						const onWheel = (e: React.WheelEvent) => {
							e.preventDefault();
							const now = Date.now();
							if (now - lastScrollRef.current < 150) return; // throttle
							if (Math.abs(e.deltaY) < 5) return;
							lastScrollRef.current = now;
							changeBy(e.deltaY > 0 ? 1 : -1);
						};

						const onKeyDown = (e: React.KeyboardEvent) => {
							if (e.key === "ArrowDown" || e.key === "ArrowRight") {
								e.preventDefault();
								changeBy(1);
							} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
								e.preventDefault();
								changeBy(-1);
							}
						};

						const onTouchStart = (e: React.TouchEvent) => {
							touchStartRef.current = e.touches[0].clientY;
						};

						const onTouchEnd = (e: React.TouchEvent) => {
							if (touchStartRef.current == null) return;
							const endY = e.changedTouches[0].clientY;
							const delta = endY - touchStartRef.current;
							if (Math.abs(delta) > 30) {
								changeBy(delta > 0 ? -1 : 1); // swipe up -> next
							}
							touchStartRef.current = null;
						};
				// Wheel order: [top, center, bottom]
				const getWheelOrder = () => {
					if (selectedIndex === 0) return [2, 0, 1]; // Baby selected
					if (selectedIndex === 1) return [0, 1, 2]; // Girl selected
					return [1, 2, 0]; // Boy selected
				};

					const pageColors: Record<string, string> = {
						baby: "#EFD9AA",
						boy: "#B7E9F0",
						girl: "#EDD5EB",
					};

					const darken = (hex: string, amount = 0.22) => {
						const c = hex.replace('#','');
						const r = parseInt(c.substring(0,2),16);
						const g = parseInt(c.substring(2,4),16);
						const b = parseInt(c.substring(4,6),16);
						const dr = Math.max(0, Math.round(r * (1 - amount)));
						const dg = Math.max(0, Math.round(g * (1 - amount)));
						const db = Math.max(0, Math.round(b * (1 - amount)));
						const toHex = (v:number) => v.toString(16).padStart(2,'0');
						return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
					};

					const wheelColor = darken(pageColors[picked] || '#111827', 0.22);

					return (
						<div className={styles.page} style={{ background: pageColors[picked] || undefined }}>
						<Header type={picked} />
						<main className={styles.centerMain}>
									<form className={styles.sentenceForm} onSubmit={e => { e.preventDefault(); /* navigate to next page with selected type */ window.location.href = `/names?type=${picked}`; }}>
										<span className={styles.fixedA}>A</span>
													<div
														ref={wheelRef}
														className={styles.wheelColumn}
														onWheel={onWheel}
														onKeyDown={onKeyDown}
														onTouchStart={onTouchStart}
														onTouchEnd={onTouchEnd}
														tabIndex={0}
														role="listbox"
														aria-label="Name type selector"
													>
											<div className={styles.wheelOptionFaded} style={{ color: wheelColor }}>{options[getWheelOrder()[0]].label}</div>
											<div className={styles.wheelOptionSelected} style={{ color: wheelColor }}>{options[getWheelOrder()[1]].label}</div>
											<div className={styles.wheelOptionFaded} style={{ color: wheelColor }}>{options[getWheelOrder()[2]].label}</div>
										</div>
										<span className={styles.fixedName}>Name</span>
										<button
											type="submit"
											className={styles.triangleBtn}
											disabled={!picked}
											aria-label="Submit"
										>
											<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
												<polygon points="8,4 28,16 8,28" fill={wheelColor} />
											</svg>
										</button>
									</form>
                        
						</main>
					</div>
				);
}
