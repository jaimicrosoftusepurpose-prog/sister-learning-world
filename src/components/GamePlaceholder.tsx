import { motion } from "framer-motion";
import GameLayout from "@/components/GameLayout";

export default function GamePlaceholder({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <GameLayout title={title} emoji={emoji} onBack={() => history.back()}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="text-center"
        >
          <motion.div
            className="text-7xl mb-5"
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.div>

          <h2 className="text-2xl font-extrabold text-purple-500 mb-2">
            Coming Soon!
          </h2>
          <p className="text-base text-gray-500 font-medium mb-6 max-w-sm">
            {description}
          </p>

          <div className="flex justify-center gap-2 text-2xl">
            {["✨", "🌟", "⭐", "🌟", "✨"].map((e, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                transition={{
                  delay: i * 0.2,
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </GameLayout>
  );
}
