import Link from "next/link";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Status", href: "/status" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Milestones", href: "/milestones" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

const socialLinks = [
  { label: "X", href: "https://x.com/panteronexus" },
  { label: "TikTok", href: "https://tiktok.com/@panteroprelaunch" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div>
            <Link href="/" className="font-display text-lg font-bold text-foreground">
              Pantero
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              Offline Community • Marketplace • AI • Learning • Web3
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="hidden h-4 w-px bg-border sm:block" />
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Pantero. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
