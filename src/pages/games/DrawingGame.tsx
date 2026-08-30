import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import GameLayout from "@/components/GameLayout";
import { useGame, playTap } from "@/contexts/GameContext";

const COLORS = [
  "#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6",
  "#A855F7", "#EC4899", "#92400E", "#1F2937", "#FFFFFF",
];

const BRUSH_SIZES = [4, 8, 14, 22];

const TEMPLATES = [
  { name: "Cat", emoji: "🐱", draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => drawCat(ctx, w, h) },
  { name: "Flower", emoji: "🌸", draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => drawFlower(ctx, w, h) },
  { name: "Star", emoji: "⭐", draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => drawStar(ctx, w, h) },
  { name: "Butterfly", emoji: "🦋", draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => drawButterfly(ctx, w, h) },
  { name: "Rainbow", emoji: "🌈", draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => drawRainbow(ctx, w, h) },
];

function drawCat(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2, cy = h / 2, s = Math.min(w, h) * 0.35;
  ctx.strokeStyle = "#1F2937";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  // Head
  ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2); ctx.stroke();
  // Ears
  ctx.beginPath(); ctx.moveTo(cx - s * 0.7, cy - s * 0.5); ctx.lineTo(cx - s * 0.3, cy - s * 1.1); ctx.lineTo(cx - s * 0.1, cy - s * 0.4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + s * 0.7, cy - s * 0.5); ctx.lineTo(cx + s * 0.3, cy - s * 1.1); ctx.lineTo(cx + s * 0.1, cy - s * 0.4); ctx.stroke();
  // Eyes
  ctx.fillStyle = "#1F2937";
  ctx.beginPath(); ctx.arc(cx - s * 0.3, cy - s * 0.1, s * 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + s * 0.3, cy - s * 0.1, s * 0.1, 0, Math.PI * 2); ctx.fill();
  // Nose
  ctx.beginPath(); ctx.moveTo(cx, cy + s * 0.1); ctx.lineTo(cx - s * 0.08, cy + s * 0.2); ctx.lineTo(cx + s * 0.08, cy + s * 0.2); ctx.closePath(); ctx.fill();
  // Mouth
  ctx.beginPath(); ctx.moveTo(cx, cy + s * 0.2); ctx.lineTo(cx - s * 0.15, cy + s * 0.4); ctx.moveTo(cx, cy + s * 0.2); ctx.lineTo(cx + s * 0.15, cy + s * 0.4); ctx.stroke();
  // Whiskers
  ctx.beginPath(); ctx.moveTo(cx - s * 0.3, cy + s * 0.2); ctx.lineTo(cx - s * 1, cy + s * 0.1); ctx.moveTo(cx - s * 0.3, cy + s * 0.3); ctx.lineTo(cx - s * 1, cy + s * 0.4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + s * 0.3, cy + s * 0.2); ctx.lineTo(cx + s * 1, cy + s * 0.1); ctx.moveTo(cx + s * 0.3, cy + s * 0.3); ctx.lineTo(cx + s * 1, cy + s * 0.4); ctx.stroke();
}

function drawFlower(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2, cy = h / 2, s = Math.min(w, h) * 0.25;
  ctx.strokeStyle = "#1F2937"; ctx.lineWidth = 3; ctx.lineCap = "round";
  // Petals
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const px = cx + Math.cos(angle) * s;
    const py = cy + Math.sin(angle) * s;
    ctx.beginPath(); ctx.arc(px, py, s * 0.5, 0, Math.PI * 2); ctx.stroke();
  }
  // Center
  ctx.fillStyle = "#EAB308"; ctx.beginPath(); ctx.arc(cx, cy, s * 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Stem
  ctx.strokeStyle = "#22C55E"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx, cy + s * 0.5); ctx.lineTo(cx, cy + s * 2); ctx.stroke();
}

