import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useGame, playTap, playStar } from "@/contexts/GameContext";
import { useCallback } from "react";

interface GameWorld {
  id: string;
  name: string;
  emoji: string;
  route: string;
  color: string;
  borderColor: string;
  starsNeeded: number; // 0 = unlocked by default
  description: string;
}

const WORLDS: GameWorld[] = [
  { id: "animals", name: "Animal Meadow", emoji: "🐶", route: "/game/animals", color: "from-green-100 to-emerald-50", borderColor: "border-green-300/60", starsNeeded: 0, description: "Meet cute animals!" },
  { id: "memory", name: "Puzzle Village", emoji: "🧩", route: "/game/memory", color: "from-blue-100 to-sky-50", borderColor: "border-blue-300/60", starsNeeded: 0, description: "Match & remember!" },
  { id: "abc", name: "ABC Garden", emoji: "🔤", route: "/game/abc", color: "from-pink-100 to-rose-50", borderColor: "border-pink-300/60", starsNeeded: 0, description: "Letters & words!" },
  { id: "math", name: "Number Mountain", emoji: "🔢", route: "/game/math", color: "from-orange-100 to-amber-50", borderColor: "border-orange-300/60", starsNeeded: 0, description: "Count & calculate!" },
  { id: "shapes", name: "Shape Galaxy", emoji: "🎯", route: "/game/shapes", color: "from-purple-100 to-violet-50", borderColor: "border-purple-300/60", starsNeeded: 3, description: "Colors & shapes!" },
  { id: "drawing", name: "Art Studio", emoji: "🎨", route: "/game/drawing", color: "from-rose-100 to-pink-50", borderColor: "border-rose-300/60", starsNeeded: 5, description: "Draw & color!" },
  { id: "cooking", name: "Kitchen Corner", emoji: "🍕", route: "/game/cooking", color: "from-yellow-100 to-orange-50", borderColor: "border-yellow-300/60", starsNeeded: 8, description: "Cook yummy food!" },
  { id: "car", name: "Race Track", emoji: "🏎️", route: "/game/car", color: "from-slate-100 to-gray-50", borderColor: "border-slate-300/60", starsNeeded: 12, description: "Coming soon!" },
  { id: "bike", name: "Adventure Trail", emoji: "🏍️", route: "/game/bike", color: "from-teal-100 to-cyan-50", borderColor: "border-teal-300/60", starsNeeded: 16, description: "Coming soon!" },
  { id: "makeover", name: "Beauty Salon", emoji: "💄", route: "/game/makeover", color: "from-fuchsia-100 to-pink-50", borderColor: "border-fuchsia-300/60", starsNeeded: 20, description: "Coming soon!" },
];

