"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import NamesClient from "./NamesClient";
import styles from "./NamesShell.module.css";

export default function NamesShell({ initialType }: { initialType?: string }) {
    const pathname = usePathname();

    // lock body scroll while the overlay is present to prevent scroll jumps
    // (hooks must be called unconditionally before early returns)
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev || "";
        };
    }, []);

    // now check pathname and early-return if navigation already reached /names
    if (pathname?.startsWith("/names")) return null;

    return (
        <div className={styles.overlay} aria-hidden={false}>
            <div className={styles.inner}>
                <NamesClient initialType={initialType} />
            </div>
        </div>
    );
}
