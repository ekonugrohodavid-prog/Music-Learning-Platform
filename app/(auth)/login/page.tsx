import { login } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        action={login}
        className="w-full max-w-md space-y-4 rounded-lg border p-6"
      >
        <div>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-gray-600">
            Masuk ke Music Learning Platform
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 text-white"
        >
          Login
        </button>
      </form>
    </main>
  );
}
