import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

import profileImg from "@/assets/x3.png";
import coursesImg from "@/assets/x4.png";
import aiNavImg from "@/assets/x5.png";
import calendarImg from "@/assets/x6.png";

const progressItems = [
  {
    id: "profile",
    title: "Profile System",
    status: "In Development",
    progress: 72,
    image: profileImg,
    description:
      "The Profile System is the backbone of every user's journey on Pantero. It provides a fully personalized dashboard where learners can showcase their skills, track their growth over time, and present a curated portfolio of completed projects. Users will have a social-style profile complete with avatars, follower metrics, post counts, and a visible track record of their learning achievements. The profile acts as a living resume — dynamically updated as you complete courses, earn credentials, and contribute to community projects. Employers and mentors can browse profiles to discover talent, making it a critical bridge between skill development and real-world opportunity.",
  },
  {
    id: "courses",
    title: "Interactive Course Browser",
    status: "Design Phase",
    progress: 45,
    image: coursesImg,
    description:
      "The Interactive Course Browser reimagines how learners discover and engage with educational content on Pantero. Instead of static lists, courses are presented as immersive, visually rich 3D blocks that respond to user interaction — hover to preview, tap to explore, and scroll to discover more. Each course is categorized by skill path and difficulty level, making it effortless to find exactly what you need. The browser supports filtering by topic, duration, instructor rating, and community engagement. This design philosophy ensures learning feels exciting and gamified, not like scrolling through a spreadsheet. It transforms course discovery into an experience that motivates exploration and commitment.",
  },
  {
    id: "ai-nav",
    title: "AI Navigator (Operator)",
    status: "In Progress",
    progress: 58,
    image: aiNavImg,
    description:
      "The AI Navigator, codenamed Operator, is Pantero's intelligent assistant designed to guide users through the entire platform experience. It provides real-time, context-aware support — answering questions about course material, suggesting learning paths based on your goals, and helping troubleshoot project challenges. Operator is always online, always available, and learns from your interactions to deliver increasingly personalized recommendations. Whether you need help navigating the platform, understanding a concept, or choosing your next skill to master, Operator is your constant companion. It bridges the gap between self-directed learning and mentor-guided education, ensuring no learner ever feels lost or unsupported on their journey.",
  },
  {
    id: "calendar",
    title: "Calendar & Event Planner",
    status: "Early Stage",
    progress: 30,
    image: calendarImg,
    description:
      "The Calendar and Event Planner module brings structure and discipline to the Pantero learning experience. It allows users to schedule study sessions, set milestone deadlines, and receive smart reminders about upcoming events and system maintenance windows. The planner integrates directly with your enrolled courses, automatically suggesting optimal study blocks based on your learning pace and availability. Users can add custom events, sync with external calendars, and track their consistency over time. This tool is designed for learners who understand that skill development requires routine and accountability — transforming good intentions into concrete, time-blocked commitments that drive measurable progress and real results.",
  },
];

const ProgressShowcase = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="container">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              What We're Building
            </h2>
            <p className="mt-4 text-muted-foreground">
              A sneak peek into the features taking shape — each one designed to transform how you learn and grow.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-16 space-y-4">
          {progressItems.map((item, i) => (
            <AnimatedSection key={item.id} delay={0.1 + i * 0.1}>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {/* Header / Toggle */}
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-accent/30"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                      {item.status}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openId === item.id ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>

                {/* Progress bar */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                    />
                  </div>
                </div>

                {/* Expandable content */}
                <AnimatePresence>
                  {openId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 px-6 pb-6 md:grid-cols-2">
                        <div className="overflow-hidden rounded-lg border border-border">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-auto w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground self-center">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgressShowcase;
