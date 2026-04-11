import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Rocket } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import Image from "next/image";

const assetImages = [
  "/assets/x3.png",
  "/assets/x4.png",
  "/assets/x5.png",
  "/assets/x6.png",
];

const progressItems = [
  {
    id: "profile",
    title: "Digital Identity Dashboard",
    status: "In Development",
    progress: 72,
    gradient: "from-blue-500/20 to-purple-500/20",
    imageIndex: 0,
    description:
      "The Digital Identity Dashboard is the foundation of every user's presence on Pantero. It houses your decentralized identity (DID), displaying verified credentials, skill attestations, and work history in one secure, portable profile. Users can manage their key pairs, control what information is shared and with whom, and present a living portfolio that updates as they earn new credentials. Employers, mentors, and institutions can verify your identity and qualifications instantly — no middleman required. The dashboard acts as your digital passport across the entire Pantero ecosystem, from job applications to community governance participation.",
  },
  {
    id: "courses",
    title: "Skill Path Browser",
    status: "Design Phase",
    progress: 45,
    gradient: "from-green-500/20 to-teal-500/20",
    imageIndex: 1,
    description:
      "The Skill Path Browser reimagines how learners discover structured learning journeys on Pantero. Instead of static course lists, skill paths are presented as immersive, visually rich blocks organized by career field and difficulty level. Each path is curated to lead from foundational knowledge to verifiable competence, with assessments at every stage that generate blockchain-backed credentials. The browser supports filtering by language, region, skill demand, and community ratings. Whether you're pursuing technology, agriculture, trade, or business — the browser makes it effortless to find, commit to, and complete a path that leads to real opportunity.",
  },
  {
    id: "ai-nav",
    title: "AI Companion (Operator)",
    status: "In Progress",
    progress: 58,
    gradient: "from-orange-500/20 to-red-500/20",
    imageIndex: 2,
    description:
      "The AI Companion — codenamed Operator — is Pantero's intelligent offline-capable assistant designed to guide users in their native African language. Whether you speak Yoruba, Swahili, Hausa, or any of the languages we're expanding into, Operator understands your context and delivers personalized guidance. It helps you navigate skill paths, prepare for assessments, discover job opportunities, and manage your digital identity. Operator works even without an internet connection, ensuring that users in low-connectivity areas are never left behind. It's not just an assistant — it's a companion that grows with you, learning your goals and adapting its recommendations over time.",
  },
  {
    id: "calendar",
    title: "Opportunity & Event Planner",
    status: "Early Stage",
    progress: 30,
    gradient: "from-pink-500/20 to-violet-500/20",
    imageIndex: 3,
    description:
      "The Opportunity and Event Planner brings structure to your growth journey on Pantero. It integrates with the job marketplace to surface application deadlines, interview schedules, and skill assessment windows. Users can plan study sessions around their enrolled skill paths, set milestone targets, and receive smart reminders in their preferred language. The planner also highlights community events — governance votes, mentor sessions, and regional meetups — ensuring you never miss a chance to engage. Designed for users who understand that consistent action drives results, this tool turns intention into a time-blocked commitment that builds momentum and opens doors.",
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
              A look at the core systems taking shape — each one designed to give you ownership of your identity and future.
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
                          <div className="overflow-hidden rounded-lg border border-border bg-gradient-to-br flex items-center justify-center min-h-[200px] relative">
                            <Image 
                              src={assetImages[item.imageIndex]} 
                              alt={`${item.title} preview`}
                              fill
                              className="object-cover"
                              unoptimized
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
