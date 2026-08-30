import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useGame, playTap, speak } from "@/contexts/GameContext";
import { useState, useEffect, useCallback } from "react";
import Confetti from "@/components/Confetti";

/* ─── Floating decorations ─── */
const DECO = [
  { emoji: "☁️", cls: "top-[6%] left-[4%] text-5xl", d: 0 },
  { emoji: "⭐", cls: "top-[10%] right-[8%] text-3xl", d: 0.4 },
  { emoji: "🌸", cls: "top-[22%] left-[7%] text-4xl", d: 0.8 },
  { emoji: "☁️", cls: "top-[30%] right-[3%] text-6xl", d: 1.2 },
  { emoji: "✨", cls: "top-[15%] left-[42%] text-2xl", d: 0.6 },
  { emoji: "🌈", cls: "top-[3%] right-[28%] text-3xl", d: 1.6 },
  { emoji: "🦋", cls: "top-[42%] left-[10%] text-3xl", d: 1 },
  { emoji: "⭐", cls: "top-[52%] right-[12%] text-2xl", d: 0.3 },
  { emoji: "🌺", cls: "top-[68%] left-[5%] text-3xl", d: 1.5 },
  { emoji: "☁️", cls: "top-[62%] right-[6%] text-4xl", d: 0.7 },
  { emoji: "⭐", cls: "top-[80%] left-[20%] text-2xl", d: 2 },
  { emoji: "🌸", cls: "top-[75%] right-[22%] text-2xl", d: 1.8 },
];

function FloatingDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {DECO.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute select-none opacity-40 ${item.cls}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.4, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: item.d, duration: 0.6 },
            y: { delay: item.d, duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Raksha Bandhan Surprise ─── */
function RakshaBandhan() {
  const [open, setOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-5 px-6 rounded-3xl bg-gradient-to-r from-orange-200 via-pink-200 to-red-200 
                   border-[3px] border-orange-300/50 shadow-lg cursor-pointer
                   flex items-center justify-center gap-3 text-lg font-bold text-orange-700"
      >
        <span className="text-2xl">🎁</span>
        <span>Raksha Bandhan Surprise!</span>
        <span className="text-2xl">🎀</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 
                            rounded-3xl p-8 text-center border-2 border-orange-200/60 shadow-xl">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl mb-4"
              >
                🧿
              </motion.div>

              <div className="flex justify-center gap-2 text-3xl mb-4">
                {["🌺", "🌼", "🌷", "🌸", "🪷"].map((f, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {f}
                  </motion.span>
                ))}
              </div>

              <div className="flex justify-center gap-3 text-2xl mb-4">
                {["❤️", "🧡", "💛", "💚", "💙", "💜"].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
                    transition={{ delay: i * 0.15, duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {h}
                  </motion.span>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h3 className="text-xl font-extrabold text-orange-600 mb-3">
                  🎀 Happy Raksha Bandhan! 🎀
                </h3>
                <p className="text-base text-orange-700/80 leading-relaxed mb-3 font-medium">
                  To my two wonderful little sisters,
                </p>
                <p className="text-sm text-orange-600/70 leading-relaxed italic">
                  "This fun world is made just for you! 🌸
                  <br />
                  Every game, every star, every little surprise —
                  <br />
                  is a reminder of how much you are loved. 💕
                  <br />
                  <br />
                  Happy Raksha Bandhan, my dear sisters!
                  <br />
                  Made with love for my little sisters ❤️ 🎁✨"
                </p>
              </motion.div>

              <motion.div className="absolute top-3 right-4 text-2xl" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>✨</motion.div>
              <motion.div className="absolute bottom-3 left-4 text-2xl" animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>⭐</motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ─── Mode Card ─── */
function ModeCard({
  emoji,
  title,
  subtitle,
  description,
  gradient,
  border,
  delay,
  onClick,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  border: string;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.05, y: -6 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative w-full max-w-sm mx-auto p-7 sm:p-8 rounded-3xl bg-gradient-to-br ${gradient} 
                  border-[3px] ${border} cursor-pointer
                  flex flex-col items-center text-center gap-3 overflow-hidden
                  shadow-xl hover:shadow-2xl transition-shadow`}
    >
      <motion.div className="absolute top-3 right-4 text-lg opacity-50" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>✨</motion.div>
      <motion.div className="absolute bottom-3 left-4 text-lg opacity-50" animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>⭐</motion.div>

      <motion.span
        className="text-6xl sm:text-7xl"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {emoji}
      </motion.span>

      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-1">{title}</h2>
        <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">{subtitle}</p>
        <p className="text-xs sm:text-sm text-gray-600/80 leading-relaxed">{description}</p>
      </div>
    </motion.button>
  );
}

/* ─── Animal parade ─── */
const PARADE = ["🐶", "🐱", "🐮", "🐷", "🐰", "🦁", "🐘", "🐸", "🐧", "🦊", "🦋", "🐢"];

/* ─── Main Landing ─── */
export default function Landing() {
  const navigate = useNavigate();
  const { setMode, soundEnabled } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 800);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = useCallback(
    (m: "little" | "smart") => {
      if (soundEnabled) playTap();
      setMode(m);
      if (soundEnabled) {
        speak(
          m === "little"
            ? "Welcome Little Explorer! Let's play!"
            : "Welcome Smart Explorer! Let's have fun!",
        );
      }
      navigate("/map");
    },
    [setMode, navigate, soundEnabled],
  );

  return (
    <div className="min-h-screen bg-magical relative overflow-hidden">
      {showConfetti && <Confetti />}
      <FloatingDecor />

      <div className="relative z-10 flex flex-col items-center px-4 py-6 sm:py-8 min-h-screen">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 mt-2 sm:mt-4"
        >
          <motion.div
            className="text-5xl sm:text-6xl mb-3"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🌈
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent leading-tight mb-2">
            Little Sisters'
            <br />
            Fun World
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base text-purple-400/80 font-semibold"
          >
            A magical game world made just for you! ✨🎮
          </motion.p>
        </motion.div>

        {/* Mode Selection */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 w-full max-w-2xl mb-8 sm:mb-10">
          <ModeCard
            emoji="🌸"
            title="Little Explorer"
            subtitle="Toddler Mode • ~2 years"
            description="Huge buttons, tap games, animal sounds, and colors!"
            gradient="from-pink-100 via-rose-50 to-purple-100"
            border="border-pink-300/60"
            delay={0.4}
            onClick={() => handleSelect("little")}
          />
          <ModeCard
            emoji="⭐"
            title="Smart Explorer"
            subtitle="UKG / 1st Grade"
            description="Spelling, math, puzzles, memory games, and more!"
            gradient="from-amber-100 via-yellow-50 to-orange-100"
            border="border-amber-300/60"
            delay={0.6}
            onClick={() => handleSelect("smart")}
          />
        </div>

        {/* Animal parade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 text-2xl sm:text-3xl mb-6 sm:mb-8"
        >
          {PARADE.map((e, i) => (
            <motion.span
              key={i}
              className="emoji-tap cursor-pointer select-none"
              whileHover={{ scale: 1.3, rotate: 10 }}
              whileTap={{ scale: 0.8 }}
              animate={{ y: [0, -4, 0] }}
              transition={{ y: { delay: i * 0.08, duration: 2, repeat: Infinity, ease: "easeInOut" } }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>

        {/* Game preview badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8"
        >
          {[
            { emoji: "🐶", label: "Animals" },
            { emoji: "🧩", label: "Memory" },
            { emoji: "🔤", label: "ABC" },
            { emoji: "🔢", label: "Math" },
            { emoji: "🎨", label: "Drawing" },
            { emoji: "🍕", label: "Cooking" },
            { emoji: "🎯", label: "Shapes" },
          ].map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.08 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 
                         border border-purple-100 text-xs font-bold text-purple-500 shadow-sm"
            >
              <span>{g.emoji}</span>
              <span>{g.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex-1" />

        {/* Raksha Bandhan */}
        <RakshaBandhan />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-xs text-purple-300/60 mt-6 sm:mt-8 mb-4 text-center font-medium"
        >
          🌈 Made with love for little sisters 🌈
        </motion.p>
      </div>
    </div>
  );
}
