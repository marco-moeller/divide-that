import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { convertToMonthDayTime } from "../../utility/date";
import { formatActivity } from "../../utility/interfaces";

function ActivityComponent({ activity }) {
  const { user } = useAuth();

  if (!user) {
    return <></>;
  }

  const getActivityLink = () => {
    if (activity?.expenseID) return `../expense/${activity?.expenseID}`;
    if (activity?.groupID) return `../group/${activity?.groupID}`;
    else return "";
  };

  return (
    <NavLink to={getActivityLink()}>
      <div className="activity">
        <h3>{formatActivity(activity, user.id)}</h3>
        <h3 className="date">
          {convertToMonthDayTime(new Date(JSON.parse(activity.date)))}
        </h3>
      </div>
    </NavLink>
  );
}

export default ActivityComponent;
