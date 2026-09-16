import { forgotPassword } from "./actions";

interface ForgotPasswordPageProps {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
}

function getErrorMessage(error?: string): string | null {
  switch (error) {
    case "invalid_input":
      return "Email tidak valid.";

    case "request_failed":
      return "Permintaan recovery gagal. Silakan coba lagi.";

    default:
      return null;
  }
}

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-6">
        <div>
          <h1 className="text-2xl font-bold">
            Lupa Password
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Masukkan email akun Anda untuk menerima link
            recovery password.
          </p>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        ) : null}

        {params.success === "recovery_sent" ? (
          <div
            role="status"
            className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            Jika email terdaftar, link recovery telah dikirim.
            Periksa inbox email Anda.
          </div>
        ) : null}

        <form action={forgotPassword} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded border p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-black px-4 py-2 text-white"
          >
            Kirim Link Recovery
          </button>
        </form>

        <a
          href="/login"
          className="block text-center text-sm text-gray-600 underline"
        >
          Kembali ke Login
        </a>
      </div>
    </main>
  );
}
