/**
 * TestimonialsSection — dual-row infinite scrolling community quotes.
 */
"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Amara Osei",
    role: "Software Engineering Student, Ghana",
    avatar: "AO",
    color: "#c9a54e",
    text: "Pantero is exactly what I've been waiting for. An AI mentor that speaks my context and understands the African tech landscape.",
    stars: 5,
  },
  {
    name: "Fatima Al-Hassan",
    role: "UI/UX Designer, Nigeria",
    avatar: "FA",
    color: "#635BFF",
    text: "The community alone is worth it. I found collaborators for my startup within 48 hours of joining the waitlist.",
    stars: 5,
  },
  {
    name: "Kofi Mensah",
    role: "Cloud Engineer, Kenya",
    avatar: "KM",
    color: "#00A4EF",
    text: "I've used Coursera, edX, everything — Pantero's approach to Web3 credentials and verifiable skills is genuinely next level.",
    stars: 5,
  },
  {
    name: "Ngozi Eze",
    role: "Cybersecurity Analyst, Nigeria",
    avatar: "NE",
    color: "#FF6B6B",
    text: "Finally a platform that doesn't make me feel like an afterthought. The offline AI feature will be a game changer for rural areas.",
    stars: 5,
  },
  {
    name: "David Mwangi",
    role: "Mobile Dev, Uganda",
    avatar: "DM",
    color: "#4ECB71",
    text: "The referral system is genius. I moved from position #847 to #103 in just one week by sharing my link.",
    stars: 5,
  },
  {
    name: "Chioma Adeyemi",
    role: "Data Scientist, Lagos",
    avatar: "CA",
    color: "#FF9900",
    text: "What Stripe did for payments, Pantero is doing for African tech talent. I'm so early and so excited.",
    stars: 5,
  },
  {
    name: "Yaw Darko",
    role: "Backend Engineer, Accra",
    avatar: "YD",
    color: "#c9a54e",
    text: "The marketplace idea is brilliant — affordable tech gear AND learning resources in one place? My whole team signed up immediately.",
    stars: 5,
  },
  {
    name: "Blessing Olusegun",
    role: "Product Manager, Abuja",
    avatar: "BO",
    color: "#E91E8C",
    text: "I've been following Pantero since the beginning. The team's vision for digital identity and Web3 credentials is unmatched.",
    stars: 5,
  },
];

const row1 = testimonials.slice(0, 4);
const row2 = testimonials.slice(4, 8);

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="mx-3 w-72 flex-shrink-0 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-[#c9a54e]/30 hover:shadow-[0_0_20px_-8px_hsl(42_60%_54%_/_0.3)]">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: `${t.color}30`, border: `1px solid ${t.color}50`, color: t.color }}
          >
            {t.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
          </div>
        </div>
        <Quote className="h-4 w-4 flex-shrink-0 text-primary/30 mt-1" />
      </div>

      <div className="mb-3 flex gap-0.5">
        {[...Array(t.stars)].map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-[#c9a54e] text-[#c9a54e]" />
        ))}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
    </div>
  );
}

function MarqueeRow({
  items,
  direction = "left",
  speed = 35,
}: {
  items: (typeof testimonials);
  direction?: "left" | "right";
  speed?: number;
}) {
  const doubled = [...items, ...items];
  const translateStart = direction === "left" ? "0%" : "-50%";
  const translateEnd = direction === "left" ? "-50%" : "0%";

  return (
    <div className="relative overflow-hidden py-3">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex w-max"
        animate={{ x: [translateStart, translateEnd] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="overflow-hidden border-t border-border py-24 md:py-32">
      <div className="container mb-14">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Community Love
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Thousands Already{" "}
            <span className="text-gradient-gold">Can&apos;t Wait</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real voices from the Pantero waitlist community across Africa.
          </p>
        </motion.div>
      </div>

      {/* Both marquee rows — full width, outside container */}
      <div className="space-y-4">
        <MarqueeRow items={row1} direction="left" speed={40} />
        <MarqueeRow items={row2} direction="right" speed={32} />
      </div>
    </section>
  );
}
