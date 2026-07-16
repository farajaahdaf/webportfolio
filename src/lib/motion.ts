import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, transform: "translateY(12px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.42, ease: [0.23, 1, 0.32, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.42, ease: [0.23, 1, 0.32, 1] },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, transform: "scale(0.95)" },
  show: {
    opacity: 1,
    transform: "scale(1)",
    transition: { duration: 0.42, ease: [0.23, 1, 0.32, 1] },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, transform: "translateX(-12px)" },
  show: {
    opacity: 1,
    transform: "translateX(0px)",
    transition: { duration: 0.42, ease: [0.23, 1, 0.32, 1] },
  },
};
