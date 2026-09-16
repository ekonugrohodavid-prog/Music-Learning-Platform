import type { Competency } from "@/types";
import { CompetencyService } from "@/lib/competency/service";

export default async function StudentLearningPage() {
  const service = new CompetencyService();
  const competencies = await service.getCompetencies();

  return (
    <main>
      <header>
        <h1>Music Learning</h1>
        <p>Semester 1 — Rhythm</p>
        <p>
          Pelajari rhythm secara bertahap dari mengenali pulse hingga
          menciptakan rhythmic composition.
        </p>
      </header>

      <section aria-labelledby="competency-heading">
        <h2 id="competency-heading">Learning Progression</h2>

        <div>
          {competencies.map((competency: Competency) => (
            <article key={competency.id}>
              <p>{competency.code}</p>
              <h3>{competency.title}</h3>

              {competency.description && (
                <p>{competency.description}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
