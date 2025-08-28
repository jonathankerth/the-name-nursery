"use client";
import React from "react";
import styles from "./FloatingRestart.module.css";

export default function FloatingRestart() {
  return (
    <div className={styles.floating}>
      <button
        className={styles.btn}
        aria-label="Restart"
        onClick={() => (window.location.href = "/")}
      >
        Restart
      </button>
    </div>
  );
}
