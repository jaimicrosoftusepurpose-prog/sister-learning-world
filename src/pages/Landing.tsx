import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";

/* ──────────────────────────────────────────────────────────────────────────────
   Floating decorative elements (clouds, stars, flowers)
   ────────────────────────────────────────────────────────────────────────────── */

const FLOATING_ITEMS = [
  { emoji: "☁️", className: "top-[8%] left-[5%] text-5xl", delay: 0 },
  { emoji: "⭐", className: "top-[12%] right-[10%] text-3xl", delay: 0.5 },
  { emoji: "🌸", className: "top-[25%] left-[8%] text-4xl", delay: 1 },
  { emoji: "☁️", className: "top-[35%] right-[5%] text-6xl", delay: 1.5 },
  { emoji: "✨", className: "top-[18%] left-[45%] text-2xl", delay: 0.8 },
  { emoji: "🌈", className: "top-[5%] right-[30%] text-4xl", delay: 2 },
  { emoji: "🦋", className: "top-[45%] left-[12%] text-3xl", delay: 1.2 },
  { emoji: "⭐", className: "top-[55%] right-[15%] text-2xl", delay: 0.3 },
  { emoji: "🌸", className: "top-[70%] left-[6%] text-3xl", delay: 1.8 },
  { emoji: "☁️", className: "top-[65%] right-[8%] text-4xl", delay: 0.7 },
];

function FloatingDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {FLOATING_ITEMS.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute select-none opacity-40 ${item.className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 0.4,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { delay: item.delay, duration: 0.6 },
            y: {
              delay: item.delay,
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Raksha Bandhan Surprise Section
   ────────────────────────────────────────────────────────────────────────────── */

function RakshaBandhanSurprise() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-5 px-6 rounded-3xl bg-gradient-to-r from-orange-200 via-pink-200 to-red-200 
                   border-3 border-orange-300/50 shadow-lg cursor-pointer
                   flex items-center justify-center gap-3 text-lg font-bold text-orange-700"
      >
        <span className="text-2xl">🎁</span>
        <span>Raksha Bandhan Surprise!</span>
        <span className="text-2xl">🎀</span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: 16 }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 
                          rounded-3xl p-8 text-center border-2 border-orange-200/60 shadow-xl">
            {/* Animated Rakhi */}
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-7xl mb-4"
            >
              🧿
            </motion.div>

            {/* Flowers */}
            <div className="flex justify-center gap-2 text-3xl mb-4">
              {["🌺", "🌼", "🌷", "🌸", "🪷"].map((flower, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
                >
                  {flower}
                </motion.span>
              ))}
            </div>

            {/* Hearts */}
            <div className="flex justify-center gap-3 text-2xl mb-4">
              {["❤️", "🧡", "💛", "💚", "💙", "💜"].map((heart, i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [0, -6, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    delay: i * 0.15,
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {heart}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-extrabold text-orange-600 mb-3">
                🎀 Happy Raksha Bandhan! 🎀
              </h3>
              <p className="text-base text-orange-700/80 leading-relaxed mb-3 font-medium">
                To my two wonderful little sisters,
              </p>
              <p className="text-sm text-orange-600/70 leading-relaxed italic">
                "This special world is made just for you! 🌸
                <br />
                Every game, every star, every little surprise —
                <br />
                is a reminder of how much you are loved. 💕
                <br />
                <br />
                Happy Raksha Bandhan, my dear sisters!
                <br />
                Your big brother 🎁✨"
              </p>
            </motion.div>

            {/* Animated decorative elements */}
            <motion.div
              className="absolute top-3 right-4 text-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute bottom-3 left-4 text-2xl"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              ⭐
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Mode Selection Card
   ────────────────────────────────────────────────────────────────────────────── */

function ModeCard({
  emoji,
  title,
  subtitle,
  description,
  gradient,
  borderColor,
  shadowColor,
  delay,
  onClick,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  borderColor: string;
  shadowColor: string;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 120 }}
      whileHover={{
        scale: 1.05,
        y: -6,
        boxShadow: `0 20px 40px ${shadowColor}`,
      }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative w-full max-w-sm mx-auto p-8 rounded-3xl bg-gradient-to-br ${gradient} 
                  border-[3px] ${borderColor} cursor-pointer
                  flex flex-col items-center text-center gap-4 overflow-hidden
                  shadow-xl transition-shadow duration-300`}
    >
      {/* Sparkle decoration */}
      <motion.div
        className="absolute top-3 right-4 text-lg opacity-60"
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute bottom-3 left-4 text-lg opacity-60"
        animate={{ rotate: -360, scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        ⭐
      </motion.div>

      <motion.span
        className="text-7xl"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {emoji}
      </motion.span>

      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-1">{title}</h2>
        <p className="text-sm font-semibold text-gray-500 mb-3">{subtitle}</p>
        <p className="text-sm text-gray-600/80 leading-relaxed">{description}</p>
      </div>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Landing Page
   ────────────────────────────────────────────────────────────────────────────── */

export default function Landing() {
  const navigate = useNavigate();

  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; color: string; delay: number }>
  >([]);

  const spawnConfetti = useCallback(() => {
    const colors = [
      "#FF6B9D",
      "#B088F9",
      "#FFD93D",
      "#6BCB77",
      "#4ECDC4",
      "#FF8A65",
      "#F48FB1",
      "#81D4FA",
    ];
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3000);
  }, []);

  // Spawn confetti on first load
  useEffect(() => {
    const timer = setTimeout(spawnConfetti, 800);
    return () => clearTimeout(timer);
  }, [spawnConfetti]);

  return (
    <div className="min-h-screen bg-magical relative overflow-hidden">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}

      <FloatingDecor />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 mt-4"
        >
          <motion.div
            className="text-6xl mb-3"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🌸
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent leading-tight mb-2">
            Little Sisters'
            <br />
            Learning World
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base text-purple-400/80 font-semibold"
          >
            A magical world made just for you! ✨
          </motion.p>
        </motion.div>

        {/* Mode Selection */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mb-10">
          <ModeCard
            emoji="🌸"
            title="Little Explorer"
            subtitle="Toddler Mode • 2 years"
            description="Tap cute animals, learn colors, and discover the world!"
            gradient="from-pink-100 via-rose-50 to-purple-100"
            borderColor="border-pink-300/60"
            shadowColor="oklch(0.72 0.18 340 / 0.15)"
            delay={0.4}
            onClick={() => navigate("/game/toddler")}
          />
          <ModeCard
            emoji="⭐"
            title="Smart Explorer"
            subtitle="UKG / 1st Grade"
            description="Play animal games, solve puzzles, and earn stars!"
            gradient="from-amber-100 via-yellow-50 to-orange-100"
            borderColor="border-amber-300/60"
            shadowColor="oklch(0.88 0.14 85 / 0.15)"
            delay={0.6}
            onClick={() => navigate("/game/animals")}
          />
        </div>

        {/* Fun facts bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-4 text-2xl mb-8"
        >
          {["🐶", "🐱", "🐮", "🐰", "🦁", "🐘", "🐸", "🐧"].map(
            (emoji, i) => (
              <motion.span
                key={i}
                className="emoji-tap cursor-pointer select-none"
                whileHover={{ scale: 1.3, rotate: 10 }}
                whileTap={{ scale: 0.8 }}
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  y: {
                    delay: i * 0.1,
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                {emoji}
              </motion.span>
            ),
          )}
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Raksha Bandhan Surprise */}
        <RakshaBandhanSurprise />

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-xs text-purple-300/60 mt-8 mb-4 text-center font-medium"
        >
          🌈 Made with love for little sisters 🌈
        </motion.p>
      </div>
    </div>
  );
}
