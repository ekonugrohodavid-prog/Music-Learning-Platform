export type ApplicationErrorCode =
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PERSISTENCE_ERROR"
  | "MUSIC_ENGINE_ERROR";

export interface ApplicationErrorOptions {
  cause?: unknown;
  details?: Record<string, unknown>;
}

export class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(
    code: ApplicationErrorCode,
    message: string,
    options?: ApplicationErrorOptions,
  ) {
    super(message, { cause: options?.cause });
    this.name = "ApplicationError";
    this.code = code;
    this.details = options?.details;
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(
    message = "Authentication required",
    options?: ApplicationErrorOptions,
  ) {
    super("AUTHENTICATION_ERROR", message, options);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(
    message = "You are not authorized to perform this action",
    options?: ApplicationErrorOptions,
  ) {
    super("AUTHORIZATION_ERROR", message, options);
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends ApplicationError {
  constructor(
    message = "Validation failed",
    options?: ApplicationErrorOptions,
  ) {
    super("VALIDATION_ERROR", message, options);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ApplicationError {
  constructor(
    message = "Resource not found",
    options?: ApplicationErrorOptions,
  ) {
    super("NOT_FOUND", message, options);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApplicationError {
  constructor(
    message = "Resource conflict",
    options?: ApplicationErrorOptions,
  ) {
    super("CONFLICT", message, options);
    this.name = "ConflictError";
  }
}

export class PersistenceError extends ApplicationError {
  constructor(
    message = "Persistence operation failed",
    options?: ApplicationErrorOptions,
  ) {
    super("PERSISTENCE_ERROR", message, options);
    this.name = "PersistenceError";
  }
}

export class MusicEngineError extends ApplicationError {
  constructor(
    message = "Music engine operation failed",
    options?: ApplicationErrorOptions,
  ) {
    super("MUSIC_ENGINE_ERROR", message, options);
    this.name = "MusicEngineError";
  }
}
