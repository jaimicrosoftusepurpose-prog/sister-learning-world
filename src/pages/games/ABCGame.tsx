import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import GameLayout from "@/components/GameLayout";
import Confetti from "@/components/Confetti";
import { useGame, playCorrect, playWrong, playStar, speak } from "@/contexts/GameContext";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const SPELLING_WORDS = [
  { word: "CAT", emoji: "🐱" },
  { word: "DOG", emoji: "🐶" },
  { word: "SUN", emoji: "☀️" },
  { word: "BUS", emoji: "🚌" },
  { word: "FISH", emoji: "🐟" },
  { word: "BIRD", emoji: "🐦" },
  { word: "STAR", emoji: "⭐" },
  { word: "FROG", emoji: "🐸" },
  { word: "CAKE", emoji: "🎂" },
  { word: "MOON", emoji: "🌙" },
  { word: "TREE", emoji: "🌳" },
  { word: "FIRE", emoji: "🔥" },
  { word: "BEAR", emoji: "🐻" },
  { word: "FISH", emoji: "🐠" },
  { word: "DRUM", emoji: "🥁" },
  { word: "SHIP", emoji: "🚢" },
];

const MSGS_CORRECT = ["Awesome! 🌟", "You're great! ⭐", "Wonderful! 🎉", "Super! 🧠✨"];
const MSGS_WRONG = ["Try again! 💪", "Almost! 🌟", "Not quite! 💕"];

