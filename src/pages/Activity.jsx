import ActivityComponent from "../components/activities/ActivityComponent";
import { useAuth } from "../context/AuthContext";
import useAllUserActivities from "../hooks/useAllUserActivities";

function Activity() {
  const { user } = useAuth();
  const { activities } = useAllUserActivities(user?.activities);

  if (!user || activities === undefined) {
    return;
  }

  return (
    <main className="activities">
      <h2 className="title">Your Activities</h2>
      <div className="activities-list">
        {activities
          .sort((a, b) => b.date - a.date)
          .map((activity) => (
            <ActivityComponent activity={activity} key={activity.id} />
          ))}
      </div>
    </main>
  );
}

export default Activity;
