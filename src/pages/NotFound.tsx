import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function NotFound() {
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
            className="text-7xl mb-4"
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🦊
          </motion.div>

          <h1 className="text-5xl font-extrabold text-purple-400 mb-3">404</h1>
          <p className="text-lg font-bold text-gray-600 mb-2">Oops! Lost in the forest!</p>
          <p className="text-sm text-gray-400 font-medium mb-8">
            This page wandered off with the animals 🐾
          </p>

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
