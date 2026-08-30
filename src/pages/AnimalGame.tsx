import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";

/* ──────────────────────────────────────────────────────────────────────────────
   Animal Data
   ────────────────────────────────────────────────────────────────────────────── */

interface Animal {
  id: string;
  emoji: string;
  name: string;
  sound: string;
  hint: string;
  color: string;
}

const ANIMALS: Animal[] = [
  { id: "dog", emoji: "🐶", name: "Dog", sound: "Woof woof!", hint: "It says woof and wags its tail!", color: "from-amber-100 to-orange-100" },
  { id: "cat", emoji: "🐱", name: "Cat", sound: "Meow meow!", hint: "It purrs and says meow!", color: "from-pink-100 to-rose-100" },
  { id: "cow", emoji: "🐮", name: "Cow", sound: "Moo moo!", hint: "It lives on a farm and gives us milk!", color: "from-stone-100 to-neutral-100" },
  { id: "pig", emoji: "🐷", name: "Pig", sound: "Oink oink!", hint: "It is pink and loves mud!", color: "from-pink-100 to-red-100" },
  { id: "hen", emoji: "🐔", name: "Hen", sound: "Cluck cluck!", hint: "It lays eggs on the farm!", color: "from-amber-100 to-yellow-100" },
  { id: "horse", emoji: "🐴", name: "Horse", sound: "Neigh neigh!", hint: "You can ride on its back!", color: "from-stone-100 to-amber-100" },
  { id: "sheep", emoji: "🐑", name: "Sheep", sound: "Baa baa!", hint: "It has fluffy white wool!", color: "from-gray-100 to-slate-100" },
  { id: "rabbit", emoji: "🐰", name: "Rabbit", sound: "Squeak!", hint: "It has long ears and hops!", color: "from-pink-100 to-purple-100" },
  { id: "lion", emoji: "🦁", name: "Lion", sound: "Roar!", hint: "It is the king of the jungle!", color: "from-amber-100 to-yellow-100" },
  { id: "elephant", emoji: "🐘", name: "Elephant", sound: "Toooo!", hint: "It has a very long trunk!", color: "from-slate-100 to-blue-100" },
  { id: "monkey", emoji: "🐵", name: "Monkey", sound: "Ooh ooh!", hint: "It swings in trees and loves bananas!", color: "from-amber-100 to-orange-100" },
  { id: "frog", emoji: "🐸", name: "Frog", sound: "Ribbit!", hint: "It is green and jumps near water!", color: "from-green-100 to-emerald-100" },
  { id: "penguin", emoji: "🐧", name: "Penguin", sound: "Honk!", hint: "It is black and white and waddles!", color: "from-sky-100 to-blue-100" },
  { id: "fox", emoji: "🦊", name: "Fox", sound: "Ring-ding!", hint: "It is orange and very clever!", color: "from-orange-100 to-red-100" },
  { id: "bear", emoji: "🐻", name: "Bear", sound: "Grrr!", hint: "It is big, strong, and loves honey!", color: "from-amber-100 to-stone-100" },
  { id: "owl", emoji: "🦉", name: "Owl", sound: "Hoot hoot!", hint: "It is awake at night and very wise!", color: "from-stone-100 to-amber-100" },
  { id: "turtle", emoji: "🐢", name: "Turtle", sound: "Shhh!", hint: "It is very slow and has a shell!", color: "from-green-100 to-teal-100" },
  { id: "dolphin", emoji: "🐬", name: "Dolphin", sound: "Click click!", hint: "It swims in the sea and is very friendly!", color: "from-blue-100 to-cyan-100" },
  { id: "butterfly", emoji: "🦋", name: "Butterfly", sound: "Flutter flutter!", hint: "It has beautiful colorful wings!", color: "from-purple-100 to-pink-100" },
  { id: "duck", emoji: "🦆", name: "Duck", sound: "Quack quack!", hint: "It swims in the pond and says quack!", color: "from-yellow-100 to-amber-100" },
];

const ENCOURAGING_MESSAGES = [
  "Yay! Great job! 🌟",
  "You're amazing! ⭐",
  "Wonderful! 🎉",
  "Super smart! 🧠✨",
  "Fantastic! 🌈",
  "You did it! 🏆",
  "Brilliant! 💫",
  "So clever! 🎊",
];

const WRONG_MESSAGES = [
  "Oops! Try again! 💪",
  "Almost! Give it another go! 🌟",
  "Not quite! You can do it! 💕",
  "Nice try! Try once more! ✨",
];

/* ──────────────────────────────────────────────────────────────────────────────
   Confetti
   ────────────────────────────────────────────────────────────────────────────── */

