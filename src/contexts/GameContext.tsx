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

/* ─── Audio context singleton ─── */
let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

/* ─── Sound helpers ─── */

export function playTone(freq: number, duration = 0.15, type: OscillatorType = "sine") {
  try {
    const ctx = getAudioCtx();
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

/* ─── Synthesized animal sounds ─── */

type AnimalSoundFn = () => void;

function noise(ctx: AudioContext, duration: number, volume = 0.15): void {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * volume;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
}

const ANIMAL_SOUNDS: Record<string, AnimalSoundFn> = {
  dog: () => {
    const ctx = getAudioCtx();
    // Two quick bark bursts
    [0, 0.15].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(600, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + delay + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.12);
    });
  },
  cat: () => {
    const ctx = getAudioCtx();
    // Smooth meow sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  },
  cow: () => {
    const ctx = getAudioCtx();
    // Deep sustained moo
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.8);
  },
  pig: () => {
    const ctx = getAudioCtx();
    // Quick oink bursts with noise
    [0, 0.12].forEach((d) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(250, ctx.currentTime + d);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + d + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + d);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.08);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 0.08);
    });
    noise(ctx, 0.06, 0.08);
  },
  hen: () => {
    const ctx = getAudioCtx();
    // Cluck cluck
    [0, 0.12, 0.25].forEach((d) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, ctx.currentTime + d);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + d + 0.06);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + d);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.06);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 0.06);
    });
  },
  horse: () => {
    const ctx = getAudioCtx();
    // Neigh - rising then falling
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  },
  sheep: () => {
    const ctx = getAudioCtx();
    // Baa - tremolo effect
    const osc = ctx.createOscillator();
    const trem = ctx.createOscillator();
    const tremGain = ctx.createGain();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(280, ctx.currentTime + 0.6);
    trem.frequency.value = 20;
    tremGain.gain.value = 0.08;
    trem.connect(tremGain); tremGain.connect(gain.gain);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); trem.start();
    osc.stop(ctx.currentTime + 0.6); trem.stop(ctx.currentTime + 0.6);
  },
  rabbit: () => {
    const ctx = getAudioCtx();
    // Quick squeak
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.08);
  },
  lion: () => {
    const ctx = getAudioCtx();
    // Deep roar with noise
    noise(ctx, 0.6, 0.12);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.6);
  },
  elephant: () => {
    const ctx = getAudioCtx();
    // Trumpet sound - high to low
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.6);
  },
  monkey: () => {
    const ctx = getAudioCtx();
    // Ooh ooh - fast chirps
    [0, 0.1, 0.22].forEach((d) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime + d);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + d + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + d);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.08);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 0.08);
    });
  },
  frog: () => {
    const ctx = getAudioCtx();
    // Ribbit - two croaks
    [0, 0.18].forEach((d) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(200, ctx.currentTime + d);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + d + 0.05);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + d + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + d);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 0.1);
    });
  },
  penguin: () => {
    const ctx = getAudioCtx();
    // Honk - brassy
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.setValueAtTime(450, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  },
  duck: () => {
    const ctx = getAudioCtx();
    // Quack - two quick bursts
    [0, 0.12].forEach((d) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime + d);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + d + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + d);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.08);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 0.08);
    });
  },
  owl: () => {
    const ctx = getAudioCtx();
    // Hoot hoot - deep resonant
    [0, 0.3].forEach((d) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(350, ctx.currentTime + d);
      osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + d + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + d);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.2);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + d); osc.stop(ctx.currentTime + d + 0.2);
    });
  },
  bear: () => {
    const ctx = getAudioCtx();
    // Grrr - low growl with noise
    noise(ctx, 0.5, 0.1);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  },
};

/** Play a synthesized animal sound */
export function playAnimalSound(animalId: string): void {
  const fn = ANIMAL_SOUNDS[animalId];
  if (fn) fn();
}

/* ─── Improved speech synthesis ─── */

let cachedVoice: SpeechSynthesisVoice | null = null;

function findBestVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  try {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    if (voices.length === 0) return null;
    // Prefer a natural-sounding English voice
    const preferred = [
      "Google UK English Female",
      "Google US English",
      "Google English",
      "Microsoft Zira",
      "Microsoft Hazel",
      "Samantha",
      "Karen",
      "Daniel",
    ];
    for (const name of preferred) {
      const v = voices.find((v) => v.name.includes(name));
      if (v) { cachedVoice = v; return v; }
    }
    // Fall back to any English voice
    const english = voices.find((v) => v.lang.startsWith("en"));
    if (english) { cachedVoice = english; return english; }
    return voices[0];
  } catch {
    return null;
  }
}

// Pre-cache voices
try {
  window.speechSynthesis?.getVoices();
  window.speechSynthesis?.addEventListener?.("voiceschanged", () => {
    cachedVoice = null;
    findBestVoice();
  });
} catch {
  // ignore
}

/**
 * Speak text with improved pronunciation.
 * - Uses a preferred natural voice
 * - Splits on commas/punctuation for natural pauses
 * - Adjusts rate and pitch for child-friendliness
 */
export function speak(text: string, rate = 0.82, pitch = 1.15) {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const voice = findBestVoice();

    // For short animal sound phrases, speak each part with a pause
    // e.g. "Dog! Woof woof!" → speak name, pause, speak sound
    const parts = text.split(/[!]+/).filter((s) => s.trim());

    if (parts.length > 1) {
      parts.forEach((part, i) => {
        const u = new SpeechSynthesisUtterance(part.trim());
        if (voice) u.voice = voice;
        u.rate = rate;
        u.pitch = pitch;
        u.volume = 0.95;
        // Add a natural pause between parts
        u.lang = "en-US";
        window.speechSynthesis.speak(u);
      });
    } else {
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.rate = rate;
      u.pitch = pitch;
      u.volume = 0.95;
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  } catch {
    // ignore
  }
}

/**
 * Speak the animal name, then play its synthesized sound.
 */
export function speakAnimal(animalId: string, animalName: string, soundText: string) {
  try {
    if (!window.speechSynthesis) {
      playAnimalSound(animalId);
      return;
    }
    window.speechSynthesis.cancel();

    const voice = findBestVoice();

    // First: speak the animal name clearly
    const nameUtt = new SpeechSynthesisUtterance(animalName);
    if (voice) nameUtt.voice = voice;
    nameUtt.rate = 0.75;
    nameUtt.pitch = 1.2;
    nameUtt.volume = 0.95;
    nameUtt.lang = "en-US";

    nameUtt.onend = () => {
      // Then: play the synthesized animal sound effect
      setTimeout(() => playAnimalSound(animalId), 200);
    };

    window.speechSynthesis.speak(nameUtt);
  } catch {
    playAnimalSound(animalId);
  }
}
