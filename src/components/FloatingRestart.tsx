"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./FloatingRestart.module.css";

export default function FloatingRestart() {
  const router = useRouter();
  return (
    <div className={styles.floating}>
      <button
        className={styles.btn}
        aria-label="Restart"
        onClick={() => router.push("/")}
      >
        Restart
      </button>
    </div>
  );
}
