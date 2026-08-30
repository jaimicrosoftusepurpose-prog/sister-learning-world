import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import GameLayout from "@/components/GameLayout";
import Confetti from "@/components/Confetti";
import { useGame, playCorrect, playWrong, playStar, playTap, speak } from "@/contexts/GameContext";

const MSGS_CORRECT = ["Yummy! Great job! 🌟", "Delicious! ⭐", "Amazing chef! 🎉", "Perfect! 👨‍🍳✨"];

interface Recipe {
  name: string;
  emoji: string;
  ingredients: string[];
  distractors?: string[];
  resultEmoji: string;
}

const RECIPES: Recipe[] = [
  { name: "Pizza", emoji: "🍕", ingredients: ["Dough", "Tomato", "Cheese", "Basil"], distractors: ["Sand", "Rocks"], resultEmoji: "🍕" },
  { name: "Cake", emoji: "🎂", ingredients: ["Flour", "Eggs", "Sugar", "Frosting"], distractors: ["Leaves", "Stones"], resultEmoji: "🎂" },
  { name: "Ice Cream", emoji: "🍦", ingredients: ["Cone", "Scoop", "Cherry"], distractors: ["Mud"], resultEmoji: "🍦" },
  { name: "Sandwich", emoji: "🥪", ingredients: ["Bread", "Cheese", "Lettuce"], distractors: ["Glass"], resultEmoji: "🥪" },
  { name: "Smoothie", emoji: "🥤", ingredients: ["Banana", "Milk", "Strawberry"], distractors: ["Dirt"], resultEmoji: "🥤" },
  { name: "Salad", emoji: "🥗", ingredients: ["Lettuce", "Tomato", "Carrot"], distractors: ["Soap"], resultEmoji: "🥗" },
  { name: "Pancakes", emoji: "🥞", ingredients: ["Flour", "Milk", "Butter", "Syrup"], distractors: ["Rocks", "Sand"], resultEmoji: "🥞" },
  { name: "Taco", emoji: "🌮", ingredients: ["Shell", "Meat", "Cheese", "Salsa"], distractors: ["Grass"], resultEmoji: "🌮" },
];

