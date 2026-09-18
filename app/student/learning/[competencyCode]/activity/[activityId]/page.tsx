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
      <h1>{activity.title}</h1>
      <p>{activity.instructions ?? "No instructions available."}</p>
    </main>
  );
}