function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#FF6B9D", "#B088F9", "#FFD93D", "#6BCB77", "#4ECDC4", "#FF8A65", "#F48FB1", "#81D4FA"];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.6,
      size: 6 + Math.random() * 8,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Stars Display
   ────────────────────────────────────────────────────────────────────────────── */

function StarsDisplay({ count, total }: { count: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          initial={i < count ? { scale: 0, rotate: -180 } : { scale: 1 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          className="text-xl"
        >
          {i < count ? "⭐" : "☆"}
        </motion.span>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Animal Card (for browse mode)
   ────────────────────────────────────────────────────────────────────────────── */

function AnimalCard({ animal, index }: { animal: Animal; index: number }) {
  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    setIsTapped(true);
    // Try to speak the animal name
    try {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(`${animal.name}! ${animal.sound}`);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech synthesis not available
    }
    setTimeout(() => setIsTapped(false), 1500);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 150 }}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleTap}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl 
                  bg-gradient-to-br ${animal.color} border-2 border-white/60 
                  shadow-md hover:shadow-xl transition-shadow cursor-pointer
                  min-w-[100px] min-h-[120px] justify-center`}
    >
      <motion.span
        className="text-5xl"
        animate={isTapped ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {animal.emoji}
      </motion.span>
      <span className="text-sm font-bold text-gray-700">{animal.name}</span>

      {/* Sound bubble */}
      <AnimatePresence>
        {isTapped && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -8 }}
            exit={{ opacity: 0, scale: 0, y: 10 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white rounded-full 
                       px-3 py-1 text-xs font-bold text-purple-600 shadow-lg
                       border border-purple-200 whitespace-nowrap z-10"
          >
            {animal.sound}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Quiz Question Component
   ────────────────────────────────────────────────────────────────────────────── */

type QuizQuestionType = "find-sound" | "find-animal";

interface QuizQuestion {
  type: QuizQuestionType;
  targetAnimal: Animal;
  options: Animal[];
}

function generateQuiz(animals: Animal[], questionIndex: number): QuizQuestion {
  const shuffled = [...animals].sort(() => Math.random() - 0.5);
  const targetAnimal = shuffled[questionIndex % shuffled.length];
  const type: QuizQuestionType = questionIndex % 2 === 0 ? "find-sound" : "find-animal";

  // Get 3 other random animals as options
  const others = shuffled.filter((a) => a.id !== targetAnimal.id).slice(0, 3);
  const options = [...others, targetAnimal].sort(() => Math.random() - 0.5);

  return { type, targetAnimal, options };
}

function QuizView({
  onComplete,
  onBack,
}: {
  onComplete: (stars: number) => void;
  onBack: () => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [totalQuestions] = useState(10);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; correct: boolean } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const question = useMemo(() => generateQuiz(ANIMALS, questionIndex), [questionIndex]);

  const handleAnswer = useCallback(
    (animal: Animal) => {
      if (selectedId) return; // Already answered
      setSelectedId(animal.id);

      if (animal.id === question.targetAnimal.id) {
        // Correct!
        const newStars = stars + 1;
        setStars(newStars);
        setShowConfetti(true);
        setFeedback({
          message: ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)],
          correct: true,
        });

        // Try to speak encouragement
        try {
          if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(
              `${question.targetAnimal.name}! ${question.targetAnimal.sound}`
            );
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            window.speechSynthesis.speak(utterance);
          }
        } catch {
          // Speech synthesis not available
        }

        setTimeout(() => {
          setShowConfetti(false);
          setFeedback(null);
          setSelectedId(null);
          setShowHint(false);
          if (questionIndex + 1 >= totalQuestions) {
            onComplete(newStars);
          } else {
            setQuestionIndex((i) => i + 1);
          }
        }, 1800);
      } else {
        // Wrong — show gentle hint
        setFeedback({
          message: WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)],
          correct: false,
        });
        setShowHint(true);

        setTimeout(() => {
          setFeedback(null);
          setSelectedId(null);
        }, 2000);
      }
    },
    [question, questionIndex, stars, totalQuestions, onComplete, selectedId],
  );

  const progress = ((questionIndex) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-magical relative overflow-hidden">
      {showConfetti && <Confetti />}

      <div className="relative z-10 flex flex-col items-center px-4 py-6 min-h-screen max-w-2xl mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 
                       border border-purple-200 text-purple-600 font-bold text-sm
                       shadow-sm hover:shadow-md transition-shadow"
          >
            <span>←</span>
            <span>Back</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <StarsDisplay count={stars} total={totalQuestions} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/50 rounded-full h-3 mb-6 overflow-hidden border border-purple-100">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Question */}
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full text-center mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-purple-100 shadow-lg">
            {question.type === "find-sound" ? (
              <>
                <p className="text-lg font-bold text-purple-600 mb-2">
                  🔊 What sound does this animal make?
                </p>
                <div className="text-7xl my-4">{question.targetAnimal.emoji}</div>
                <p className="text-xl font-extrabold text-gray-800">
                  Find the sound for {question.targetAnimal.name}!
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-purple-600 mb-2">
                  🔍 Which animal is this?
                </p>
                <p className="text-3xl font-extrabold text-gray-800 my-3">
                  "{question.targetAnimal.sound}"
                </p>
                <p className="text-base text-gray-500 font-medium">
                  Tap the animal that makes this sound!
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Answer options */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
          {question.options.map((animal, i) => {
            const isSelected = selectedId === animal.id;
            const isCorrect = animal.id === question.targetAnimal.id;
            const showResult = selectedId !== null;

            return (
              <motion.button
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                whileHover={!showResult ? { scale: 1.05, y: -3 } : {}}
                whileTap={!showResult ? { scale: 0.95 } : {}}
                onClick={() => handleAnswer(animal)}
                disabled={showResult && !isSelected}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl 
                           border-[3px] shadow-md transition-all cursor-pointer
                           ${
                             showResult && isCorrect
                               ? "bg-green-50 border-green-400 shadow-green-200"
                               : showResult && isSelected && !isCorrect
                                 ? "bg-red-50 border-red-300"
                                 : "bg-white/80 border-purple-100 hover:border-purple-300 hover:shadow-lg"
                           }
                           ${showResult && !isCorrect && !isSelected ? "opacity-40" : ""}
                           disabled:cursor-not-allowed`}
              >
                <motion.span
                  className="text-5xl"
                  animate={showResult && isCorrect ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {animal.emoji}
                </motion.span>
                <span className="text-base font-bold text-gray-700">{animal.name}</span>

                {showResult && isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 text-2xl"
                  >
                    ✅
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && question.targetAnimal && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200 
                         text-center max-w-md shadow-sm"
            >
              <p className="text-sm font-semibold text-amber-600">
                💡 Hint: {question.targetAnimal.hint}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback message */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl 
                         font-extrabold text-lg shadow-xl z-40
                         ${
                           feedback.correct
                             ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                             : "bg-gradient-to-r from-amber-400 to-orange-400 text-white"
                         }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Results Screen
   ────────────────────────────────────────────────────────────────────────────── */

function ResultsScreen({
  stars,
  total,
  onPlayAgain,
  onBackToHome,
}: {
  stars: number;
  total: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const percentage = Math.round((stars / total) * 100);
  const isPerfect = stars === total;

  return (
    <div className="min-h-screen bg-magical relative overflow-hidden">
      {showConfetti && <Confetti />}

      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border-2 border-purple-100 
                     shadow-2xl max-w-md w-full text-center"
        >
          {/* Trophy */}
          <motion.div
            className="text-7xl mb-4"
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isPerfect ? "🏆" : stars >= total * 0.7 ? "🌟" : "🎉"}
          </motion.div>

          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
            {isPerfect ? "Perfect Score!" : "Great Job!"}
          </h2>
          <p className="text-gray-500 mb-6 font-medium">
            {isPerfect
              ? "You got every single one right! You're a superstar! 🌈"
              : `You got ${stars} out of ${total} correct!`}
          </p>

          {/* Stars display */}
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: total }, (_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                className="text-2xl"
              >
                {i < stars ? "⭐" : "☆"}
              </motion.span>
            ))}
          </div>

          {/* Score badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200
                       text-purple-700 font-bold text-sm mb-8"
          >
            <span>⭐</span>
            <span>{stars} Stars Earned</span>
            <span>•</span>
            <span>{percentage}%</span>
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onPlayAgain}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 
                         text-white font-extrabold text-lg shadow-lg hover:shadow-xl 
                         transition-shadow"
            >
              Play Again! 🎮
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBackToHome}
              className="w-full py-3 rounded-2xl bg-white border-2 border-purple-200 
                         text-purple-600 font-bold text-base hover:bg-purple-50 
                         transition-colors"
            >
              Back to Home 🏠
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Browse Mode (Explore Animals)
   ────────────────────────────────────────────────────────────────────────────── */

function BrowseMode({ onStartQuiz, onBack }: { onStartQuiz: () => void; onBack: () => void }) {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const handleAnimalTap = (animal: Animal) => {
    setSelectedAnimal(animal);
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `${animal.name}! ${animal.sound}`
        );
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech synthesis not available
    }
  };

  return (
    <div className="min-h-screen bg-magical relative overflow-hidden">
      <div className="relative z-10 flex flex-col px-4 py-6 min-h-screen max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 
                       border border-purple-200 text-purple-600 font-bold text-sm
                       shadow-sm hover:shadow-md transition-shadow"
          >
            <span>←</span>
            <span>Home</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartQuiz}
            className="flex items-center gap-2 px-5 py-2 rounded-full 
                       bg-gradient-to-r from-pink-400 to-purple-400
                       text-white font-bold text-sm shadow-md hover:shadow-lg transition-shadow"
          >
            <span>🎯</span>
            <span>Start Quiz!</span>
          </motion.button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-extrabold text-purple-600 mb-1">
            🐾 Animal Friends 🐾
          </h1>
          <p className="text-sm text-purple-400 font-medium">
            Tap any animal to hear its name and sound!
          </p>
        </motion.div>

        {/* Animal grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
          {ANIMALS.map((animal, i) => (
            <AnimalCard key={animal.id} animal={animal} index={i} />
          ))}
        </div>

        {/* Selected animal detail */}
        <AnimatePresence>
          {selectedAnimal && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-0 left-0 right-0 p-4 z-30"
            >
              <div
                className={`max-w-md mx-auto bg-gradient-to-br ${selectedAnimal.color} 
                           rounded-3xl p-6 border-2 border-white/60 shadow-2xl text-center`}
              >
                <motion.div
                  className="text-6xl mb-3"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  key={selectedAnimal.id}
                >
                  {selectedAnimal.emoji}
                </motion.div>
                <h3 className="text-xl font-extrabold text-gray-800">{selectedAnimal.name}</h3>
                <p className="text-lg font-bold text-purple-600 mt-1">{selectedAnimal.sound}</p>
                <p className="text-xs text-gray-500 mt-2 italic">{selectedAnimal.hint}</p>
                <button
                  onClick={() => setSelectedAnimal(null)}
                  className="mt-3 px-4 py-1 rounded-full bg-white/60 text-gray-600 text-xs 
                             font-bold hover:bg-white/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom quiz prompt */}
        {!selectedAnimal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pb-4"
          >
            <p className="text-sm text-purple-300 font-medium">
              ✨ Tap an animal, then try the quiz! ✨
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Welcome Screen
   ────────────────────────────────────────────────────────────────────────────── */

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-magical relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="text-center max-w-md"
        >
          {/* Decorative animals */}
          <div className="flex justify-center gap-3 text-4xl mb-6">
            {["🐶", "🐱", "🐮", "🦁", "🐘"].map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { delay: i * 0.1 },
                  y: {
                    delay: i * 0.15,
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            🐾 Animal Friends Game
          </motion.h1>

          <motion.p
            className="text-base text-gray-500 font-medium mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Meet adorable animals and learn their sounds!
            <br />
            Tap to explore, then play the quiz to earn ⭐ stars!
          </motion.p>

          {/* Start button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring" }}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-red-400
                       text-white font-extrabold text-xl shadow-xl hover:shadow-2xl 
                       transition-shadow animate-pulse-glow"
          >
            Let's Go! 🚀
          </motion.button>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {[
              { emoji: "🔊", label: "Hear Sounds" },
              { emoji: "🔍", label: "Fun Quiz" },
              { emoji: "⭐", label: "Earn Stars" },
              { emoji: "🎉", label: "Win Badges" },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 
                           border border-purple-100 text-xs font-bold text-purple-500"
              >
                <span>{badge.emoji}</span>
                <span>{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Main Animal Game Component
   ────────────────────────────────────────────────────────────────────────────── */

type GameScreen = "welcome" | "browse" | "quiz" | "results";

export default function AnimalGame() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<GameScreen>("welcome");
  const [finalStars, setFinalStars] = useState(0);

  return (
    <AnimatePresence mode="wait">
      {screen === "welcome" && (
        <motion.div key="welcome" exit={{ opacity: 0, x: -50 }}>
          <WelcomeScreen onStart={() => setScreen("browse")} />
        </motion.div>
      )}
      {screen === "browse" && (
        <motion.div
          key="browse"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <BrowseMode
            onStartQuiz={() => setScreen("quiz")}
            onBack={() => navigate("/")}
          />
        </motion.div>
      )}
      {screen === "quiz" && (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <QuizView
            onComplete={(stars) => {
              setFinalStars(stars);
              setScreen("results");
            }}
            onBack={() => setScreen("browse")}
          />
        </motion.div>
      )}
      {screen === "results" && (
        <motion.div
          key="results"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ResultsScreen
            stars={finalStars}
            total={10}
            onPlayAgain={() => setScreen("quiz")}
            onBackToHome={() => navigate("/")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
