import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section aria-labelledby="not-found-title" className="max-w-md text-center">
        <h1 className="text-2xl font-bold" id="not-found-title">
          Page not found
        </h1>
        <p className="mt-2 text-neutral-600">
          The page you&apos;re looking for isn&apos;t available.
        </p>
        <Link
          className="mt-6 inline-block rounded bg-neutral-900 px-4 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          href="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
