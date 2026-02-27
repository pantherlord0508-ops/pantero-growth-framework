import { ArrowRight } from "lucide-react";

const WAITLIST_URL = "https://waitlister.me/p/pantero-app";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
    <div className="container flex h-16 items-center justify-between">
      <span className="font-display text-xl font-bold tracking-tight text-foreground">
        Pantero
      </span>
      <a
        href={WAITLIST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Join Waitlist
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  </nav>
);

export default Navbar;
