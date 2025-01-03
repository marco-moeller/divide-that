import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { convertToMonthDayTime } from "../../utility/date";
import { formatActivity } from "../../utility/interfaces";

function ActivityComponent({ activity }) {
  const { user } = useAuth();

  if (!user) {
    return <></>;
  }

  return (
    <NavLink to={`../expense/${activity?.expense}`}>
      <div className="activity">
        <h3>{formatActivity(activity, user.userName)}</h3>
        <h3 className="date">
          {convertToMonthDayTime(new Date(JSON.parse(activity.date)))}
        </h3>
      </div>
    </NavLink>
  );
}

export default ActivityComponent;
