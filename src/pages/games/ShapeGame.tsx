import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import GameLayout from "@/components/GameLayout";
import Confetti from "@/components/Confetti";
import { useGame, playCorrect, playWrong, playStar, speak } from "@/contexts/GameContext";

const MSGS_CORRECT = ["Yay! Great job! 🌟", "You're amazing! ⭐", "Wonderful! 🎉", "Super smart! 🧠✨"];
const MSGS_WRONG = ["Oops! Try again! 💪", "Almost! 🌟", "Not quite! 💕"];

/* ─── Shape definitions ─── */
interface ShapeQ {
  prompt: string;
  answer: string;
  display: string;
  opts: string[];
  type: "shape" | "color";
}

const SHAPES = [
  { name: "Circle", svg: <circle cx="24" cy="24" r="20" fill="currentColor" /> },
  { name: "Square", svg: <rect x="4" y="4" width="40" height="40" rx="3" fill="currentColor" /> },
  { name: "Triangle", svg: <polygon points="24,4 44,44 4,44" fill="currentColor" /> },
  { name: "Star", svg: <polygon points="24,2 29,18 46,18 32,28 37,44 24,34 11,44 16,28 2,18 19,18" fill="currentColor" /> },
  { name: "Heart", svg: <path d="M24 44 C10 30 2 18 8 10 C14 4 24 8 24 16 C24 8 34 4 40 10 C46 18 38 30 24 44Z" fill="currentColor" /> },
  { name: "Diamond", svg: <polygon points="24,2 44,24 24,46 4,24" fill="currentColor" /> },
];

const COLORS = [
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#22C55E" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Purple", value: "#A855F7" },
  { name: "Orange", value: "#F97316" },
  { name: "Pink", value: "#EC4899" },
  { name: "Brown", value: "#92400E" },
];

function ShapeIcon({ shape, color, size = 48 }: { shape: typeof SHAPES[0]; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ color: color || "#A855F7" }}>
      {shape.svg}
    </svg>
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

