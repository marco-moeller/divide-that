import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { convertToMonthDayTime } from "../../utility/date";
import { formatActivity } from "../../utility/interfaces";
import useExpense from "../../hooks/useExpense";
import useGroup from "../../hooks/useGroup";

function ActivityComponent({ activity }) {
  const { user } = useAuth();
  const { expense } = useExpense(activity?.expenseID);
  const { group } = useGroup(activity.groupID);

  if (!user) {
    return <></>;
  }

  const getActivityLink = () => {
    if (activity?.expenseID && expense)
      return `../expense/${activity?.expenseID}`;
    if (activity?.groupID && group) return `../group/${activity?.groupID}`;
    else return "";
  };

  return (
    <NavLink
      to={getActivityLink()}
      className={getActivityLink() === "" ? "no-pointer" : ""}
    >
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
