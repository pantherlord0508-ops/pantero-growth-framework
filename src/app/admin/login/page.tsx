"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, User, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call the API so the server sets the admin_token cookie
      // that middleware.ts checks
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Also store in localStorage so the header/admin page client-side
        // auth check works (key must be "admin_auth" and "admin_username")
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_username", username);
        router.push("/admin");
      } else {
        setError(data.error || "Invalid credentials");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(42 60% 54%), transparent 70%)" }}
      />
      {/* Grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(42 60% 54% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(42 60% 54% / 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-2xl border border-[#c9a54e]/20 bg-[#0a0e17]/90 p-8 shadow-[0_0_60px_-15px_hsl(42_60%_54%_/_0.3)] backdrop-blur-xl">
          {/* Icon */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c9a54e]/30 bg-[#c9a54e]/10">
              <ShieldCheck className="h-7 w-7 text-[#c9a54e]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Portal</h1>
            <p className="mt-1 text-sm text-gray-500">Pantero Growth Framework</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-gray-600 focus:border-[#c9a54e]/50 focus:ring-[#c9a54e]/20"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/10 bg-white/5 pl-9 pr-10 text-white placeholder:text-gray-600 focus:border-[#c9a54e]/50 focus:ring-[#c9a54e]/20"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="mt-2 w-full bg-[#c9a54e] font-semibold text-black hover:bg-[#d4b060] disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-700">
            Authorised personnel only
          </p>
        </div>

        {/* Gold line accent */}
        <div className="mt-4 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, hsl(42 60% 54% / 0.4), transparent)" }} />
      </motion.div>
    </div>
  );
}
