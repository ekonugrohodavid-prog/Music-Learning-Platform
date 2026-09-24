import assert from "node:assert/strict";
import test from "node:test";

import type {
  ActivityAttempt,
  ActivityResponse,
  AttemptState,
} from "@/types";

import type { ActivitySubmissionDependencies } from "./contracts";
import { ActivitySubmissionService } from "./service.ts";
import { createWave1ActivityDefinitionRegistry } from "../wave1-registry.ts";

const activity = {
  id: "activity-1",
  competencyId: "competency-1",
  type: "pulse",
  title: "Tap the Pulse",
  difficulty: 1,
  configuration: {
  type: "pulse",
  tempoBpm: 60,
  beatCount: 4,
},
  status: "published",
  createdBy: "teacher-1",
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
} as const;

const response: ActivityResponse = {
  type: "pulse",
  tapsMs: [100, 1100],
};

function createAttempt(
  overrides: Partial<ActivityAttempt> = {},
): ActivityAttempt {
  return {
    id: "attempt-1",
    activityId: "activity-1",
    studentId: "student-1",
    startedAt: "2026-09-20T00:00:00.000Z",
    response: undefined,
    evaluation: undefined,
    score: undefined,
    completionState: "started",
    attemptNumber: 1,
    createdAt: "2026-09-20T00:00:00.000Z",
    updatedAt: "2026-09-20T00:00:00.000Z",
  ...overrides,
  };
}

function createDependencies(
  overrides: Partial<ActivitySubmissionDependencies> = {},
) {
  const savedAttempts: Array<{
  attemptId: string;
  input: {
    submittedAt: string;
    response: ActivityResponse;
    evaluation: NonNullable<ActivityAttempt["evaluation"]>;
    score: number;
    completionState: "submitted";
  };
}> = [];

const dependencies: ActivitySubmissionDependencies = {
  getActivity: async () => activity,
  getAttempt: async () => createAttempt(),

  activityDefinitionRegistry:
    overrides.activityDefinitionRegistry ??
    createWave1ActivityDefinitionRegistry(),
  submitStartedAttempt: async (
    attemptId,
    _studentId,
    _activityId,
    input,
  ) => {
    savedAttempts.push({
  attemptId,
  input: {
    ...input,
    completionState: "submitted",
  },
});

    return {
      attempt: createAttempt({
        submittedAt: input.submittedAt,
        response: input.response,
        evaluation: input.evaluation,
        score: input.evaluation.score,
        completionState: "submitted",
      }),
      didSubmit: true,
    };
  },
  ...overrides,
};

  return { dependencies, savedAttempts };
}

test("rejects when activity does not exist", async () => {
  const { dependencies } = createDependencies({
    getActivity: async () => null,
  });

  const service = new ActivitySubmissionService(dependencies);

  await assert.rejects(
    () =>
      service.submit({
        activityId: "activity-1",
        attemptId: "attempt-1",
        studentId: "student-1",
        response,
      }),
  );
});

test("rejects when attempt does not exist", async () => {
  const { dependencies } = createDependencies({
    getAttempt: async () => null,
  });

  const service = new ActivitySubmissionService(dependencies);

  await assert.rejects(
    () =>
      service.submit({
        activityId: "activity-1",
        attemptId: "attempt-1",
        studentId: "student-1",
        response,
      }),
  );
});

test("rejects when attempt belongs to another student", async () => {
  const { dependencies } = createDependencies({
    getAttempt: async () =>
      createAttempt({
        studentId: "another-student",
      }),
  });

  const service = new ActivitySubmissionService(dependencies);

  await assert.rejects(
    () =>
      service.submit({
        activityId: "activity-1",
        attemptId: "attempt-1",
        studentId: "student-1",
        response,
      }),
  );
});

test("rejects when attempt belongs to another activity", async () => {
  const { dependencies } = createDependencies({
    getAttempt: async () =>
      createAttempt({
        activityId: "activity-2",
      }),
  });

  const service = new ActivitySubmissionService(dependencies);

  await assert.rejects(
    () =>
      service.submit({
        activityId: "activity-1",
        attemptId: "attempt-1",
        studentId: "student-1",
        response,
      }),
  );
});

