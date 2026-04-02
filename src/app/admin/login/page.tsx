"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_USER = "TESORO-DEV";
const ADMIN_PASS = "THINGSIDOFORTREASURE";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple client-side validation
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Store auth in localStorage
      localStorage.setItem("admin_auth", "true");
      localStorage.setItem("admin_user", username);
      router.push("/admin");
    } else {
      setError("Invalid credentials");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm rounded-xl border border-[#c9a54e]/30 bg-[#0a0e17] p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#c9a54e]/15">
            <Lock className="h-6 w-6 text-[#c9a54e]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-gray-700 bg-black pl-9 text-white placeholder:text-gray-500"
            />
          </div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-gray-700 bg-black text-white placeholder:text-gray-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            type="submit" 
            className="w-full bg-[#c9a54e] text-black hover:bg-[#b8944a]"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