/* ─── Little Explorer: Simple Shape/Color Tapping ─── */
function LittleMode({ onComplete }: { onComplete: (s: number) => void }) {
  const { addStars, soundEnabled } = useGame();
  const [qi, setQi] = useState(0);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fb, setFb] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const totalQ = 8;

  const q = useMemo((): ShapeQ => {
    const isColor = Math.random() > 0.5;
    if (isColor) {
      const target = COLORS[Math.floor(Math.random() * COLORS.length)];
      const others = COLORS.filter((c) => c.name !== target.name).sort(() => Math.random() - 0.5).slice(0, 1);
      const opts = shuffle([target.name, ...others.map((o) => o.name)]);
      return { prompt: "Which color is this?", answer: target.name, display: target.value, opts, type: "color" };
    } else {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const others = SHAPES.filter((s) => s.name !== shape.name).sort(() => Math.random() - 0.5).slice(0, 1);
      const opts = shuffle([shape.name, ...others.map((o) => o.name)]);
      return { prompt: "What shape is this?", answer: shape.name, display: shape.name, opts, type: "shape" };
    }
  }, [qi]);

  const handleAnswer = useCallback((answer: string) => {
    if (selId) return;
    setSelId(answer);
    if (answer === q.answer) {
      const ns = stars + 1;
      setStars(ns);
      setConfetti(true);
      if (soundEnabled) { playCorrect(); speak(q.answer); }
      setFb({ msg: MSGS_CORRECT[Math.floor(Math.random() * MSGS_CORRECT.length)], ok: true });
      setTimeout(() => {
        setConfetti(false); setFb(null); setSelId(null);
        if (qi + 1 >= totalQ) { if (soundEnabled) playStar(); addStars("shapes", Math.min(ns, 3)); onComplete(ns); }
        else setQi((i) => i + 1);
      }, 1600);
    } else {
      if (soundEnabled) playWrong();
      setFb({ msg: MSGS_WRONG[Math.floor(Math.random() * MSGS_WRONG.length)], ok: false });
      setTimeout(() => { setFb(null); setSelId(null); }, 1800);
    }
  }, [q, stars, qi, totalQ, onComplete, selId, soundEnabled, addStars]);

  useEffect(() => {
    if (soundEnabled) speak(`${q.prompt} ${q.type === "color" ? q.answer : ""}`, 0.8);
  }, [qi, soundEnabled, q]);

  const targetShape = SHAPES.find((s) => s.name === q.answer) ?? SHAPES[0];
  const targetColor = COLORS.find((c) => c.name === q.answer)?.value ?? "#A855F7";

  return (
    <div className="flex-1 flex flex-col items-center px-3 pb-4">
      {confetti && <Confetti />}
      <div className="bg-white/50 rounded-full h-2.5 mb-3 overflow-hidden border border-purple-100 w-full max-w-sm">
        <motion.div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" animate={{ width: `${(qi / totalQ) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: totalQ }, (_, i) => <span key={i} className="text-sm">{i < stars ? "⭐" : "☆"}</span>)}</div>

      <motion.div key={qi} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 rounded-3xl p-6 border-2 border-purple-100 shadow-lg text-center mb-6">
        <p className="text-base font-bold text-purple-500 mb-3">{q.prompt}</p>
        <div className="flex justify-center my-4">
          {q.type === "color" ? (
            <motion.div className="w-24 h-24 rounded-3xl shadow-lg border-4 border-white"
              style={{ backgroundColor: q.display }} animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
          ) : (
            <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}>
              <ShapeIcon shape={targetShape} color="#A855F7" size={80} />
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 max-w-xs w-full">
        {q.opts.map((opt, i) => {
          const isSel = selId === opt;
          const isCorr = opt === q.answer;
          const show = selId !== null;
          return (
            <motion.button key={`${qi}-${opt}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={!show ? { scale: 1.08 } : {}} onClick={() => handleAnswer(opt)} disabled={show}
              className={`h-16 sm:h-20 rounded-2xl border-[3px] shadow-md flex items-center justify-center
                text-lg sm:text-xl font-black cursor-pointer transition-all
                ${show && isCorr ? "bg-green-50 border-green-400 text-green-600" : show && isSel && !isCorr ? "bg-red-50 border-red-300 text-red-400" : "bg-white border-purple-200 text-purple-600 hover:border-purple-400 hover:shadow-lg"}`}>
              {q.type === "color" && <span className="w-5 h-5 rounded-full mr-2 border" style={{ backgroundColor: COLORS.find((c) => c.name === opt)?.value }} />}
              {opt}
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

/* ─── Smart Explorer: More shapes, harder questions ─── */
function SmartMode({ onComplete }: { onComplete: (s: number) => void }) {
  const { addStars, soundEnabled } = useGame();
  const [qi, setQi] = useState(0);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fb, setFb] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const totalQ = 10;

  const q = useMemo((): ShapeQ => {
    const types: Array<"shape" | "color"> = ["shape", "color"];
    const type = types[Math.floor(Math.random() * types.length)];
    if (type === "color") {
      const target = COLORS[Math.floor(Math.random() * COLORS.length)];
      const others = COLORS.filter((c) => c.name !== target.name).sort(() => Math.random() - 0.5).slice(0, 3);
      return { prompt: "What color is this?", answer: target.name, display: target.value, opts: shuffle([target.name, ...others.map((o) => o.name)]), type: "color" };
    } else {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const others = SHAPES.filter((s) => s.name !== shape.name).sort(() => Math.random() - 0.5).slice(0, 3);
      return { prompt: "What shape is this?", answer: shape.name, display: shape.name, opts: shuffle([shape.name, ...others.map((o) => o.name)]), type: "shape" };
    }
  }, [qi]);

  const handleAnswer = useCallback((answer: string) => {
    if (selId) return;
    setSelId(answer);
    if (answer === q.answer) {
      const ns = stars + 1;
      setStars(ns);
      setConfetti(true);
      if (soundEnabled) { playCorrect(); speak(q.answer); }
      setFb({ msg: MSGS_CORRECT[Math.floor(Math.random() * MSGS_CORRECT.length)], ok: true });
      setTimeout(() => {
        setConfetti(false); setFb(null); setSelId(null);
        if (qi + 1 >= totalQ) { if (soundEnabled) playStar(); addStars("shapes", Math.min(ns, 3)); onComplete(ns); }
        else setQi((i) => i + 1);
      }, 1600);
    } else {
      if (soundEnabled) playWrong();
      setFb({ msg: MSGS_WRONG[Math.floor(Math.random() * MSGS_WRONG.length)], ok: false });
      setTimeout(() => { setFb(null); setSelId(null); }, 1800);
    }
  }, [q, stars, qi, totalQ, onComplete, selId, soundEnabled, addStars]);

  const targetShape = SHAPES.find((s) => s.name === q.answer) ?? SHAPES[0];
  const targetColor = COLORS.find((c) => c.name === q.answer)?.value ?? "#A855F7";

  return (
    <div className="flex-1 flex flex-col items-center px-3 pb-4">
      {confetti && <Confetti />}
      <div className="bg-white/50 rounded-full h-2.5 mb-3 overflow-hidden border border-purple-100 w-full max-w-sm">
        <motion.div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" animate={{ width: `${(qi / totalQ) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: totalQ }, (_, i) => <span key={i} className="text-sm">{i < stars ? "⭐" : "☆"}</span>)}</div>

      <motion.div key={qi} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        className="bg-white/80 rounded-3xl p-5 border-2 border-purple-100 shadow-lg text-center mb-5">
        <p className="text-sm font-bold text-purple-500 mb-3">{q.prompt}</p>
        <div className="flex justify-center my-3">
          {q.type === "color" ? (
            <motion.div className="w-20 h-20 rounded-2xl shadow-lg border-4 border-white"
              style={{ backgroundColor: q.display }} animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
          ) : (
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ShapeIcon shape={targetShape} color={COLORS[Math.floor(Math.random() * COLORS.length)].value} size={70} />
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
        {q.opts.map((opt, i) => {
          const isSel = selId === opt;
          const isCorr = opt === q.answer;
          const show = selId !== null;
          return (
            <motion.button key={`${qi}-${opt}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring" }}
              whileHover={!show ? { scale: 1.05 } : {}} onClick={() => handleAnswer(opt)} disabled={show}
              className={`h-14 sm:h-16 rounded-2xl border-[3px] shadow-md flex items-center justify-center
                text-base sm:text-lg font-bold cursor-pointer transition-all
                ${show && isCorr ? "bg-green-50 border-green-400 text-green-600" : show && isSel && !isCorr ? "bg-red-50 border-red-300 text-red-400" : "bg-white border-purple-200 text-purple-600 hover:border-purple-400 hover:shadow-lg"}`}>
              {q.type === "color" && <span className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: COLORS.find((c) => c.name === opt)?.value }} />}
              {opt}
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

/* ─── Results ─── */
function Results({ stars, onRetry, onHome }: { stars: number; onRetry: () => void; onHome: () => void }) {
  const [conf, setConf] = useState(true);
  useEffect(() => { const t = setTimeout(() => setConf(false), 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
      {conf && <Confetti />}
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}
        className="bg-white/90 rounded-3xl p-7 border-2 border-purple-100 shadow-2xl max-w-sm w-full text-center">
        <motion.div className="text-6xl mb-3" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🏆</motion.div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-1">{stars >= 8 ? "Perfect!" : "Great Job!"}</h2>
        <p className="text-sm text-gray-500 mb-4">⭐ {stars} Stars Earned!</p>
        <div className="flex flex-col gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRetry}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 text-white font-extrabold text-base shadow-lg">Play Again! 🎮</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onHome}
            className="w-full py-2.5 rounded-2xl bg-white border-2 border-purple-200 text-purple-600 font-bold text-sm">Back to Map 🗺️</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main ShapeGame ─── */
type Screen = "play" | "results";
export default function ShapeGame() {
  const navigate = useNavigate();
  const { mode } = useGame();
  const m = mode ?? "smart";
  const [screen, setScreen] = useState<Screen>("play");
  const [finalStars, setFinalStars] = useState(0);

  return (
    <GameLayout title="Shapes & Colors" emoji="🎯" onBack={() => navigate("/map")}>
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
            <Results stars={finalStars} onRetry={() => setScreen("play")} onHome={() => navigate("/map")} />
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
}
