"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0d1117] px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#161b22] rounded-xl shadow-sm border border-gray-200 dark:border-white/[0.06] p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6">
          Enter your credentials to access the dashboard.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-white/40">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
