"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    fetch("/api/admin/login", { 
      method: "GET",
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      if (data.authenticated) {
        router.push("/admin");
      }
    })
    .catch(() => {})
    .finally(() => setLoading(false));
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Direct redirect without waiting - bypass loading state
        window.location.href = "/admin";
      } else {
        toast.error(data.error || "Invalid credentials");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-[#c9a54e]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm rounded-xl border border-[#c9a54e]/30 bg-[#0a0e17] p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#c9a54e]/15">
            <Lock className="h-6 w-6 text-[#c9a54e]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-400">Enter your credentials</p>
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
              autoComplete="username"
            />
          </div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-gray-700 bg-black text-white placeholder:text-gray-500"
            autoComplete="current-password"
          />
          <Button 
            type="submit" 
            className="w-full bg-[#c9a54e] text-black hover:bg-[#b8944a]"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
