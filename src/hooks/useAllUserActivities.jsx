import { useEffect, useState } from "react";
import { getAllUserActivities } from "../API/activitiesAPI";

function useAllUserActivities(activityIDsArray) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!activityIDsArray || activityIDsArray.length === 0) {
      setActivities([]);
      return;
    }

    const getAllActivities = async () => {
      try {
        const allUserActivities = await getAllUserActivities(activityIDsArray);

        setActivities(
          allUserActivities.sort(
            (a, b) =>
              new Date(JSON.parse(b.date)) - new Date(JSON.parse(a.date))
          )
        );
      } catch (error) {
        console.log(error);
        setActivities([]);
      }
    };
    getAllActivities();
  }, [activityIDsArray]);

  return { activities };
}

export default useAllUserActivities;
