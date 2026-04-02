"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Copy, Check, Link, Mail, User, Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UserData {
  email: string;
  name: string;
  referral_code: string;
  referral_link: string;
  position: number;
  referral_count: number;
}

export default function LookupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setUserData(null);
    setNotFound(false);

    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setUserData(data.user);
        localStorage.setItem("pantero_signed_up", "true");
        localStorage.setItem("pantero_referral_code", data.user.referral_code);
        localStorage.setItem("pantero_position", String(data.user.position));
      } else {
        setNotFound(true);
        toast.error(data.error || "Email not found");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!userData) return;
    try {
      await navigator.clipboard.writeText(userData.referral_link);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-16">
        <div className="container">
          <div className="mx-auto max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                <Search className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                <span className="text-gradient-gold">Retrieve Referral Link</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Enter your email to find your referral link
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find My Referral Link
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {userData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-6"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-green-400 font-medium">
                    ✓ Found your referral information
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" /> Name
                    </span>
                    <span className="font-medium text-foreground">{userData.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </span>
                    <span className="font-medium text-foreground">{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Position</span>
                    <span className="font-display text-xl font-bold text-primary">#{userData.position}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Referrals</span>
                    <span className="font-display text-xl font-bold text-foreground">{userData.referral_count}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Your Referral Link
                  </p>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-3">
                    <Link className="h-4 w-4 text-primary shrink-0" />
                    <span className="flex-1 truncate text-sm text-secondary-foreground">
                      {userData.referral_link}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyLink}
                      className="shrink-0 text-primary"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleCopyLink}
                  className="w-full mt-4"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Referral Link
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {notFound && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center"
              >
                <p className="text-red-400">
                  We couldn't find your email in our system.
                </p>
                <Button
                  variant="link"
                  className="mt-2 text-primary"
                  onClick={() => window.location.href = "/join"}
                >
                  Join the waitlist instead →
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}