"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardAuthGuard({ children }) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      if (Date.now() < exp) {
        setVerified(true);
      } else {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    } catch (e) {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [router]);

  if (!verified) return null;

  return <>{children}</>;
}
