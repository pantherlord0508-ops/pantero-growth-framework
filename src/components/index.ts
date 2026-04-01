/**
 * Barrel exports for all components.
 *
 * @module components
 */

// Landing page sections
export { HeroSection } from "./sections/HeroSection";
export { RecentSignupsTicker } from "./sections/RecentSignupsTicker";
export { SignupSection } from "./sections/SignupSection";
export { FeaturesGrid } from "./sections/FeaturesGrid";
export { CTASection } from "./sections/CTASection";

// Layout
export { default as Header } from "./layout/header";
export { default as Footer } from "./layout/footer";
export { default as WhatsAppButton } from "./layout/whatsapp-button";

// Dashboard
export { default as LiveStats } from "./dashboard/live-stats";

// Forms
export { default as SignupForm } from "./signup-form";

// Error handling
export { ErrorBoundary } from "./ErrorBoundary";
