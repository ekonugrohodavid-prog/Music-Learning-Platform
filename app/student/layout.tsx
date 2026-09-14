export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <aside className="hidden min-h-screen w-64 border-r border-neutral-200 md:fixed md:inset-y-0 md:left-0 md:block">
        <nav aria-label="Student navigation" className="p-4">
          <a className="block rounded px-3 py-2" href="/student">
            Student
          </a>
        </nav>
      </aside>

      <main className="min-h-screen pb-16 md:pl-64 md:pb-0">{children}</main>

      <nav
        aria-label="Student mobile navigation"
        className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white p-2 md:hidden"
      >
        <a className="block rounded px-3 py-2 text-center" href="/student">
          Student
        </a>
      </nav>
    </div>
  );
}