/* ─── Little Explorer: Letter Recognition ─── */
function LittleMode({ onComplete }: { onComplete: (s: number) => void }) {
  const { addStars, soundEnabled } = useGame();
  const [qi, setQi] = useState(0);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fb, setFb] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const totalQ = 8;

  const q = useMemo(() => {
    const target = LETTERS[Math.floor(Math.random() * 26)];
    const others = LETTERS.filter((l) => l !== target).sort(() => Math.random() - 0.5).slice(0, 1);
    const opts = shuffle([target, ...others]);
    return { target, opts };
  }, [qi]);

  const handleAnswer = useCallback((letter: string) => {
    if (selId) return;
    setSelId(letter);
    if (letter === q.target) {
      const ns = stars + 1;
      setStars(ns);
      setConfetti(true);
      if (soundEnabled) { playCorrect(); speak(`The letter ${q.target}!`); }
      setFb({ msg: MSGS_CORRECT[Math.floor(Math.random() * MSGS_CORRECT.length)], ok: true });
      setTimeout(() => {
        setConfetti(false); setFb(null); setSelId(null);
        if (qi + 1 >= totalQ) { if (soundEnabled) playStar(); addStars("abc", Math.min(ns, 3)); onComplete(ns); }
        else setQi((i) => i + 1);
      }, 1600);
    } else {
      if (soundEnabled) playWrong();
      setFb({ msg: MSGS_WRONG[Math.floor(Math.random() * MSGS_WRONG.length)], ok: false });
      setTimeout(() => { setFb(null); setSelId(null); }, 1800);
    }
  }, [q, stars, qi, totalQ, onComplete, selId, soundEnabled, addStars]);

  useEffect(() => {
    if (soundEnabled) speak(`Find the letter ${q.target}!`, 0.75);
  }, [qi, soundEnabled, q.target]);

  return (
    <div className="flex-1 flex flex-col items-center px-3 pb-4">
      {confetti && <Confetti />}
      <div className="bg-white/50 rounded-full h-2.5 mb-3 overflow-hidden border border-purple-100 w-full max-w-sm">
        <motion.div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" animate={{ width: `${(qi / totalQ) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: totalQ }, (_, i) => <span key={i} className="text-sm">{i < stars ? "⭐" : "☆"}</span>)}</div>

      <motion.div key={qi} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 rounded-3xl p-6 border-2 border-purple-100 shadow-lg text-center mb-6">
        <p className="text-base font-bold text-purple-600 mb-3">🔤 Find the letter!</p>
        <motion.div className="text-7xl sm:text-8xl font-black text-purple-500" animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}>{q.target}</motion.div>
      </motion.div>

      <div className="grid grid-cols-2 gap-5 max-w-xs w-full">
        {q.opts.map((letter, i) => {
          const isSel = selId === letter;
          const isCorr = letter === q.target;
          const show = selId !== null;
          return (
            <motion.button key={`${qi}-${letter}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={!show ? { scale: 1.08 } : {}}
              onClick={() => handleAnswer(letter)} disabled={show}
              className={`h-20 sm:h-24 rounded-2xl border-[3px] shadow-md flex items-center justify-center
                text-4xl sm:text-5xl font-black cursor-pointer transition-all
                ${show && isCorr ? "bg-green-50 border-green-400 text-green-600" : show && isSel && !isCorr ? "bg-red-50 border-red-300 text-red-400" : "bg-white border-purple-200 text-purple-500 hover:border-purple-400 hover:shadow-lg"}`}>
              {letter}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {fb && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl font-extrabold text-base shadow-xl z-40
              ${fb.ok ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white" : "bg-gradient-to-r from-amber-400 to-orange-400 text-white"}`}>
            {fb.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Smart Explorer: Spelling ─── */
function SmartMode({ onComplete }: { onComplete: (s: number) => void }) {
  const { addStars, soundEnabled } = useGame();
  const [wi, setWi] = useState(0);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fb, setFb] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [filled, setFilled] = useState<string[]>([]);
  const totalQ = SPELLING_WORDS.length;

  const word = SPELLING_WORDS[wi % SPELLING_WORDS.length];
  const needed = word.word.split("");

  // Generate options: correct letter + 2 distractors
  const opts = useMemo(() => {
    const nextIdx = filled.length;
    if (nextIdx >= needed.length) return [];
    const correct = needed[nextIdx];
    const dist = LETTERS.filter((l) => l !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
    return shuffle([correct, ...dist]);
  }, [filled, needed]);

  const handleAnswer = useCallback((letter: string) => {
    if (selId) return;
    setSelId(letter);
    const nextIdx = filled.length;
    const correct = needed[nextIdx];

    if (letter === correct) {
      if (soundEnabled) playCorrect();
      const newFilled = [...filled, letter];
      setFilled(newFilled);
      setFb({ msg: "Correct! ✨", ok: true });
      setTimeout(() => { setFb(null); setSelId(null); }, 400);

      if (newFilled.length >= needed.length) {
        const ns = stars + 1;
        setStars(ns);
        setConfetti(true);
        if (soundEnabled) speak(`${word.word}! ${word.emoji}`);
        setTimeout(() => {
          setConfetti(false); setFilled([]); setSelId(null);
          if (wi + 1 >= totalQ) { if (soundEnabled) playStar(); addStars("abc", Math.min(ns, 3)); onComplete(ns); }
          else setWi((i) => i + 1);
        }, 1500);
      }
    } else {
      if (soundEnabled) playWrong();
      setFb({ msg: MSGS_WRONG[Math.floor(Math.random() * MSGS_WRONG.length)], ok: false });
      setTimeout(() => { setFb(null); setSelId(null); }, 1500);
    }
  }, [selId, filled, needed, stars, wi, totalQ, onComplete, soundEnabled, word, addStars]);

  return (
    <div className="flex-1 flex flex-col items-center px-3 pb-4">
      {confetti && <Confetti />}
      <div className="bg-white/50 rounded-full h-2.5 mb-3 overflow-hidden border border-purple-100 w-full max-w-sm">
        <motion.div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" animate={{ width: `${((wi + filled.length / needed.length) / totalQ) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: totalQ }, (_, i) => <span key={i} className="text-sm">{i < stars ? "⭐" : "☆"}</span>)}</div>

      <motion.div key={wi} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        className="bg-white/80 rounded-3xl p-6 border-2 border-purple-100 shadow-lg text-center mb-5">
        <p className="text-sm font-bold text-purple-600 mb-2">✏️ Spell the word!</p>
        <div className="text-5xl sm:text-6xl mb-3">{word.emoji}</div>

        {/* Letter slots */}
        <div className="flex justify-center gap-2 mb-2">
          {needed.map((letter, i) => (
            <motion.div key={i}
              className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-[3px] flex items-center justify-center text-xl sm:text-2xl font-black
                ${i < filled.length ? "bg-green-50 border-green-400 text-green-600" : i === filled.length ? "bg-purple-50 border-purple-300 text-purple-400" : "bg-gray-50 border-gray-200 text-gray-300"}`}
              animate={i === filled.length ? { scale: [1, 1.05, 1] } : {}}>
              {i < filled.length ? filled[i] : "_"}
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-gray-400 font-medium">{word.word.length} letters</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 max-w-xs w-full">
        {opts.map((letter, i) => {
          const isSel = selId === letter;
          const show = selId !== null;
          return (
            <motion.button key={`${wi}-${filled.length}-${letter}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring" }}
              whileHover={!show ? { scale: 1.08 } : {}} onClick={() => handleAnswer(letter)} disabled={show}
              className={`h-16 sm:h-20 rounded-2xl border-[3px] shadow-md flex items-center justify-center
                text-2xl sm:text-3xl font-black cursor-pointer transition-all
                ${show && isSel ? "bg-red-50 border-red-300 text-red-400" : "bg-white border-purple-200 text-purple-500 hover:border-purple-400 hover:shadow-lg"}`}>
              {letter}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {fb && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl font-extrabold text-sm shadow-xl z-40
              ${fb.ok ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white" : "bg-gradient-to-r from-amber-400 to-orange-400 text-white"}`}>
            {fb.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Results ─── */
function Results({ stars, total, onRetry, onHome }: { stars: number; total: number; onRetry: () => void; onHome: () => void }) {
  const [conf, setConf] = useState(true);
  useEffect(() => { const t = setTimeout(() => setConf(false), 3000); return () => clearTimeout(t); }, []);
  const perfect = stars === total;
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
      {conf && <Confetti />}
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}
        className="bg-white/90 rounded-3xl p-7 border-2 border-purple-100 shadow-2xl max-w-sm w-full text-center">
        <motion.div className="text-6xl mb-3" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          {perfect ? "🏆" : "🌟"}
        </motion.div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-1">{perfect ? "Perfect!" : "Great Job!"}</h2>
        <p className="text-sm text-gray-500 mb-4">⭐ {stars} Stars Earned!</p>
        <div className="flex flex-col gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRetry}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-extrabold text-base shadow-lg">Play Again! 🎮</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onHome}
            className="w-full py-2.5 rounded-2xl bg-white border-2 border-purple-200 text-purple-600 font-bold text-sm">Back to Map 🗺️</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main ABCGame ─── */
type Screen = "play" | "results";
export default function ABCGame() {
  const navigate = useNavigate();
  const { mode } = useGame();
  const m = mode ?? "smart";
  const [screen, setScreen] = useState<Screen>("play");
  const [finalStars, setFinalStars] = useState(0);

  return (
    <GameLayout title="ABC & Spelling" emoji="🔤" onBack={() => navigate("/map")}>
      <AnimatePresence mode="wait">
        {screen === "play" && (
          <motion.div key="play" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {m === "little" ? (
              <LittleMode onComplete={(s) => { setFinalStars(s); setScreen("results"); }} />
            ) : (
              <SmartMode onComplete={(s) => { setFinalStars(s); setScreen("results"); }} />
            )}
          </motion.div>
        )}
        {screen === "results" && (
          <motion.div key="res" className="flex-1 flex flex-col" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Results stars={finalStars} total={3} onRetry={() => setScreen("play")} onHome={() => navigate("/map")} />
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
}
