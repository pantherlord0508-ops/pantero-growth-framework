"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const publicNavLinks = [
  { label: "Home", href: "/" },
  { label: "Status", href: "/status" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Milestones", href: "/milestones" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Find Link", href: "/lookup" },
];

const adminNavLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin?tab=users" },
  { label: "Stats", href: "/admin?tab=stats" },
  { label: "Email", href: "/admin?tab=email" },
  { label: "Settings", href: "/admin?tab=settings" },
];

interface UserData {
  isAuthenticated: boolean;
  isAdmin: boolean;
  username?: string;
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    isAuthenticated: false,
    isAdmin: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("admin_auth");
      const username = localStorage.getItem("admin_username");
      
      setUserData({
        isAuthenticated: !!adminAuth,
        isAdmin: adminAuth === "true",
        username: username || undefined,
      });
    };

    checkAuth();
    
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_username");
    setUserData({ isAuthenticated: false, isAdmin: false });
    setUserMenuOpen(false);
    window.location.href = "/";
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const renderNavLink = (link: { label: string; href: string }, isAdmin = false) => {
    const active = isActive(link.href);
    return (
      <Link
        key={link.label + link.href}
        href={link.href}
        onClick={() => setMobileOpen(false)}
        className={`text-sm transition-colors ${
          active
            ? "text-primary font-medium"
            : isAdmin
            ? "text-purple-400 hover:text-purple-300"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {link.label}
      </Link>
    );
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-foreground">
            Pantero
          </Link>
          <button className="md:hidden">
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          Pantero
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 md:flex">
          {/* Public Links - Left */}
          <div className="flex items-center gap-4">
            {publicNavLinks.map((link) => renderNavLink(link))}
          </div>

          {/* Admin Links - Only visible to admins */}
          {userData.isAdmin && (
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <Shield className="h-4 w-4 text-purple-400" />
              {adminNavLinks.map((link) => renderNavLink(link, true))}
            </div>
          )}

          {/* Auth Section - Right */}
          <div className="flex items-center gap-3 border-l border-border pl-4">
            {userData.isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                    {userData.isAdmin ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">{userData.username}</span>
                  {userData.isAdmin && (
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-400">
                      Admin
                    </span>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card p-2 shadow-lg"
                    >
                      {userData.isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-purple-400 hover:bg-purple-500/10"
                        >
                          <Shield className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/community"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
                      >
                        <User className="h-4 w-4" />
                        My Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/lookup"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Find Link
                </Link>
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Join Waitlist
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="container flex flex-col gap-2 py-4">
              {/* Public Links */}
              <div className="mb-2">
                <p className="mb-2 px-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Navigation
                </p>
                {publicNavLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Admin Links - Only for admins */}
              {userData.isAdmin && (
                <div className="mb-2 border-t border-border pt-2">
                  <p className="mb-2 px-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-purple-400">
                    <Shield className="h-3 w-3" />
                    Admin Panel
                  </p>
                  {adminNavLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-md px-3 py-2 text-sm ${
                        isActive(link.href)
                          ? "bg-purple-500/10 text-purple-400 font-medium"
                          : "text-purple-400 hover:bg-purple-500/10"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Auth Section */}
              <div className="border-t border-border pt-2">
                {userData.isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="mb-2 flex items-center gap-2 px-3 py-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                        {userData.isAdmin ? (
                          <Shield className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{userData.username}</p>
                        {userData.isAdmin && (
                          <span className="text-xs text-purple-400">Administrator</span>
                        )}
                      </div>
                    </div>
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-purple-400 hover:bg-purple-500/10"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/community"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
                    >
                      <User className="h-4 w-4" />
                      My Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/lookup"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
                    >
                      Find Link
                    </Link>
                    <Link
                      href="/join"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Join Waitlist
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}