const INGREDIENT_EMOJIS: Record<string, string> = {
  Dough: "🫓", Tomato: "🍅", Cheese: "🧀", Basil: "🌿",
  Flour: "🌾", Eggs: "🥚", Sugar: "🍬", Frosting: "🧁",
  Cone: "🍦", Scoop: "🍨", Cherry: "🍒",
  Bread: "🍞", Lettuce: "🥬",
  Banana: "🍌", Milk: "🥛", Strawberry: "🍓",
  Carrot: "🥕",
  Butter: "🧈", Syrup: "🍯",
  Shell: "🌮", Meat: "🥩", Salsa: "🫙",
  Sand: "🏖️", Rocks: "🪨", Leaves: "🍂", Stones: "🪨",
  Mud: "💩", Glass: "🪟", Dirt: "🌍", Soap: "🧼", Grass: "🌱",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Little Explorer: Simple ingredient tapping ─── */
function LittleMode({ onComplete }: { onComplete: (s: number) => void }) {
  const { addStars, soundEnabled } = useGame();
  const [ri, setRi] = useState(0);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fb, setFb] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const totalRecipes = 5;

  const recipe = RECIPES[ri % RECIPES.length];
  const options = useMemo(() => {
    return shuffle([...recipe.ingredients, ...(recipe.distractors ?? [])]);
  }, [ri]);

  const handleSelect = useCallback((ing: string) => {
    if (done || selected.includes(ing)) return;
    if (soundEnabled) playTap();

    if (recipe.ingredients.includes(ing)) {
      const newSel = [...selected, ing];
      setSelected(newSel);
      if (soundEnabled) speak(ing);
      if (newSel.length >= recipe.ingredients.length) {
        const ns = stars + 1;
        setStars(ns);
        setConfetti(true);
        setDone(true);
        setFb(`You made ${recipe.name}! ${recipe.resultEmoji}`);
        if (soundEnabled) { playCorrect(); speak(`You made ${recipe.name}!`); }
        setTimeout(() => {
          setConfetti(false); setFb(null); setSelected([]); setDone(false);
          if (ri + 1 >= totalRecipes) { if (soundEnabled) playStar(); addStars("cooking", Math.min(ns, 3)); onComplete(ns); }
          else setRi((i) => i + 1);
        }, 2200);
      }
    } else {
      if (soundEnabled) playWrong();
      setFb("That's not right! Try another! 💪");
      setTimeout(() => setFb(null), 1500);
    }
  }, [recipe, selected, done, stars, ri, totalRecipes, onComplete, soundEnabled, addStars]);

  useEffect(() => {
    if (soundEnabled) speak(`Make a ${recipe.name}! Tap the right ingredients!`, 0.8);
  }, [ri, soundEnabled, recipe.name]);

  return (
    <div className="flex-1 flex flex-col items-center px-3 pb-4">
      {confetti && <Confetti />}

      {/* Progress */}
      <div className="bg-white/50 rounded-full h-2.5 mb-3 overflow-hidden border border-yellow-100 w-full max-w-sm">
        <motion.div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" animate={{ width: `${(ri / totalRecipes) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: totalRecipes }, (_, i) => <span key={i} className="text-sm">{i < stars ? "⭐" : "☆"}</span>)}</div>

      {/* Recipe card */}
      <motion.div key={ri} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 rounded-3xl p-5 border-2 border-yellow-100 shadow-lg text-center mb-5 w-full max-w-sm">
        <p className="text-sm font-bold text-yellow-500 mb-2">👨‍🍳 Recipe time!</p>
        <div className="text-5xl mb-2">{recipe.emoji}</div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-1">Make a {recipe.name}!</h3>

        {/* Ingredients needed */}
        <div className="flex justify-center gap-1 mt-2">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm
              ${selected.includes(ing) ? "bg-green-100 border-green-400" : "bg-gray-50 border-gray-200"}`}>
              {selected.includes(ing) ? "✅" : INGREDIENT_EMOJIS[ing] ?? "❓"}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">{selected.length}/{recipe.ingredients.length} ingredients</p>
      </motion.div>

      {/* Ingredient options */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-sm w-full mb-4">
        {options.map((ing, i) => {
          const isSelected = selected.includes(ing);
          return (
            <motion.button key={`${ri}-${ing}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              whileHover={!isSelected && !done ? { scale: 1.08, y: -2 } : {}}
              whileTap={!isSelected && !done ? { scale: 0.92 } : {}}
              onClick={() => handleSelect(ing)} disabled={isSelected || done}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-[3px] shadow-md transition-all cursor-pointer
                ${isSelected ? "bg-green-50 border-green-300 opacity-60" : "bg-white border-yellow-100 hover:border-yellow-300 hover:shadow-lg"}
                disabled:cursor-not-allowed`}>
              <span className="text-3xl">{INGREDIENT_EMOJIS[ing] ?? "❓"}</span>
              <span className="text-[10px] font-bold text-gray-600">{ing}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {fb && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl font-extrabold text-base shadow-xl z-40
              bg-gradient-to-r from-green-400 to-emerald-400 text-white">
            {fb}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Smart Explorer: Follow recipe in order ─── */
function SmartMode({ onComplete }: { onComplete: (s: number) => void }) {
  const { addStars, soundEnabled } = useGame();
  const [ri, setRi] = useState(0);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fb, setFb] = useState<string | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const totalRecipes = 6;

  const recipe = RECIPES[ri % RECIPES.length];
  const allOptions = useMemo(() => {
    return shuffle([...recipe.ingredients, ...(recipe.distractors ?? [])]);
  }, [ri]);

  const currentIngredient = recipe.ingredients[stepIdx];

  const handleSelect = useCallback((ing: string) => {
    if (done) return;
    if (soundEnabled) playTap();

    if (ing === currentIngredient) {
      if (soundEnabled) speak(ing);
      const nextStep = stepIdx + 1;
      if (nextStep >= recipe.ingredients.length) {
        const ns = stars + 1;
        setStars(ns);
        setConfetti(true);
        setDone(true);
        setFb(`You made ${recipe.name}! ${recipe.resultEmoji}`);
        if (soundEnabled) { playCorrect(); speak(`You made ${recipe.name}!`); }
        setTimeout(() => {
          setConfetti(false); setFb(null); setStepIdx(0); setDone(false);
          if (ri + 1 >= totalRecipes) { if (soundEnabled) playStar(); addStars("cooking", Math.min(ns, 3)); onComplete(ns); }
          else setRi((i) => i + 1);
        }, 2200);
      } else {
        setStepIdx(nextStep);
        if (soundEnabled) playCorrect();
      }
    } else {
      if (soundEnabled) playWrong();
      setFb(`Oops! Next ingredient: ${currentIngredient}! Try again! 💪`);
      setTimeout(() => setFb(null), 2000);
    }
  }, [currentIngredient, stepIdx, recipe, done, stars, ri, totalRecipes, onComplete, soundEnabled, addStars]);

  return (
    <div className="flex-1 flex flex-col items-center px-3 pb-4">
      {confetti && <Confetti />}

      <div className="bg-white/50 rounded-full h-2.5 mb-3 overflow-hidden border border-yellow-100 w-full max-w-sm">
        <motion.div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" animate={{ width: `${(ri / totalRecipes) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: totalRecipes }, (_, i) => <span key={i} className="text-sm">{i < stars ? "⭐" : "☆"}</span>)}</div>

      {/* Recipe card */}
      <motion.div key={ri} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        className="bg-white/80 rounded-3xl p-5 border-2 border-yellow-100 shadow-lg text-center mb-5 w-full max-w-sm">
        <p className="text-sm font-bold text-yellow-500 mb-1">👨‍🍳 Follow the recipe!</p>
        <div className="text-4xl mb-2">{recipe.emoji}</div>
        <h3 className="text-lg font-extrabold text-gray-800 mb-2">Make {recipe.name}!</h3>

        {/* Step indicator */}
        <div className="flex justify-center gap-1.5">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className={`px-2 py-1 rounded-full text-[10px] font-bold border transition-all
              ${i < stepIdx ? "bg-green-100 border-green-400 text-green-600" : i === stepIdx ? "bg-yellow-100 border-yellow-400 text-yellow-600 animate-pulse" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
              {i < stepIdx ? "✅" : `${i + 1}. ${ing}`}
            </div>
          ))}
        </div>

        <p className="text-xs text-orange-400 mt-2 font-semibold">
          Next: Add the <span className="text-orange-600">{currentIngredient}</span>!
        </p>
      </motion.div>

      {/* Ingredient options */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-sm w-full mb-4">
        {allOptions.map((ing, i) => (
          <motion.button key={`${ri}-${ing}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: "spring" }}
            whileHover={!done ? { scale: 1.08, y: -2 } : {}}
            whileTap={!done ? { scale: 0.92 } : {}}
            onClick={() => handleSelect(ing)} disabled={done}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl border-[3px] shadow-md transition-all cursor-pointer
              bg-white border-yellow-100 hover:border-yellow-300 hover:shadow-lg disabled:cursor-not-allowed`}>
            <span className="text-2xl">{INGREDIENT_EMOJIS[ing] ?? "❓"}</span>
            <span className="text-[10px] font-bold text-gray-600">{ing}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {fb && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl font-extrabold text-sm shadow-xl z-40
              bg-gradient-to-r from-amber-400 to-orange-400 text-white max-w-xs text-center">
            {fb}
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
        className="bg-white/90 rounded-3xl p-7 border-2 border-yellow-100 shadow-2xl max-w-sm w-full text-center">
        <motion.div className="text-6xl mb-3" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>👨‍🍳</motion.div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-1">{stars >= 3 ? "Master Chef!" : "Great Cooking!"}</h2>
        <p className="text-sm text-gray-500 mb-4">⭐ {stars} Dishes Made!</p>
        <div className="flex flex-col gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRetry}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-extrabold text-base shadow-lg">Cook More! 🍳</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onHome}
            className="w-full py-2.5 rounded-2xl bg-white border-2 border-yellow-200 text-yellow-600 font-bold text-sm">Back to Map 🗺️</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main CookingGame ─── */
type Screen = "play" | "results";
export default function CookingGame() {
  const navigate = useNavigate();
  const { mode } = useGame();
  const m = mode ?? "smart";
  const [screen, setScreen] = useState<Screen>("play");
  const [finalStars, setFinalStars] = useState(0);

  return (
    <GameLayout title="Kitchen Corner" emoji="🍕" onBack={() => navigate("/map")}>
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
