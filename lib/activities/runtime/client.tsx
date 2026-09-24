"use client";

import { useMemo, useState } from "react";
import type {
  Activity,
  PulseActivityResponse,
} from "@/types";
import {
  createWave1ActivityDefinitionRegistry,
} from "../wave1-registry";
import { DefaultActivityRuntime } from "./service";
import { createPulseRuntime } from "./pulse";

interface ActivityRuntimeClientProps {
  readonly activity: Activity;
  readonly onResponseReady?: (
    response: PulseActivityResponse,
  ) => void;
}

export function ActivityRuntimeClient({
  activity,
  onResponseReady,
}: ActivityRuntimeClientProps) {
  const registry = useMemo(
    () => createWave1ActivityDefinitionRegistry(),
    [],
  );

  const runtime = useMemo(
    () =>
      new DefaultActivityRuntime(
        activity,
        registry,
      ),
    [activity, registry],
  );

  const pulseRuntime = useMemo(
    () => createPulseRuntime(activity),
    [activity],
  );

  const [status, setStatus] = useState<
    "ready" | "running" | "captured"
  >("ready");

  const [tapCount, setTapCount] = useState(0);

  function handleStart() {
    runtime.start();
    pulseRuntime.start();

    setStatus("running");
    setTapCount(0);
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

    const response: PulseActivityResponse = {
      type: "pulse",
      tapsMs: pulseRuntime.stop(),
    };

    runtime.captureResponse(response);

    setStatus("captured");
    setTapCount(pulseRuntime.getTaps().length);

    const submissionResponse =
      runtime.getSubmissionResponse();

    if (
      submissionResponse &&
      submissionResponse.type === "pulse"
    ) {
      onResponseReady?.(submissionResponse);
    }
  }

  return (
    <section aria-label="Activity runtime">
      <p>Status: {status}</p>
      <p>Taps captured: {tapCount}</p>

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
        Prepare Response
      </button>
    </section>
  );
}
