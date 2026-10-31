"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Home } from "lucide-react";
import { bricolage, quicksand } from "@/app/libs/utils/font";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
};

const digit = (x) => ({
  hidden: { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 110, damping: 14 } },
});

const coinPop = {
  hidden: { opacity: 0, scale: 0.3, rotate: -40 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 140, damping: 12 } },
};

const digitClass = "text-[96px] md:text-[120px] leading-none font-extrabold text-[#03457c]";

export default function NotFoundScreen({ fullScreen = false }) {
  const router = useRouter();
  const reduce = useReducedMotion();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/dashboard"); // opened in a new tab, so there's nothing to go back to
  }

  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className={`flex flex-col items-center justify-center text-center px-6 ${
        fullScreen ? "min-h-screen" : "min-h-[70vh]"
      }`}
    >
      {/* 4 [coin] 4 */}
      <div role="img" aria-label="Error 404" className="flex items-center gap-2 md:gap-4 select-none">
        <motion.span variants={digit(-40)} style={bricolage.style} className={digitClass}>
          4
        </motion.span>

        <motion.div variants={coinPop} className="relative">
          <motion.div
            animate={reduce ? undefined : { y: [0, -14, 0], rotateY: [0, 360] }}
            transition={
              reduce
                ? undefined
                : {
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 },
                  }
            }
            style={{ ...bricolage.style, transformPerspective: 700 }}
            className="w-[84px] h-[84px] md:w-[104px] md:h-[104px] rounded-full bg-[#03457c] text-white flex items-center justify-center text-4xl md:text-5xl font-extrabold ring-4 ring-[#E6F0FA] shadow-lg"
          >
            ₦
          </motion.div>

          {/* shadow that shrinks as the coin floats up */}
          <motion.div
            animate={reduce ? undefined : { scaleX: [1, 0.75, 1], opacity: [0.22, 0.1, 0.22] }}
            transition={reduce ? undefined : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-14 h-2 rounded-full bg-slate-900 opacity-20"
          />
        </motion.div>

        <motion.span variants={digit(40)} style={bricolage.style} className={digitClass}>
          4
        </motion.span>
      </div>

      <motion.h1 variants={rise} style={bricolage.style} className="mt-10 text-xl md:text-2xl font-bold">
        We couldn’t find that page
      </motion.h1>

      <motion.p
        variants={rise}
        style={quicksand.style}
        className="mt-2 max-w-sm text-[13px] md:text-sm opacity-60 leading-relaxed"
      >
        The link may be broken, or the page may have moved. Check the address, or head back to your dashboard.
      </motion.p>

      <motion.div variants={rise} className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href="/dashboard"
          style={bricolage.style}
          className="btn border-none shadow-sm bg-[#03457C] text-white hover:bg-[#02335c] rounded-full text-[13px] flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          Go to dashboard
        </Link>

        <button
          type="button"
          onClick={goBack}
          style={bricolage.style}
          className="btn bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full text-[13px] flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </motion.div>
    </motion.main>
  );
}