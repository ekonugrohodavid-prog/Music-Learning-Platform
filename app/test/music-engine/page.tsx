"use client";

import { useRef, useState } from "react";
import {
  createMetronome,
  type Metronome,
} from "@/lib/music/metronome";

export default function MusicEngineTestPage() {
  const metronomeRef = useRef<Metronome | null>(null);

  const [status, setStatus] =
    useState<"stopped" | "running">("stopped");
  const [tickCount, setTickCount] = useState(0);
  const [bpm, setBpm] = useState(120);

  function startMetronome() {
    const metronome = createMetronome(120, 4);

    metronomeRef.current = metronome;

    const ticks = metronome.start();

    setTickCount(ticks.length);
    setBpm(metronome.getBpm());

    if (metronome.isRunning()) {
      setStatus("running");
    }
  }

  function stopMetronome() {
    const metronome = metronomeRef.current;

    if (!metronome) {
      return;
    }

    metronome.stop();

    if (!metronome.isRunning()) {
      setStatus("stopped");
    }
  }

  return (
    <main>
      <h1>Music Engine Test</h1>

      <p data-testid="engine-status">
        {status}
      </p>

      <p data-testid="tick-count">
        {tickCount}
      </p>

      <p data-testid="engine-bpm">
        {bpm}
      </p>

      <button
        type="button"
        onClick={startMetronome}
      >
        Start
      </button>

      <button
        type="button"
        onClick={stopMetronome}
      >
        Stop
      </button>
    </main>
  );
}
