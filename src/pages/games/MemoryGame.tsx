import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useCallback, useEffect, useMemo } from "react";
import GameLayout from "@/components/GameLayout";
import Confetti from "@/components/Confetti";
import { useGame, playCorrect, playWrong, playStar, playTap, speak } from "@/contexts/GameContext";

const EMOJIS = ["🐶", "🐱", "🐮", "🐰", "🦁", "🐘", "🐸", "🐧", "🦊", "🐻", "🦋", "🐢", "🍓", "🌟", "🍕", "🎨"];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createBoard(pairCount: number): Card[] {
  const chosen = shuffle(EMOJIS).slice(0, pairCount);
  const pairs = chosen.flatMap((emoji, i) => [
    { id: i * 2, emoji, flipped: false, matched: false },
    { id: i * 2 + 1, emoji, flipped: false, matched: false },
  ]);
  return shuffle(pairs);
}

function StarsBar({ found, total }: { found: number; total: number }) {
  return (
    <div className="flex justify-center gap-0.5 mb-3">
      {Array.from({ length: total }, (_, i) => <span key={i} className="text-sm">{i < found ? "⭐" : "☆"}</span>)}
    </div>
  );
}

export default function MemoryGame() {
  const navigate = useNavigate();
  const { mode, addStars, soundEnabled } = useGame();
  const m = mode ?? "smart";
  const pairCount = m === "little" ? 3 : 6;
  const gridSize = m === "little" ? "grid-cols-3" : "grid-cols-4";

  const [board, setBoard] = useState<Card[]>(() => createBoard(pairCount));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [fb, setFb] = useState<string | null>(null);
  const totalPairs = pairCount;

  // Voice instruction for little mode
  useEffect(() => {
    if (m === "little" && soundEnabled) {
      speak("Find the matching pairs! Tap two cards!", 0.8);
    }
  }, [m, soundEnabled]);

  const flipCard = useCallback((id: number) => {
    if (locked) return;
    setBoard((prev) => {
      const card = prev.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return prev;
      return prev.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    });
    setFlippedIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, [locked]);

  // Check for matches
  useEffect(() => {
    if (flippedIds.length !== 2) return;
    setLocked(true);
    const [a, b] = flippedIds;
    const cardA = board.find((c) => c.id === a);
    const cardB = board.find((c) => c.id === b);
    if (!cardA || !cardB) return;

    setMoves((m) => m + 1);

    if (cardA.emoji === cardB.emoji) {
      if (soundEnabled) playCorrect();
      setFb("Match! 🎉");
      setTimeout(() => {
        setBoard((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c)));
        setMatched((prev) => {
          const next = prev + 1;
          if (next >= totalPairs) {
            if (soundEnabled) playStar();
            setTimeout(() => setShowResult(true), 600);
          }
          return next;
        });
        setFlippedIds([]);
        setLocked(false);
        setFb(null);
      }, 600);
    } else {
      if (soundEnabled) playWrong();
      setFb("Not a match! Try again! 💪");
      setTimeout(() => {
        setBoard((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)));
        setFlippedIds([]);
        setLocked(false);
        setFb(null);
      }, 1000);
    }
  }, [flippedIds, board, totalPairs, soundEnabled]);

  const handleComplete = useCallback(() => {
    const starsEarned = Math.max(1, totalPairs - Math.floor(moves / totalPairs));
    addStars("memory", Math.min(starsEarned, 3));
    setConfetti(true);
    setShowResult(true);
  }, [moves, totalPairs, addStars]);

  useEffect(() => {
    if (showResult) handleComplete();
  }, [showResult, handleComplete]);

  const resetGame = () => {
    setBoard(createBoard(pairCount));
    setFlippedIds([]);
    setMatched(0);
    setMoves(0);
    setConfetti(false);
    setLocked(false);
    setShowResult(false);
    setFb(null);
  };

  if (showResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {confetti && <Confetti />}
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-7 border-2 border-purple-100 shadow-2xl max-w-sm w-full text-center">
          <motion.div className="text-6xl mb-3" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🏆</motion.div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-1">All Matched!</h2>
          <p className="text-sm text-gray-500 mb-2">Completed in {moves} moves!</p>
          <p className="text-xs text-purple-500 font-semibold mb-5">⭐ {Math.min(totalPairs, 3)} Stars Earned!</p>
          <div className="flex flex-col gap-2">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={resetGame}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-extrabold text-base shadow-lg">Play Again! 🎮</motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/map")}
              className="w-full py-2.5 rounded-2xl bg-white border-2 border-purple-200 text-purple-600 font-bold text-sm">Back to Map 🗺️</motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <GameLayout title="Memory Match" emoji="🧩" onBack={() => navigate("/map")}>
      <div className="flex-1 flex flex-col items-center px-3 pb-4">
        <StarsBar found={matched} total={totalPairs} />

        <p className="text-xs text-gray-500 font-medium mb-3">
          Moves: {m === "little" ? `⭐ ${moves}` : moves} {m === "smart" && `• Pairs: ${matched}/${totalPairs}`}
        </p>

        {/* Feedback */}
        <AnimatePresence>
          {fb && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-2 px-4 py-1.5 rounded-full bg-white/80 border border-purple-100 text-xs font-bold text-purple-600 shadow-sm">
              {fb}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className={`${gridSize} gap-2 sm:gap-3 max-w-sm w-full`}>
          {board.map((card) => (
            <motion.button
              key={card.id}
              whileHover={!card.matched && !card.flipped && !locked ? { scale: 1.05 } : {}}
              whileTap={!card.matched && !card.flipped && !locked ? { scale: 0.95 } : {}}
              onClick={() => flipCard(card.id)}
              disabled={card.matched || card.flipped || locked}
              className={`aspect-square rounded-2xl flex items-center justify-center text-3xl sm:text-4xl
                border-[3px] shadow-md transition-all duration-300 cursor-pointer
                ${card.matched
                  ? "bg-green-50 border-green-300 shadow-green-100"
                  : card.flipped
                    ? "bg-white border-purple-300 shadow-purple-100"
                    : "bg-gradient-to-br from-purple-200 to-pink-200 border-purple-300 hover:border-purple-400 hover:shadow-lg"
                } disabled:cursor-not-allowed`}
            >
              <AnimatePresence mode="wait">
                {card.flipped || card.matched ? (
                  <motion.span key="face" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90 }}
                    transition={{ duration: 0.2 }}>
                    {card.emoji}
                  </motion.span>
                ) : (
                  <motion.span key="back" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: -90 }}
                    transition={{ duration: 0.2 }} className="text-xl sm:text-2xl">
                    ❓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {m === "little" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="mt-4 text-xs text-purple-300 font-medium text-center">
            Tap two cards to find matching pairs! 🔍
          </motion.p>
        )}
      </div>
    </GameLayout>
  );
}
