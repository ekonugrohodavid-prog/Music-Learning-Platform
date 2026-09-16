import { updatePassword } from "./actions";
import { RecoverySession } from "./recovery-session";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

function getErrorMessage(error?: string): string | null {
  switch (error) {
    case "invalid_input":
      return "Input password tidak valid.";

    case "password_too_short":
      return "Password minimal 8 karakter.";

    case "password_mismatch":
      return "Password dan konfirmasi password tidak sama.";

    case "update_failed":
      return "Password gagal diperbarui.";

    case "recovery_session_expired":
      return "Recovery session sudah tidak valid. Silakan minta link recovery baru.";

    default:
      return null;
  }
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Masukkan password baru untuk akun Anda.
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

        <RecoverySession>
          <form action={updatePassword} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium"
              >
                Password baru
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Konfirmasi password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-black px-4 py-2 text-white"
            >
              Simpan Password
            </button>
          </form>
        </RecoverySession>
      </div>
    </main>
  );
}