test("returns an already submitted attempt without saving again", async () => {
  let saveAttemptCalls = 0;

  const attempt: ActivityAttempt = {
    id: "attempt-1",
    activityId: "activity-1",
    studentId: "student-1",
    startedAt: "2026-01-01T00:00:00.000Z",
    submittedAt: "2026-01-01T00:01:00.000Z",
    response: {
      type: "pulse",
      tapsMs: [100],
    },
    completionState: "submitted",
    attemptNumber: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:01:00.000Z",
  };

  const service = new ActivitySubmissionService({
    getActivity: async () => activity,
    activityDefinitionRegistry: createWave1ActivityDefinitionRegistry(),
    getAttempt: async () => attempt,
    submitStartedAttempt: async () => {
  saveAttemptCalls += 1;

  return {
    attempt,
    didSubmit: false,
  };
},
  });

  test("returns an evaluated attempt without saving again", async () => {
  let saveAttemptCalls = 0;

  const attempt = createAttempt({
    completionState: "evaluated",
  });

  const service = new ActivitySubmissionService({
    getActivity: async () => activity,
    activityDefinitionRegistry: createWave1ActivityDefinitionRegistry(),
    getAttempt: async () => attempt,
    submitStartedAttempt: async () => {
  saveAttemptCalls += 1;

  return {
    attempt,
    didSubmit: false,
  };
},
  });

  const result = await service.submit({
    activityId: "activity-1",
    attemptId: "attempt-1",
    studentId: "student-1",
    response,
  });

  assert.equal(result.state, "evaluated");
  assert.equal(result.attempt.id, "attempt-1");
  assert.equal(saveAttemptCalls, 0);
});

test("returns a completed attempt without saving again", async () => {
  let saveAttemptCalls = 0;

  const attempt = createAttempt({
    completionState: "completed",
  });

  const service = new ActivitySubmissionService({
    getActivity: async () => activity,
    activityDefinitionRegistry: createWave1ActivityDefinitionRegistry(),
    getAttempt: async () => attempt,
    submitStartedAttempt: async () => {
  saveAttemptCalls += 1;

  return {
    attempt,
    didSubmit: false,
  };
},
  });

  const result = await service.submit({
    activityId: "activity-1",
    attemptId: "attempt-1",
    studentId: "student-1",
    response,
  });

  assert.equal(result.state, "completed");
  assert.equal(result.attempt.id, "attempt-1");
  assert.equal(saveAttemptCalls, 0);
});

  const result = await service.submit({
    activityId: "activity-1",
    attemptId: "attempt-1",
    studentId: "student-1",
    response: attempt.response!,
  });

  assert.equal(result.state, "submitted");
  assert.equal(result.attempt.id, "attempt-1");
  assert.equal(saveAttemptCalls, 0);
});

test("submits a started attempt", async () => {
  const { dependencies, savedAttempts } = createDependencies();

  const service = new ActivitySubmissionService(dependencies);

  const result = await service.submit({
    activityId: "activity-1",
    attemptId: "attempt-1",
    studentId: "student-1",
    response,
  });

  assert.equal(result.state, "submitted");
  assert.equal(result.attempt.completionState, "submitted");
  assert.equal(savedAttempts.length, 1);
});

test("creates submittedAt on the service side", async () => {
  const { dependencies, savedAttempts } = createDependencies();

  const service = new ActivitySubmissionService(dependencies);

  await service.submit({
    activityId: "activity-1",
    attemptId: "attempt-1",
    studentId: "student-1",
    response,
  });

  assert.equal(savedAttempts.length, 1);
  assert.match(
    savedAttempts[0].input.submittedAt,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
  );
});

test("passes the student response to the repository", async () => {
  const { dependencies, savedAttempts } = createDependencies();

  const service = new ActivitySubmissionService(dependencies);

  await service.submit({
    activityId: "activity-1",
    attemptId: "attempt-1",
    studentId: "student-1",
    response,
  });

  assert.deepEqual(savedAttempts[0].input.response, response);
});











test("evaluates and persists the activity result", async () => {
  const { dependencies, savedAttempts } = createDependencies();

  const service = new ActivitySubmissionService(dependencies);

  const result = await service.submit({
    activityId: "activity-1",
    attemptId: "attempt-1",
    studentId: "student-1",
    response,
  });

  assert.equal(savedAttempts.length, 1);
  assert.deepEqual(savedAttempts[0].input.evaluation, result.attempt.evaluation);
  assert.equal(savedAttempts[0].input.score, result.attempt.score?.percentage);
  assert.ok(result.attempt.evaluation);
  assert.ok(result.attempt.score);
});
