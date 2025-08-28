"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./FloatingRestart.module.css";

export default function FloatingRestart() {
  const router = useRouter();
  const pathname = usePathname();
  // prefetch the home route for quicker transitions
  React.useEffect(() => {
    router.prefetch("/");
  }, [router]);

  // hide the floating restart on the alphabet (/names) page
  if (pathname && pathname.startsWith("/names")) return null;

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
