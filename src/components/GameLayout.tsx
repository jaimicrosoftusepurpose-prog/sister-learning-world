import { useNavigate } from "react-router";
import { useGame, playTap } from "@/contexts/GameContext";
import { motion } from "framer-motion";

export default function GameLayout({
  title,
  emoji,
  children,
  showStars = true,
  onBack,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
  showStars?: boolean;
  onBack?: () => void;
}) {
  const navigate = useNavigate();
  const { mode, getTotalStars, soundEnabled, toggleSound } = useGame();

  const handleBack = () => {
    if (soundEnabled) playTap();
    if (onBack) onBack();
    else navigate("/map");
  };

  return (
    <div className="min-h-screen bg-magical relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/70 
                     border border-purple-200 text-purple-600 font-bold text-sm
                     shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm"
        >
          <span className="text-base">←</span>
          <span className="hidden sm:inline">Back</span>
        </motion.button>

        <div className="flex items-center gap-2">
          {showStars && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 
                           border border-amber-200 shadow-sm backdrop-blur-sm">
              <span className="text-sm">⭐</span>
              <span className="text-sm font-bold text-amber-600">
                {getTotalStars()}
              </span>
            </div>
          )}

          {mode && (
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm border ${
                mode === "little"
                  ? "bg-pink-100/80 border-pink-200 text-pink-600"
                  : "bg-amber-100/80 border-amber-200 text-amber-600"
              }`}
            >
              {mode === "little" ? "🌸 Little" : "⭐ Smart"}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (soundEnabled) playTap();
              toggleSound();
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/70 
                       border border-purple-200 shadow-sm hover:shadow-md transition-shadow
                       backdrop-blur-sm text-lg"
          >
            {soundEnabled ? "🔊" : "🔇"}
          </motion.button>
        </div>
      </div>

      {/* Game title */}
      <div className="text-center px-4 pb-2">
        <h1 className="text-lg sm:text-xl font-extrabold text-purple-600">
          {emoji} {title}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 flex flex-col">{children}</div>
    </div>
  );
}
