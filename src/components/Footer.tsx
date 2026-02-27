const WAITLIST_URL = "https://waitlister.me/p/pantero-app";

const footerLinks = [
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy", href: "#" },
];

const socials = [
  { label: "X", href: "https://x.com/panteronexus" },
  { label: "TikTok", href: "https://tiktok.com/@panteroprelaunch" },
];

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <span className="font-display text-lg font-bold text-foreground">Pantero</span>

        <div className="flex items-center gap-6">
          {footerLinks.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
          <div className="h-4 w-px bg-border" />
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Pantero. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
