"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi, MessageSquare, Users, ShoppingBag, BookOpen, Shield,
  Sparkles, Zap, ArrowRight
} from "lucide-react";

const GOLD = "#C6A85C";

type Phase = "intro" | "features" | "brand" | "transition" | "exit";

const PHASE_DURATIONS: Record<Phase, number> = {
  intro: 2000,
  features: 3500,
  brand: 2500,
  transition: 1500,
  exit: 800,
};

const PLATFORM_FEATURES = [
  {
    icon: Wifi,
    name: "Offline First",
    tagline: "Works without internet",
    description: "Access all features even in low connectivity areas. Built for Africa's unique challenges.",
  },
  {
    icon: Users,
    name: "Community Workspace",
    tagline: "Connect & collaborate",
    description: "Join a thriving community of learners and builders. Share knowledge, work on projects together.",
  },
  {
    icon: ShoppingBag,
    name: "Marketplace",
    tagline: "Trade & earn",
    description: "Buy, sell, and trade tech resources. From devices to digital products, all in one place.",
  },
  {
    icon: MessageSquare,
    name: "AI Companion",
    tagline: "Your smart assistant",
    description: "Get personalized help in your language. AI-powered guidance for learning and building.",
  },
  {
    icon: BookOpen,
    name: "Learning Hub",
    tagline: "Learn at your pace",
    description: "Free courses in coding, design, data science and more. Structured paths to mastery.",
  },
  {
    icon: Shield,
    name: "Web3 Credentials",
    tagline: "Own your achievements",
    description: "Blockchain-verified certificates that travel with you. True digital ownership.",
  },
];

interface Props {
  onComplete: () => void;
}

const PanteroIntroLoader = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [featureIndex, setFeatureIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Phase sequencing
  useEffect(() => {
    const advancePhase = () => {
      if (phase === "intro") {
        setPhase("features");
        return;
      }
      if (phase === "features") {
        if (featureIndex < PLATFORM_FEATURES.length - 1) {
          setFeatureIndex((prev) => prev + 1);
        } else {
          setPhase("brand");
        }
        return;
      }
      if (phase === "brand") {
        setPhase("transition");
        return;
      }
      if (phase === "transition") {
        setPhase("exit");
        return;
      }
      if (phase === "exit") {
        onComplete();
      }
    };

    const duration = phase === "features" 
      ? PHASE_DURATIONS.features 
      : PHASE_DURATIONS[phase];
    
    const timer = setTimeout(advancePhase, duration);
    return () => clearTimeout(timer);
  }, [phase, featureIndex, onComplete]);

  // Skip handler
  const handleSkip = useCallback(() => {
    setPhase("exit");
    setTimeout(onComplete, 500);
  }, [onComplete]);

  if (!isMounted) {
    return null;
  }

  const currentFeature = PLATFORM_FEATURES[featureIndex];
  const progress = ((featureIndex + 1) / PLATFORM_FEATURES.length) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0d0d12 50%, #0a0a0f 100%)" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Skip Button */}
      <motion.button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 px-5 py-2 text-sm rounded-full border transition-all"
        style={{ 
          color: GOLD, 
          borderColor: `${GOLD}40`, 
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)"
        }}
        whileHover={{ scale: 1.05, borderColor: GOLD }}
        whileTap={{ scale: 0.95 }}
      >
        Skip →
      </motion.button>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <Sparkles 
                  className="w-16 h-16 mx-auto" 
                  style={{ color: GOLD, filter: `drop-shadow(0 0 20px ${GOLD})` }} 
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="font-display text-5xl md:text-7xl font-bold"
                style={{ 
                  color: GOLD,
                  textShadow: `0 0 40px ${GOLD}60, 0 0 80px ${GOLD}30`
                }}
              >
                PANTERO
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-lg text-gray-400"
              >
                Africa&apos;s Offline Community & Marketplace
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Loading experience...
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Features Phase */}
          {phase === "features" && (
            <motion.div
              key={`feature-${featureIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl w-full"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: GOLD }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  {featureIndex + 1} of {PLATFORM_FEATURES.length}
                </p>
              </div>

              {/* Feature Card */}
              <div className="rounded-2xl border p-8 md:p-12"
                style={{ 
                  background: "rgba(20,20,25,0.8)",
                  borderColor: `${GOLD}30`,
                  backdropFilter: "blur(20px)"
                }}
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ 
                    background: `${GOLD}15`,
                    border: `1px solid ${GOLD}30`
                  }}
                >
                  <currentFeature.icon 
                    className="w-8 h-8" 
                    style={{ color: GOLD }} 
                  />
                </motion.div>

                {/* Name & Tagline */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: GOLD }}
                >
                  {currentFeature.name}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm font-medium mb-4"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {currentFeature.tagline}
                </motion.p>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-400 leading-relaxed"
                >
                  {currentFeature.description}
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Brand Phase */}
          {phase === "brand" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-display text-6xl md:text-8xl font-bold"
                style={{ 
                  color: GOLD,
                  textShadow: `0 0 60px ${GOLD}80, 0 0 120px ${GOLD}40`
                }}
              >
                PANTERO
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-xl text-gray-300"
              >
                Africa&apos;s Future Tech Platform
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-8 flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5" style={{ color: GOLD }} />
                <span className="text-sm text-gray-400">Launching November 2026</span>
              </motion.div>
            </motion.div>
          )}

          {/* Transition Phase */}
          {phase === "transition" && (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <ArrowRight className="w-6 h-6" style={{ color: GOLD }} />
                <span className="text-lg text-gray-300">Entering Platform...</span>
              </div>
              <p className="text-sm text-gray-500">Thank you for waiting</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-gray-600">
          © 2026 Pantero • Built for African Youth
        </p>
      </div>
    </motion.div>
  );
};

export default PanteroIntroLoader;