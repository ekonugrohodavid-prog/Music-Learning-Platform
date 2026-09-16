import { requireStudent } from "@/lib/auth/authorization";

export default async function StudentPage() {
  const auth = await requireStudent();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">
        Student Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Selamat datang di Music Learning Platform.
      </p>

      <p className="mt-4 text-sm text-gray-500">
        User ID: {auth.userId}
      </p>
    </main>
  );
}
