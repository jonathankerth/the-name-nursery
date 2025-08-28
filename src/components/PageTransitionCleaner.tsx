"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTransitionCleaner() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.getElementById("app-root");
    if (!root) return;
    // apply a neutral background during route changes to avoid black flash
    root.style.background = getComputedStyle(document.body).backgroundColor || "#fff";
    // remove background after a short delay so page content shows through
    const t = setTimeout(() => (root.style.background = "transparent"), 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
