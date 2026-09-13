export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section aria-labelledby="loading-title" className="max-w-md text-center">
        <h1 className="text-2xl font-bold" id="loading-title">
          Loading
        </h1>
        <p aria-live="polite" className="mt-2 text-neutral-600" role="status">
          Please wait while the application loads.
        </p>
      </section>
    </main>
  );
}