function WorldCard({
  world,
  index,
  isLocked,
  earnedStars,
  onPlay,
}: {
  world: GameWorld;
  index: number;
  isLocked: boolean;
  earnedStars: number;
  onPlay: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 120 }}
      className="w-full"
    >
      <motion.button
        whileHover={!isLocked ? { scale: 1.03, y: -3 } : {}}
        whileTap={!isLocked ? { scale: 0.97 } : {}}
        onClick={isLocked ? undefined : onPlay}
        disabled={isLocked}
        className={`w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${world.color} 
                    border-[3px] ${isLocked ? "border-gray-200/60 opacity-50" : world.borderColor}
                    ${isLocked ? "cursor-not-allowed" : "cursor-pointer shadow-lg hover:shadow-xl"}
                    transition-all flex items-center gap-4 text-left relative overflow-hidden`}
      >
        {/* Emoji */}
        <div className={`text-4xl sm:text-5xl shrink-0 ${isLocked ? "grayscale" : ""}`}>
          {isLocked ? "🔒" : world.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-800 truncate">
            {world.name}
          </h3>
          <p className="text-xs text-gray-500 font-medium">{world.description}</p>

          {/* Stars */}
          <div className="flex items-center gap-1 mt-1.5">
            {isLocked ? (
              <span className="text-xs text-gray-400 font-semibold">
                🔒 Unlock at {world.starsNeeded} ⭐
              </span>
            ) : (
              <div className="flex gap-0.5">
                {[1, 2, 3].map((s) => (
                  <span key={s} className="text-sm">
                    {earnedStars >= s * 3 ? "⭐" : "☆"}
                  </span>
                ))}
                {earnedStars > 0 && (
                  <span className="text-xs text-amber-500 font-bold ml-1">
                    {earnedStars}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        {!isLocked && (
          <motion.span
            className="text-xl text-gray-400 shrink-0"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        )}

        {/* Decorative sparkle */}
        {!isLocked && (
          <motion.div
            className="absolute top-2 right-3 text-sm opacity-40"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            ✨
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
}

export default function AdventureMap() {
  const navigate = useNavigate();
  const { mode, getStars, getTotalStars, soundEnabled } = useGame();
  const totalStars = getTotalStars();

  const handlePlay = useCallback(
    (route: string) => {
      if (soundEnabled) playTap();
      navigate(route);
    },
    [navigate, soundEnabled],
  );

  return (
    <div className="min-h-screen bg-magical relative overflow-hidden">
      {/* Floating clouds */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {[
          { emoji: "☁️", cls: "top-[4%] left-[3%] text-5xl opacity-30" },
          { emoji: "☁️", cls: "top-[12%] right-[5%] text-6xl opacity-25" },
          { emoji: "⭐", cls: "top-[8%] left-[50%] text-2xl opacity-30" },
          { emoji: "🌸", cls: "top-[40%] left-[2%] text-3xl opacity-20" },
          { emoji: "☁️", cls: "top-[55%] right-[3%] text-4xl opacity-25" },
        ].map((d, i) => (
          <motion.div
            key={i}
            className={`absolute select-none ${d.cls}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {d.emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-4 sm:py-6 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/70 
                       border border-purple-200 text-purple-600 font-bold text-sm
                       shadow-sm backdrop-blur-sm"
          >
            <span>←</span>
            <span className="hidden sm:inline">Home</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 
                           border border-amber-200 shadow-sm backdrop-blur-sm">
              <span className="text-sm">⭐</span>
              <span className="text-sm font-bold text-amber-600">{totalStars}</span>
            </div>
            {mode && (
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm border ${
                  mode === "little"
                    ? "bg-pink-100/80 border-pink-200 text-pink-600"
                    : "bg-amber-100/80 border-amber-200 text-amber-600"
                }`}
              >
                {mode === "little" ? "🌸 Little Explorer" : "⭐ Smart Explorer"}
              </div>
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            🗺️ Adventure Map
          </h1>
          <p className="text-sm text-purple-400/80 font-medium mt-1">
            {totalStars === 0
              ? "Start playing to earn stars! ⭐"
              : `You've earned ${totalStars} stars! Keep going! 🌟`}
          </p>
        </motion.div>

        {/* Star progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-white/50 rounded-full h-3 overflow-hidden border border-purple-100">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 via-amber-400 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalStars / 25) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-purple-300 font-semibold mt-1 px-1">
            <span>0</span>
            <span>🏔️ Max: 25+</span>
          </div>
        </motion.div>

        {/* Game Worlds */}
        <div className="flex flex-col gap-3">
          {WORLDS.map((world, i) => (
            <div key={world.id}>
              <WorldCard
                world={world}
                index={i}
                isLocked={totalStars < world.starsNeeded}
                earnedStars={getStars(world.id)}
                onPlay={() => handlePlay(world.route)}
              />
              {/* Path connector */}
              {i < WORLDS.length - 1 && (
                <div className="flex justify-center py-1">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.08 + 0.1 }}
                    className="w-0.5 h-3 bg-gradient-to-b from-purple-200 to-pink-200 rounded-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-3xl"
        >
          {["🌈", "✨", "🌟", "✨", "🌈"].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ delay: i * 0.15, duration: 2, repeat: Infinity }}
              className="mx-1"
            >
              {e}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
