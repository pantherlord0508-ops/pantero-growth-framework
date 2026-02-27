import { useRef } from "react";
import { useInView } from "framer-motion";

export function useScrollReveal(once = true) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });
  return { ref, isInView };
}
