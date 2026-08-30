import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import GameLayout from "@/components/GameLayout";
import Confetti from "@/components/Confetti";
import { useGame, playCorrect, playWrong, playStar, speak } from "@/contexts/GameContext";

const MSGS_CORRECT = ["Yay! Great job! 🌟", "You're amazing! ⭐", "Wonderful! 🎉", "Math wizard! 🧠✨"];
const MSGS_WRONG = ["Oops! Try again! 💪", "Almost! 🌟", "Not quite! 💕"];

/* ─── Little Explorer: Counting ─── */
function LittleMode({ onComplete }: { onComplete: (s: number) => void }) {
  const { addStars, soundEnabled } = useGame();
  const [qi, setQi] = useState(0);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fb, setFb] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const totalQ = 8;

  const EMOJI池 = ["🍎", "🐶", "⭐", "🌸", "🐱", "🍓", "🎀", "🦋"];

  const q = useMemo(() => {
    const emoji = EMOJI池[Math.floor(Math.random() * EMOJI池.length)];
    const count = Math.floor(Math.random() * 5) + 1;
    const opts = shuffle([1, 2, 3, 4, 5]).slice(0, 3);
    if (!opts.includes(count)) opts[Math.floor(Math.random() * opts.length)] = count;
    return { emoji, count, opts: shuffle(opts) };
  }, [qi]);

  const handleAnswer = useCallback((num: number) => {
    if (selId !== null) return;
    setSelId(String(num));
    if (num === q.count) {
      const ns = stars + 1;
      setStars(ns);
      setConfetti(true);
      if (soundEnabled) { playCorrect(); speak(`${q.count}!`); }
      setFb({ msg: MSGS_CORRECT[Math.floor(Math.random() * MSGS_CORRECT.length)], ok: true });
      setTimeout(() => {
        setConfetti(false); setFb(null); setSelId(null);
        if (qi + 1 >= totalQ) { if (soundEnabled) playStar(); addStars("math", Math.min(ns, 3)); onComplete(ns); }
        else setQi((i) => i + 1);
      }, 1600);
    } else {
      if (soundEnabled) playWrong();
      setFb({ msg: MSGS_WRONG[Math.floor(Math.random() * MSGS_WRONG.length)], ok: false });
      setTimeout(() => { setFb(null); setSelId(null); }, 1800);
    }
  }, [q, stars, qi, totalQ, onComplete, selId, soundEnabled, addStars]);

  useEffect(() => {
    if (soundEnabled) speak(`Count the ${q.emoji}! How many?`, 0.8);
  }, [qi, soundEnabled, q.emoji]);

  return (
    <div className="flex-1 flex flex-col items-center px-3 pb-4">
      {confetti && <Confetti />}
      <div className="bg-white/50 rounded-full h-2.5 mb-3 overflow-hidden border border-purple-100 w-full max-w-sm">
        <motion.div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" animate={{ width: `${(qi / totalQ) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: totalQ }, (_, i) => <span key={i} className="text-sm">{i < stars ? "⭐" : "☆"}</span>)}</div>

      <motion.div key={qi} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 rounded-3xl p-5 sm:p-6 border-2 border-orange-100 shadow-lg text-center mb-6">
        <p className="text-base font-bold text-orange-500 mb-3">🔢 Count the objects!</p>
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {Array.from({ length: q.count }, (_, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: "spring" }}
              className="text-4xl sm:text-5xl">{q.emoji}</motion.span>
          ))}
        </div>
        <p className="text-lg font-extrabold text-gray-800">How many {q.emoji}?</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 max-w-xs w-full">
        {q.opts.map((num, i) => {
          const isSel = selId === String(num);
          const isCorr = num === q.count;
          const show = selId !== null;
          return (
            <motion.button key={`${qi}-${num}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={!show ? { scale: 1.1 } : {}} onClick={() => handleAnswer(num)} disabled={show}
              className={`h-20 sm:h-24 rounded-2xl border-[3px] shadow-md flex items-center justify-center
                text-3xl sm:text-4xl font-black cursor-pointer transition-all
                ${show && isCorr ? "bg-green-50 border-green-400 text-green-600" : show && isSel && !isCorr ? "bg-red-50 border-red-300 text-red-400" : "bg-white border-orange-200 text-orange-500 hover:border-orange-400 hover:shadow-lg"}`}>
              {num}
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

/* ─── Smart Explorer: Addition & Subtraction ─── */
function SmartMode({ onComplete }: { onComplete: (s: number) => void }) {
  const { addStars, soundEnabled } = useGame();
  const [qi, setQi] = useState(0);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fb, setFb] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const totalQ = 10;

  const q = useMemo(() => {
    const isAdd = Math.random() > 0.4;
    if (isAdd) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const answer = a + b;
      const opts = generateOpts(answer, 1, 20);
      return { display: `${a} + ${b}`, answer, opts, emoji: "➕" };
    } else {
      const a = Math.floor(Math.random() * 10) + 5;
      const b = Math.floor(Math.random() * Math.min(a, 10)) + 1;
      const answer = a - b;
      const opts = generateOpts(answer, 0, 20);
      return { display: `${a} − ${b}`, answer, opts, emoji: "➖" };
    }
  }, [qi]);

  const handleAnswer = useCallback((num: number) => {
    if (selId !== null) return;
    setSelId(String(num));
    if (num === q.answer) {
      const ns = stars + 1;
      setStars(ns);
      setConfetti(true);
      if (soundEnabled) { playCorrect(); speak(`${q.answer}!`); }
      setFb({ msg: MSGS_CORRECT[Math.floor(Math.random() * MSGS_CORRECT.length)], ok: true });
      setTimeout(() => {
        setConfetti(false); setFb(null); setSelId(null);
        if (qi + 1 >= totalQ) { if (soundEnabled) playStar(); addStars("math", Math.min(ns, 3)); onComplete(ns); }
        else setQi((i) => i + 1);
      }, 1600);
    } else {
      if (soundEnabled) playWrong();
      setFb({ msg: MSGS_WRONG[Math.floor(Math.random() * MSGS_WRONG.length)], ok: false });
      setTimeout(() => { setFb(null); setSelId(null); }, 1800);
    }
  }, [q, stars, qi, totalQ, onComplete, selId, soundEnabled, addStars]);

  return (
    <div className="flex-1 flex flex-col items-center px-3 pb-4">
      {confetti && <Confetti />}
      <div className="bg-white/50 rounded-full h-2.5 mb-3 overflow-hidden border border-orange-100 w-full max-w-sm">
        <motion.div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" animate={{ width: `${(qi / totalQ) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: totalQ }, (_, i) => <span key={i} className="text-sm">{i < stars ? "⭐" : "☆"}</span>)}</div>

      <motion.div key={qi} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        className="bg-white/80 rounded-3xl p-6 border-2 border-orange-100 shadow-lg text-center mb-6">
        <p className="text-sm font-bold text-orange-500 mb-3">{q.emoji} Solve the math problem!</p>
        <motion.div className="text-5xl sm:text-6xl font-black text-orange-500" animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity }}>{q.display} = ?</motion.div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-sm w-full">
        {q.opts.map((num, i) => {
          const isSel = selId === String(num);
          const isCorr = num === q.answer;
          const show = selId !== null;
          return (
            <motion.button key={`${qi}-${num}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring" }}
              whileHover={!show ? { scale: 1.08 } : {}} onClick={() => handleAnswer(num)} disabled={show}
              className={`h-16 sm:h-20 rounded-2xl border-[3px] shadow-md flex items-center justify-center
                text-2xl sm:text-3xl font-black cursor-pointer transition-all
                ${show && isCorr ? "bg-green-50 border-green-400 text-green-600" : show && isSel && !isCorr ? "bg-red-50 border-red-300 text-red-400" : "bg-white border-orange-200 text-orange-500 hover:border-orange-400 hover:shadow-lg"}`}>
              {num}
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

function generateOpts(answer: number, min: number, max: number): number[] {
  const opts = new Set<number>([answer]);
  let tries = 0;
  while (opts.size < 4 && tries < 50) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const candidate = answer + (Math.random() > 0.5 ? offset : -offset);
    if (candidate >= min && candidate <= max && candidate !== answer) opts.add(candidate);
    tries++;
  }
  while (opts.size < 4) opts.add(opts.size + min);
  return shuffle([...opts]);
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
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
      {conf && <Confetti />}
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}
        className="bg-white/90 rounded-3xl p-7 border-2 border-orange-100 shadow-2xl max-w-sm w-full text-center">
        <motion.div className="text-6xl mb-3" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🏆</motion.div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-1">{stars === total ? "Perfect!" : "Great Job!"}</h2>
        <p className="text-sm text-gray-500 mb-4">⭐ {stars} Stars Earned!</p>
        <div className="flex flex-col gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRetry}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-extrabold text-base shadow-lg">Play Again! 🎮</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onHome}
            className="w-full py-2.5 rounded-2xl bg-white border-2 border-orange-200 text-orange-600 font-bold text-sm">Back to Map 🗺️</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main MathGame ─── */
type Screen = "play" | "results";
export default function MathGame() {
  const navigate = useNavigate();
  const { mode } = useGame();
  const m = mode ?? "smart";
  const [screen, setScreen] = useState<Screen>("play");
  const [finalStars, setFinalStars] = useState(0);

  return (
    <GameLayout title="Counting & Math" emoji="🔢" onBack={() => navigate("/map")}>
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
            <Results stars={finalStars} total={m === "little" ? 3 : 3} onRetry={() => setScreen("play")} onHome={() => navigate("/map")} />
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
}
