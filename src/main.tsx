import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { GameProvider } from "@/contexts/GameContext";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation, useParams } from "react-router";
import "./index.css";

function GamePlaceholderRoute() {
  const { gameId } = useParams();
  const Placeholder = lazy(() => import("@/components/GamePlaceholder"));
  const GAME_INFO: Record<string, { emoji: string; title: string; description: string }> = {
    car: { emoji: "🏎️", title: "Car Racing", description: "Fast and fun car racing is being built! Zoom zoom!" },
    bike: { emoji: "🏍️", title: "Bike Adventure", description: "An exciting bike adventure is on the way! Vroom vroom!" },
    makeover: { emoji: "💄", title: "Beauty Salon", description: "A magical makeover salon is being created! Sparkle sparkle!" },
  };
  const info = GAME_INFO[gameId ?? ""] ?? { emoji: "🎮", title: "Coming Soon", description: "This game is being built!" };
  return <Placeholder {...info} />;
}

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdventureMap = lazy(() => import("./pages/AdventureMap.tsx"));
const AnimalGame = lazy(() => import("./pages/games/AnimalGame.tsx"));
const MemoryGame = lazy(() => import("./pages/games/MemoryGame.tsx"));
const ABCGame = lazy(() => import("./pages/games/ABCGame.tsx"));
const MathGame = lazy(() => import("./pages/games/MathGame.tsx"));
const ShapeGame = lazy(() => import("./pages/games/ShapeGame.tsx"));
const DrawingGame = lazy(() => import("./pages/games/DrawingGame.tsx"));
const CookingGame = lazy(() => import("./pages/games/CookingGame.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <GameProvider>
          <BrowserRouter>
            <RouteSyncer />
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                  path="/auth"
                  element={<AuthPage redirectAfterAuth="/dashboard" />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
                <Route path="/map" element={<AdventureMap />} />
                <Route path="/game/animals" element={<AnimalGame />} />
                <Route path="/game/memory" element={<MemoryGame />} />
                <Route path="/game/abc" element={<ABCGame />} />
                <Route path="/game/math" element={<MathGame />} />
                <Route path="/game/shapes" element={<ShapeGame />} />
                <Route path="/game/drawing" element={<DrawingGame />} />
                <Route path="/game/cooking" element={<CookingGame />} />
                <Route path="/game/:gameId" element={<GamePlaceholderRoute />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </GameProvider>
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
