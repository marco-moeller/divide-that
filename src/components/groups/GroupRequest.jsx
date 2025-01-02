import { addUserToGroup } from "../../API/groupsAPI";
import { removeGroupRequestFromUser } from "../../API/userAPI";
import { useAuth } from "../../context/AuthContext";
import useGroup from "../../hooks/useGroup";

function GroupRequest({ request }) {
  const { group } = useGroup(request);
  const { user } = useAuth();

  const handleAcceptClick = async () => {
    await addUserToGroup(user, group);
  };

  const handleRejectClick = async () => {
    await removeGroupRequestFromUser(user, group.id);
  };

  if (!group || !user) {
    return <></>;
  }

  return (
    <div className="group-request">
      {" "}
      <div className="group-request-info">
        <p>
          You have been invited to <span className="red">{group.name}</span>{" "}
        </p>
      </div>
      <div className="btns">
        <button className="accept-req-btn btn" onClick={handleAcceptClick}>
          accept
        </button>
        <button className="accept-req-btn btn" onClick={handleRejectClick}>
          reject
        </button>{" "}
      </div>
    </div>
  );
}

export default GroupRequest;
