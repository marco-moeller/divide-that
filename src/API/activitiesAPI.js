import {
  addActivityToDatabase,
  getActivityFromDatabase
} from "../database/activities";
import { addUserToDatabase, getUserFromDatabase } from "../database/user";

export const addNewActivityToDatabase = async (activity) => {
  try {
    await addActivityToDatabase(activity);
    await Promise.all(
      activity.users.map(async (userID) => {
        const user = await getUserFromDatabase(userID);
        await addUserToDatabase({
          ...user,
          activities: [...user.activities, activity.id]
        });
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const getAllUserActivities = async (activities) => {
  try {
    const activitiesList = await Promise.all(
      activities.map(async (activityID) => {
        const activity = await getActivityFromDatabase(activityID);
        return activity;
      })
    );
    return activitiesList;
  } catch (error) {
    console.log(error);
  }
};
