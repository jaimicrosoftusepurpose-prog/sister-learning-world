import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type ExplorerMode = "little" | "smart";

interface GameState {
  mode: ExplorerMode | null;
  stars: Record<string, number>;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

interface GameContextType extends GameState {
  setMode: (mode: ExplorerMode) => void;
  clearMode: () => void;
  addStars: (gameId: string, count: number) => number;
  getStars: (gameId: string) => number;
  getTotalStars: () => number;
  toggleSound: () => void;
  toggleMusic: () => void;
}

const STORAGE_KEY = "little-sisters-fun-world";

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        mode: parsed.mode ?? null,
        stars: parsed.stars ?? {},
        soundEnabled: parsed.soundEnabled ?? true,
        musicEnabled: parsed.musicEnabled ?? true,
      };
    }
  } catch {
    // ignore
  }
  return {
    mode: null,
    stars: {},
    soundEnabled: true,
    musicEnabled: true,
  };
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setMode = useCallback((mode: ExplorerMode) => {
    setState((s) => ({ ...s, mode }));
  }, []);

  const clearMode = useCallback(() => {
    setState((s) => ({ ...s, mode: null }));
  }, []);

  const addStars = useCallback((gameId: string, count: number) => {
    let newTotal = 0;
    setState((s) => {
      const current = s.stars[gameId] ?? 0;
      const updated = { ...s.stars, [gameId]: current + count };
      newTotal = Object.values(updated).reduce((a, b) => a + b, 0);
      return { ...s, stars: updated };
    });
    return newTotal;
  }, []);

  const getStars = useCallback(
    (gameId: string) => state.stars[gameId] ?? 0,
    [state.stars],
  );

  const getTotalStars = useCallback(
    () => Object.values(state.stars).reduce((a, b) => a + b, 0),
    [state.stars],
  );

  const toggleSound = useCallback(() => {
    setState((s) => ({ ...s, soundEnabled: !s.soundEnabled }));
  }, []);

  const toggleMusic = useCallback(() => {
    setState((s) => ({ ...s, musicEnabled: !s.musicEnabled }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        setMode,
        clearMode,
        addStars,
        getStars,
        getTotalStars,
        toggleSound,
        toggleMusic,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

/* ─── Sound helpers ─── */

export function playTone(freq: number, duration = 0.15, type: OscillatorType = "sine") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.12;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore
  }
}

export function playCorrect() {
  playTone(523, 0.1);
  setTimeout(() => playTone(659, 0.1), 100);
  setTimeout(() => playTone(784, 0.2), 200);
}

export function playWrong() {
  playTone(300, 0.2, "triangle");
  setTimeout(() => playTone(250, 0.3, "triangle"), 150);
}

export function playTap() {
  playTone(800, 0.06);
}

export function playStar() {
  playTone(880, 0.1);
  setTimeout(() => playTone(1100, 0.15), 80);
}

export function speak(text: string, rate = 0.85, pitch = 1.1) {
  try {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      u.pitch = pitch;
      u.volume = 0.9;
      window.speechSynthesis.speak(u);
    }
  } catch {
    // ignore
  }
}
