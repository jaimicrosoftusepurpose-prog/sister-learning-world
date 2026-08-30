import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import GameLayout from "@/components/GameLayout";
import Confetti from "@/components/Confetti";
import { useGame, playCorrect, playWrong, playStar, speak, speakAnimal, playAnimalSound } from "@/contexts/GameContext";

/* ─── Animal Data ─── */
interface Animal {
  id: string;
  emoji: string;
  name: string;
  sound: string;
  hint: string;
  color: string;
}

const ANIMALS: Animal[] = [
  { id: "dog", emoji: "🐶", name: "Dog", sound: "Woof woof!", hint: "It wags its tail!", color: "from-amber-100 to-orange-100" },
  { id: "cat", emoji: "🐱", name: "Cat", sound: "Meow meow!", hint: "It purrs softly!", color: "from-pink-100 to-rose-100" },
  { id: "cow", emoji: "🐮", name: "Cow", sound: "Moo moo!", hint: "It gives us milk!", color: "from-stone-100 to-neutral-100" },
  { id: "pig", emoji: "🐷", name: "Pig", sound: "Oink oink!", hint: "It is pink!", color: "from-pink-100 to-red-100" },
  { id: "hen", emoji: "🐔", name: "Hen", sound: "Cluck cluck!", hint: "It lays eggs!", color: "from-amber-100 to-yellow-100" },
  { id: "horse", emoji: "🐴", name: "Horse", sound: "Neigh!", hint: "You can ride it!", color: "from-stone-100 to-amber-100" },
  { id: "sheep", emoji: "🐑", name: "Sheep", sound: "Baa baa!", hint: "It has fluffy wool!", color: "from-gray-100 to-slate-100" },
  { id: "rabbit", emoji: "🐰", name: "Rabbit", sound: "Squeak!", hint: "It hops with long ears!", color: "from-pink-100 to-purple-100" },
  { id: "lion", emoji: "🦁", name: "Lion", sound: "Roar!", hint: "King of the jungle!", color: "from-amber-100 to-yellow-100" },
  { id: "elephant", emoji: "🐘", name: "Elephant", sound: "Tooo!", hint: "It has a long trunk!", color: "from-slate-100 to-blue-100" },
  { id: "monkey", emoji: "🐵", name: "Monkey", sound: "Ooh ooh!", hint: "It loves bananas!", color: "from-amber-100 to-orange-100" },
  { id: "frog", emoji: "🐸", name: "Frog", sound: "Ribbit!", hint: "It is green and jumps!", color: "from-green-100 to-emerald-100" },
  { id: "penguin", emoji: "🐧", name: "Penguin", sound: "Honk!", hint: "It waddles on ice!", color: "from-sky-100 to-blue-100" },
  { id: "duck", emoji: "🦆", name: "Duck", sound: "Quack!", hint: "It swims in ponds!", color: "from-yellow-100 to-amber-100" },
  { id: "owl", emoji: "🦉", name: "Owl", sound: "Hoot hoot!", hint: "It is awake at night!", color: "from-stone-100 to-amber-100" },
  { id: "bear", emoji: "🐻", name: "Bear", sound: "Grrr!", hint: "It loves honey!", color: "from-amber-100 to-stone-100" },
];

const MSGS_CORRECT = ["Yay! Great job! 🌟", "You're amazing! ⭐", "Wonderful! 🎉", "Super smart! 🧠✨", "Fantastic! 🌈", "You did it! 🏆"];
const MSGS_WRONG = ["Oops! Try again! 💪", "Almost! Try once more! 🌟", "Not quite! You can do it! 💕"];