function drawStar(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2, cy = h / 2, s = Math.min(w, h) * 0.35;
  ctx.strokeStyle = "#1F2937"; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    const ox = cx + Math.cos(outerAngle) * s;
    const oy = cy + Math.sin(outerAngle) * s;
    const ix = cx + Math.cos(innerAngle) * s * 0.45;
    const iy = cy + Math.sin(innerAngle) * s * 0.45;
    if (i === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath(); ctx.stroke();
}

function drawButterfly(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2, cy = h / 2, s = Math.min(w, h) * 0.3;
  ctx.strokeStyle = "#1F2937"; ctx.lineWidth = 3;
  // Body
  ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.1, s * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
  // Wings
  ctx.beginPath(); ctx.ellipse(cx - s * 0.5, cy - s * 0.2, s * 0.5, s * 0.4, -0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx + s * 0.5, cy - s * 0.2, s * 0.5, s * 0.4, 0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx - s * 0.4, cy + s * 0.3, s * 0.35, s * 0.3, -0.5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx + s * 0.4, cy + s * 0.3, s * 0.35, s * 0.3, 0.5, 0, Math.PI * 2); ctx.stroke();
}

function drawRainbow(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2, cy = h * 0.7, r = Math.min(w, h) * 0.4;
  const colors = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#A855F7"];
  ctx.lineWidth = 6; ctx.lineCap = "round";
  colors.forEach((color, i) => {
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.arc(cx, cy, r - i * 8, Math.PI, 0); ctx.stroke();
  });
}

export default function DrawingGame() {
  const navigate = useNavigate();
  const { addStars, soundEnabled } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#EF4444");
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const startDraw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getPos(e);
  }, [getPos]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = tool === "erase" ? "#F8F4FF" : color;
      ctx.lineWidth = tool === "erase" ? brushSize * 3 : brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    lastPos.current = pos;
  }, [isDrawing, color, brushSize, tool, getPos]);

  const stopDraw = useCallback(() => { setIsDrawing(false); lastPos.current = null; }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#F8F4FF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (activeTemplate !== null) {
      TEMPLATES[activeTemplate].draw(ctx, canvas.width, canvas.height);
    }
  }, [activeTemplate]);

  const loadTemplate = useCallback((idx: number) => {
    setActiveTemplate(idx);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#F8F4FF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    TEMPLATES[idx].draw(ctx, canvas.width, canvas.height);
  }, []);

  // Init canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const size = Math.min(container.clientWidth - 16, 400);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#F8F4FF";
      ctx.fillRect(0, 0, size, size);
    }
  }, []);

  const handleSave = () => {
    if (soundEnabled) playTap();
    addStars("drawing", 1);
  };

  return (
    <GameLayout title="Art Studio" emoji="🎨" onBack={() => navigate("/map")}>
      <div className="flex-1 flex flex-col items-center px-3 pb-4 gap-3">
        {/* Templates */}
        <div className="flex gap-2 flex-wrap justify-center">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setActiveTemplate(null); clearCanvas(); }}
            className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-colors ${activeTemplate === null ? "bg-purple-100 border-purple-400 text-purple-600" : "bg-white border-purple-200 text-purple-400"}`}>
            ✏️ Free Draw
          </motion.button>
          {TEMPLATES.map((t, i) => (
            <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => loadTemplate(i)}
              className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-colors ${activeTemplate === i ? "bg-purple-100 border-purple-400 text-purple-600" : "bg-white border-purple-200 text-purple-400"}`}>
              {t.emoji} {t.name}
            </motion.button>
          ))}
        </div>

        {/* Canvas */}
        <div className="w-full flex justify-center">
          <canvas
            ref={canvasRef}
            className="rounded-2xl border-[3px] border-purple-200 shadow-lg touch-none cursor-crosshair bg-[#F8F4FF]"
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
          />
        </div>

        {/* Colors */}
        <div className="flex gap-1.5 flex-wrap justify-center max-w-sm">
          {COLORS.map((c) => (
            <motion.button key={c} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
              onClick={() => { setColor(c); setTool("draw"); }}
              className={`w-8 h-8 rounded-full border-[3px] shadow-sm transition-all ${color === c && tool === "draw" ? "border-purple-500 scale-110" : "border-white"}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {BRUSH_SIZES.map((s) => (
              <motion.button key={s} whileTap={{ scale: 0.9 }}
                onClick={() => setBrushSize(s)}
                className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors ${brushSize === s ? "bg-purple-100 border-purple-400" : "bg-white border-gray-200"}`}>
                <div className="rounded-full bg-gray-700" style={{ width: s, height: s }} />
              </motion.button>
            ))}
          </div>

          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setTool(tool === "draw" ? "erase" : "draw")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${tool === "erase" ? "bg-amber-100 border-amber-400 text-amber-600" : "bg-white border-gray-200 text-gray-500"}`}>
            {tool === "erase" ? "🧹 Erasing" : "🧹 Eraser"}
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} onClick={clearCanvas}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border-2 border-gray-200 text-gray-500">
            🗑️ Clear
          </motion.button>
        </div>

        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
          className="px-6 py-2 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-sm shadow-lg">
          ⭐ Save Drawing
        </motion.button>
      </div>
    </GameLayout>
  );
}
