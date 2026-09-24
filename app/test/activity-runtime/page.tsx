"use client";

import { useMemo, useState } from "react";
import type {
  Activity,
  PulseActivityResponse,
} from "@/types";
import {
  createWave1ActivityDefinitionRegistry,
} from "@/lib/activities/wave1-registry";
import { DefaultActivityRuntime } from "@/lib/activities/runtime/service";
import { createPulseRuntime } from "@/lib/activities/runtime/pulse";

const activity: Activity = {
  id: "activity-test-r1",
  competencyId: "competency-r1",
  type: "pulse",
  title: "Tap the Pulse",
  instructions: "Tap the pulse.",
  difficulty: 1,
  configuration: {
    type: "pulse",
    tempoBpm: 60,
    beatCount: 4,
  },
  status: "published",
  createdBy: "teacher-test",
  createdAt: "2026-09-18T00:00:00.000Z",
  updatedAt: "2026-09-18T00:00:00.000Z",
};

export default function ActivityRuntimeTestPage() {
  const registry = useMemo(
    () => createWave1ActivityDefinitionRegistry(),
    [],
  );

  const runtime = useMemo(
    () =>
      new DefaultActivityRuntime(
        activity,
        registry,
        0,
      ),
    [registry],
  );

  const pulseRuntime = useMemo(
    () =>
      createPulseRuntime(
        activity,
        () => 0,
      ),
    [],
  );

  const [status, setStatus] = useState<
    "ready" | "running" | "captured"
  >("ready");

  const [tapCount, setTapCount] = useState(0);

  const [response, setResponse] =
    useState<PulseActivityResponse | null>(null);

  function handleStart() {
    runtime.start();
    pulseRuntime.start();

    setStatus("running");
    setTapCount(0);
    setResponse(null);
  }

  function handleTap() {
    if (status !== "running") {
      return;
    }

    pulseRuntime.tap();
    setTapCount(pulseRuntime.getTaps().length);
  }

  function handleStop() {
    if (status !== "running") {
      return;
    }

    const tapsMs = pulseRuntime.stop();

    const nextResponse: PulseActivityResponse = {
      type: "pulse",
      tapsMs,
    };

    runtime.captureResponse(nextResponse);

    setStatus("captured");
    setTapCount(tapsMs.length);
    setResponse(nextResponse);
  }

  return (
    <main>
      <h1>Activity Runtime Test</h1>

      <p data-testid="activity-status">
        {status}
      </p>

      <p data-testid="tap-count">
        {tapCount}
      </p>

      <p data-testid="response-status">
        {response ? "ready" : "empty"}
      </p>

      <button
        type="button"
        onClick={handleStart}
        disabled={status === "running"}
      >
        Start Activity
      </button>

      <button
        type="button"
        onClick={handleTap}
        disabled={status !== "running"}
      >
        Tap the Pulse
      </button>

      <button
        type="button"
        onClick={handleStop}
        disabled={status !== "running"}
      >
        Stop Activity
      </button>
    </main>
  );
}