/* ─── Animal Card (browse) ─── */
function AnimalCard({ animal, index, soundOn }: { animal: Animal; index: number; soundOn: boolean }) {
  const [tapped, setTapped] = useState(false);
  const handleTap = () => {
    setTapped(true);
    if (soundOn) speakAnimal(animal.id, animal.name, animal.sound);
    setTimeout(() => setTapped(false), 1500);
  };
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 150 }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleTap}
      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl 
                  bg-gradient-to-br ${animal.color} border-2 border-white/60 
                  shadow-md hover:shadow-lg transition-shadow cursor-pointer min-w-[80px] min-h-[100px] justify-center`}
    >
      <motion.span className="text-4xl sm:text-5xl" animate={tapped ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
        {animal.emoji}
      </motion.span>
      <span className="text-xs font-bold text-gray-700">{animal.name}</span>
      <AnimatePresence>
        {tapped && (
          <motion.div initial={{ opacity: 0, scale: 0, y: 10 }} animate={{ opacity: 1, scale: 1, y: -8 }} exit={{ opacity: 0 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-2 py-0.5 text-[10px] font-bold text-purple-600 shadow-lg border border-purple-200 whitespace-nowrap z-10">
            {animal.sound}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Browse Mode ─── */
function BrowseMode({ onStartQuiz, onBack, soundOn }: { onStartQuiz: () => void; onBack: () => void; soundOn: boolean }) {
  const [sel, setSel] = useState<Animal | null>(null);
  return (
    <div className="flex flex-col flex-1 px-3 pb-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-purple-400 font-medium">Tap any animal to hear it! 🔊</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onStartQuiz}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-xs shadow-md">
          🎯 Quiz Time!
        </motion.button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
        {ANIMALS.map((a, i) => <AnimalCard key={a.id} animal={a} index={i} soundOn={soundOn} />)}
      </div>
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 p-3 z-30">
            <div className={`max-w-sm mx-auto bg-gradient-to-br ${sel.color} rounded-3xl p-5 border-2 border-white/60 shadow-2xl text-center`}>
              <motion.div className="text-5xl mb-2" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5 }} key={sel.id}>{sel.emoji}</motion.div>
              <h3 className="text-lg font-extrabold text-gray-800">{sel.name}</h3>
              <p className="text-base font-bold text-purple-600 mt-1">{sel.sound}</p>
              <p className="text-xs text-gray-500 mt-1 italic">{sel.hint}</p>
              <button onClick={() => setSel(null)} className="mt-2 px-3 py-1 rounded-full bg-white/60 text-gray-600 text-xs font-bold">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Quiz ─── */
function QuizView({ onComplete, onBack, mode, soundOn }: { onComplete: (s: number) => void; onBack: () => void; mode: "little" | "smart"; soundOn: boolean }) {
  const navigate = useNavigate();
  const totalQ = mode === "little" ? 5 : 10;
  const choiceCount = mode === "little" ? 2 : 4;
  const [qi, setQi] = useState(0);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fb, setFb] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [hint, setHint] = useState(false);

  const q = useMemo(() => {
    const shuffled = [...ANIMALS].sort(() => Math.random() - 0.5);
    const target = shuffled[qi % shuffled.length];
    const isFindSound = qi % 2 === 0;
    const others = shuffled.filter((a) => a.id !== target.id).slice(0, choiceCount - 1);
    const opts = [...others, target].sort(() => Math.random() - 0.5);
    return { target, isFindSound, opts };
  }, [qi, choiceCount]);

  const handleAnswer = useCallback((animal: Animal) => {
    if (selId) return;
    setSelId(animal.id);
    if (animal.id === q.target.id) {
      const ns = stars + 1;
      setStars(ns);
      setConfetti(true);
      if (soundOn) { playCorrect(); speakAnimal(q.target.id, q.target.name, q.target.sound); }
      setFb({ msg: MSGS_CORRECT[Math.floor(Math.random() * MSGS_CORRECT.length)], ok: true });
      setTimeout(() => {
        setConfetti(false); setFb(null); setSelId(null); setHint(false);
        if (qi + 1 >= totalQ) { if (soundOn) playStar(); onComplete(ns); }
        else setQi((i) => i + 1);
      }, 1800);
    } else {
      if (soundOn) playWrong();
      setFb({ msg: MSGS_WRONG[Math.floor(Math.random() * MSGS_WRONG.length)], ok: false });
      setHint(true);
      setTimeout(() => { setFb(null); setSelId(null); }, 2000);
    }
  }, [q, qi, stars, totalQ, onComplete, selId, soundOn]);

  // Voice instruction for little mode
  useEffect(() => {
    if (mode === "little" && soundOn) {
      const t = setTimeout(() => {
        speak(q.isFindSound ? `Find the ${q.target.name}!` : `Which animal says ${q.target.sound}?`, 0.7, 1.2);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [qi, mode, soundOn, q]);

  return (
    <div className="flex flex-col flex-1 px-3 pb-4">
      {confetti && <Confetti />}

      {/* Progress */}
      <div className="bg-white/50 rounded-full h-2.5 mb-4 overflow-hidden border border-purple-100">
        <motion.div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" animate={{ width: `${(qi / totalQ) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-0.5 mb-4">
        {Array.from({ length: totalQ }, (_, i) => <span key={i} className="text-base">{i < stars ? "⭐" : "☆"}</span>)}
      </div>

      {/* Question */}
      <motion.div key={qi} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 border-2 border-purple-100 shadow-lg text-center mb-5">
        {q.isFindSound ? (
          <>
            <p className="text-base font-bold text-purple-600 mb-2">🔊 What sound does this animal make?</p>
            <div className="text-5xl sm:text-6xl my-3">{q.target.emoji}</div>
            <p className="text-lg font-extrabold text-gray-800">Find the sound for {q.target.name}!</p>
          </>
        ) : (
          <>
            <p className="text-base font-bold text-purple-600 mb-2">🔍 Which animal is this?</p>
            <p className="text-xl sm:text-2xl font-extrabold text-gray-800 my-2">"{q.target.sound}"</p>
            <p className="text-sm text-gray-500 font-medium">Tap the right animal!</p>
          </>
        )}
      </motion.div>

      {/* Options */}
      <div className={`grid ${mode === "little" ? "grid-cols-2 gap-4 max-w-xs" : "grid-cols-2 sm:grid-cols-4 gap-3"} mx-auto w-full mb-4`}>
        {q.opts.map((animal, i) => {
          const isSel = selId === animal.id;
          const isCorr = animal.id === q.target.id;
          const show = selId !== null;
          return (
            <motion.button key={animal.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, type: "spring" }}
              whileHover={!show ? { scale: 1.05, y: -2 } : {}}
              onClick={() => handleAnswer(animal)} disabled={show && !isSel}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-[3px] shadow-md transition-all cursor-pointer
                ${show && isCorr ? "bg-green-50 border-green-400" : show && isSel && !isCorr ? "bg-red-50 border-red-300" : "bg-white/80 border-purple-100 hover:border-purple-300 hover:shadow-lg"}
                ${show && !isCorr && !isSel ? "opacity-40" : ""} disabled:cursor-not-allowed`}>
              <motion.span className={`${mode === "little" ? "text-5xl" : "text-4xl"}`} animate={show && isCorr ? { scale: [1, 1.3, 1] } : {}}>{animal.emoji}</motion.span>
              <span className="text-sm font-bold text-gray-700">{animal.name}</span>
              {show && isCorr && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 text-xl">✅</motion.span>}
            </motion.button>
          );
        })}
      </div>

      {/* Hint */}
      <AnimatePresence>
        {hint && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white/80 rounded-2xl p-3 border border-amber-200 text-center max-w-sm mx-auto mb-2">
            <p className="text-xs font-semibold text-amber-600">💡 Hint: {q.target.hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {fb && (
          <motion.div initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }}
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
function Results({ stars, total, onRetry, onHome }: { stars: number; total: number; onRetry: () => void; onHome: () => void }) {
  const [conf, setConf] = useState(true);
  useEffect(() => { const t = setTimeout(() => setConf(false), 3000); return () => clearTimeout(t); }, []);
  const pct = Math.round((stars / total) * 100);
  const perfect = stars === total;
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
      {conf && <Confetti />}
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-7 sm:p-8 border-2 border-purple-100 shadow-2xl max-w-sm w-full text-center">
        <motion.div className="text-6xl mb-3" animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          {perfect ? "🏆" : stars >= total * 0.7 ? "🌟" : "🎉"}
        </motion.div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-1">{perfect ? "Perfect Score!" : "Great Job!"}</h2>
        <p className="text-sm text-gray-500 font-medium mb-4">{perfect ? "You're a superstar! 🌈" : `You got ${stars} out of ${total}!`}</p>
        <div className="flex justify-center gap-0.5 mb-4">
          {Array.from({ length: total }, (_, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.08 }} className="text-lg">
              {i < stars ? "⭐" : "☆"}
            </motion.span>
          ))}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-purple-700 font-bold text-xs mb-5">
          ⭐ {stars} Stars • {pct}%
        </div>
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

/* ─── Main AnimalGame ─── */
type Screen = "browse" | "quiz" | "results";
export default function AnimalGame() {
  const navigate = useNavigate();
  const { mode, addStars, soundEnabled } = useGame();
  const m = mode ?? "smart";
  const [screen, setScreen] = useState<Screen>("browse");
  const [finalStars, setFinalStars] = useState(0);

  return (
    <GameLayout title="Animal Friends" emoji="🐶" onBack={() => navigate("/map")}>
      <AnimatePresence mode="wait">
        {screen === "browse" && (
          <motion.div key="browse" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
            <BrowseMode onStartQuiz={() => setScreen("quiz")} onBack={() => navigate("/map")} soundOn={soundEnabled} />
          </motion.div>
        )}
        {screen === "quiz" && (
          <motion.div key="quiz" className="flex-1 flex flex-col" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <QuizView mode={m} soundOn={soundEnabled} onComplete={(s) => { setFinalStars(s); addStars("animals", s); setScreen("results"); }} onBack={() => setScreen("browse")} />
          </motion.div>
        )}
        {screen === "results" && (
          <motion.div key="results" className="flex-1 flex flex-col" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Results stars={finalStars} total={m === "little" ? 5 : 10} onRetry={() => setScreen("quiz")} onHome={() => navigate("/map")} />
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
}
