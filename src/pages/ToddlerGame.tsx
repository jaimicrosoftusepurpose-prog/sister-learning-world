import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function ToddlerGame() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-magical relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="text-center max-w-md"
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🌸
          </motion.div>

          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">
            Little Explorer Mode
          </h1>

          <p className="text-base text-purple-400/80 font-medium mb-6 leading-relaxed">
            This magical world is being built just for you!
            <br />
            Coming soon... ✨🌈
          </p>

          <motion.div
            className="flex justify-center gap-4 text-4xl mb-8"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {["🐶", "🐱", "🐮", "🎨", "🔢", "🔤"].map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 
                       text-white font-bold text-lg shadow-lg"
          >
            Back to Home 🏠
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
