import { nanoid } from "nanoid";
import ActivityComponent from "../components/activities/ActivityComponent";
import { useAuth } from "../context/AuthContext";

function Activity() {
  const { user } = useAuth();
  return (
    <main className="activities">
      <h2 className="title">Activity</h2>
      <div className="activities-list">
        {user?.activities
          .sort((a, b) => b.date - a.date)
          .map((activity) => (
            <ActivityComponent activity={activity} key={nanoid()} />
          ))}
      </div>
    </main>
  );
}

export default Activity;
