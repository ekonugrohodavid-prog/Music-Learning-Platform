import { getActivity } from "@/app/actions/activities/get-activity";

interface ActivityDetailPageProps {
  params: Promise<{
    competencyCode: string;
    activityId: string;
  }>;
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { activityId } = await params;

  const activity = await getActivity(activityId);

  if (!activity) {
    return (
      <main>
        <h1>Activity Not Found</h1>
      </main>
    );
  }

  return (
    <main>
      <header>
        <p>{activity.type}</p>
        <h1>{activity.title}</h1>
        <p>Difficulty: {activity.difficulty}</p>
      </header>

      <section>
        <h2>Instructions</h2>
        <p>{activity.instructions ?? "No instructions available."}</p>
      </section>

      <section>
        <h2>Configuration</h2>
        <pre>
          {JSON.stringify(activity.configuration, null, 2)}
        </pre>
      </section>

      <section>
        <h2>Start</h2>
        <button type="button" disabled>
          Start Activity
        </button>
      </section>
    </main>
  );
}
