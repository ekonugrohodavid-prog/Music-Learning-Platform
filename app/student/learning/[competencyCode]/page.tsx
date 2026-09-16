import { notFound } from "next/navigation";

import { createCompetencyDetailService } from "@/lib/learning/container";
import { createLearningContentReaderService } from "@/lib/learning/content/container";

interface StudentCompetencyPageProps {
  params: Promise<{
    competencyCode: string;
  }>;
}

export default async function StudentCompetencyPage({
  params,
}: StudentCompetencyPageProps) {
  const { competencyCode } = await params;

  const contentReaderService = createLearningContentReaderService();

  const service = await createCompetencyDetailService();
  const detail = await service.getByCode(competencyCode);

  if (!detail) {
    notFound();
  }

  const { competency, learningContents, activities, mastery } = detail;

  const readableContents = await Promise.all(
  learningContents.map((content) =>
    contentReaderService.getById(content.id),
  ),
);

  return (
    <main>
      <header>
        <p>{competency.code}</p>
        <h1>{competency.title}</h1>

        {competency.description && <p>{competency.description}</p>}
      </header>

      <section aria-labelledby="content-heading">
        <h2 id="content-heading">Learning Content</h2>

        {learningContents.length === 0 ? (
          <p>No learning content available.</p>
        ) : (
          <ol>
  {readableContents
    .filter(
      (content): content is NonNullable<typeof content> =>
        content !== null,
    )
    .map((content) => (
<li key={content.id}>
<h3>{content.title}</h3>
<p>Type: {content.contentType}</p>

{content.body && (
  <div>
    <h4>Content</h4>
    <p>{content.body}</p>
  </div>
)}
</li>
    ))}
</ol>
        )}
      </section>

      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading">Activities</h2>

        {activities.length === 0 ? (
          <p>No activities available.</p>
        ) : (
          <ol>
            {activities.map((activity) => (
              <li key={activity.id}>
                <h3>{activity.title}</h3>
                <p>{activity.type}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="mastery-heading">
        <h2 id="mastery-heading">Mastery</h2>

        {mastery ? (
          <dl>
            <div>
              <dt>Score</dt>
              <dd>{mastery.masteryScore}</dd>
            </div>
            <div>
              <dt>Level</dt>
              <dd>{mastery.masteryLevel}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{mastery.evidenceCount}</dd>
            </div>
          </dl>
        ) : (
          <p>No mastery record yet.</p>
        )}
      </section>
    </main>
  );
}
