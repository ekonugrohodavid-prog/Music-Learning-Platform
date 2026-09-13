const teacherNavigationItems = [
  { href: "/teacher", label: "Teacher" },
  { href: "/teacher/classes", label: "Classes" },
  { href: "/teacher/content", label: "Content" },
  { href: "/teacher/activities", label: "Activities" },
  { href: "/teacher/generator", label: "Generator" },
  { href: "/teacher/assessments", label: "Assessments" },
  { href: "/teacher/analytics", label: "Analytics" },
] as const;

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <aside className="border-b border-neutral-200 md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-r md:border-b-0">
        <nav
          aria-label="Teacher navigation"
          className="flex gap-1 overflow-x-auto p-2 md:flex-col md:p-4"
        >
          {teacherNavigationItems.map(({ href, label }) => (
            <a
              className="shrink-0 rounded px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen md:pl-64">{children}</main>
    </div>
  );
}
