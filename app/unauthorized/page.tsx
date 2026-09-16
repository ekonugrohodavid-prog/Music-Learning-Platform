export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 text-center">
        <h1 className="text-2xl font-bold">
          Akses Ditolak
        </h1>

        <p className="text-sm text-gray-600">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>

        <a
          href="/login"
          className="inline-block rounded bg-black px-4 py-2 text-white"
        >
          Kembali ke Login
        </a>
      </div>
    </main>
  );
}
