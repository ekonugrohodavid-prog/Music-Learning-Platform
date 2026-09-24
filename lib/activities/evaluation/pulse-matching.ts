export interface PulseTapMatch {
  readonly expectedMs: number;
  readonly actualMs: number;
  readonly deviationMs: number;
}

export interface PulseTapMatchResult {
  readonly matches: readonly PulseTapMatch[];
  readonly unmatchedExpectedMs: readonly number[];
  readonly unmatchedActualMs: readonly number[];
}

export function matchPulseTaps(
  expectedMs: readonly number[],
  actualMs: readonly number[],
): PulseTapMatchResult {
  const availableActual = actualMs.map((time, index) => ({
    index,
    time,
  }));

  const matches: PulseTapMatch[] = [];
  const unmatchedExpectedMs: number[] = [];

  for (const expected of expectedMs) {
    if (availableActual.length === 0) {
      unmatchedExpectedMs.push(expected);
      continue;
    }

    let bestIndex = 0;
    let bestDeviation = Math.abs(availableActual[0]!.time - expected);

    for (let index = 1; index < availableActual.length; index += 1) {
      const candidate = availableActual[index]!;
      const deviation = Math.abs(candidate.time - expected);

      if (deviation < bestDeviation) {
        bestIndex = index;
        bestDeviation = deviation;
      }
    }

    const [matched] = availableActual.splice(bestIndex, 1);

    matches.push({
      expectedMs: expected,
      actualMs: matched!.time,
      deviationMs: bestDeviation,
    });
  }

  return {
    matches,
    unmatchedExpectedMs,
    unmatchedActualMs: availableActual.map((item) => item.time),
  };
}
