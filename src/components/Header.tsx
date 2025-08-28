"use client";
import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import styles from "./header.module.css";

export type Gender = "baby" | "girl" | "boy";

export default function Header({ type: propType }: { type?: Gender }) {
  const searchParams = useSearchParams();
  const queryType = (searchParams?.get("type") || null) as Gender | null;
  const type = (propType as Gender) || queryType || "baby";
  const pathname = usePathname();
  const router = useRouter();

  const pageColors: Record<Gender, string> = {
    baby: "#EFD9AA",
    boy: "#B7E9F0",
    girl: "#EDD5EB",
  };

  const darken = (hex: string, amount = 0.22) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const dr = Math.max(0, Math.round(r * (1 - amount)));
    const dg = Math.max(0, Math.round(g * (1 - amount)));
    const db = Math.max(0, Math.round(b * (1 - amount)));
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
  };

  const headerColor = darken(pageColors[type] || '#111827', 0.22);

  return (
    <header className={styles.header}>
      <h1 className={styles.title} style={{ color: headerColor }}>
        The Name Nursery
      </h1>
      {pathname !== "/" && (
        <button
          className={styles.restart}
          aria-label="Restart"
          onClick={() => router.push("/")}
        >
          Restart
        </button>
      )}
    </header>
  );
}
