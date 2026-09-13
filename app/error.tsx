"use client";

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ reset }: ErrorBoundaryProps) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section aria-labelledby="error-title" className="max-w-md text-center">
        <h1 className="text-2xl font-bold" id="error-title">
          Something went wrong
        </h1>
        <p className="mt-2 text-neutral-600">
          We couldn&apos;t load this part of the application. Please try again.
        </p>
        <button
          className="mt-6 rounded bg-neutral-900 px-4 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          onClick={() => reset()}
          type="button"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
