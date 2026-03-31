import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import AnimatedSection from "./AnimatedSection";

const RecommendationSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", recommendation: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.recommendation) return;
    setSubmitted(true);
    toast.success("Got it! We've sent a confirmation to " + form.email + ". Thanks for sharing 🙌");
  };

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="container">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">Your Voice Matters</p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Help Us Build{" "}
              <span className="text-gradient-gold">What You Need.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tell us what matters most to you — languages, features, industries, skills. We're listening.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="mx-auto mt-12 max-w-lg rounded-xl border border-border bg-card p-8">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
                  <CheckCircle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">We Hear You 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  Your idea is in our hands now. We've sent a confirmation to{" "}
                  <span className="font-medium text-foreground">{form.email}</span> — thanks for helping us build something that matters.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Name <span className="normal-case text-muted-foreground/60">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    What should we build? <span className="text-primary">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.recommendation}
                    onChange={(e) => setForm({ ...form, recommendation: e.target.value })}
                    placeholder="What languages, features, or opportunities matter most to you?"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                  Submit Recommendation
                </button>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default RecommendationSection;
