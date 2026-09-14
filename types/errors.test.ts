import test from "node:test";
import assert from "node:assert/strict";

import {
  ApplicationError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  PersistenceError,
  MusicEngineError,
} from "./errors.ts";

test("ApplicationError contains code and message", () => {
  const error = new ApplicationError(
    "VALIDATION_ERROR",
    "Invalid activity",
  );

  assert.equal(error.code, "VALIDATION_ERROR");
  assert.equal(error.message, "Invalid activity");
  assert.equal(error.name, "ApplicationError");
});

test("typed errors expose the correct error code", () => {
  assert.equal(new AuthenticationError().code, "AUTHENTICATION_ERROR");
  assert.equal(new AuthorizationError().code, "AUTHORIZATION_ERROR");
  assert.equal(new ValidationError().code, "VALIDATION_ERROR");
  assert.equal(new NotFoundError().code, "NOT_FOUND");
  assert.equal(new ConflictError().code, "CONFLICT");
  assert.equal(new PersistenceError().code, "PERSISTENCE_ERROR");
  assert.equal(new MusicEngineError().code, "MUSIC_ENGINE_ERROR");
});

test("typed errors preserve their class identity", () => {
  const error = new ValidationError("Invalid data");

  assert.equal(error instanceof ValidationError, true);
  assert.equal(error instanceof ApplicationError, true);
  assert.equal(error instanceof Error, true);
});

test("ApplicationError preserves cause and details", () => {
  const cause = new Error("Database failure");

  const error = new PersistenceError("Unable to save data", {
    cause,
    details: {
      operation: "insert",
    },
  });

  assert.equal(error.cause, cause);
  assert.deepEqual(error.details, {
    operation: "insert",
  });
});
