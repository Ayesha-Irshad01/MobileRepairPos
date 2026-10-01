"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        if (Date.now() < exp) {
          router.replace("/dashboard");
        } else {
          localStorage.removeItem("token");
          router.replace("/login");
        }
      } catch (e) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
