import { addUserToGroup } from "../../API/groupsAPI";
import { removeGroupRequestFromUser } from "../../API/userAPI";
import { useAuth } from "../../context/AuthContext";
import useGroup from "../../hooks/useGroup";
import ErrorComponent from "../error/ErrorComponent";
import useError from "../error/useError";

function GroupRequest({ request }) {
  const { group } = useGroup(request);
  const { user } = useAuth();
  const { error, setError } = useError();

  const handleAcceptClick = async () => {
    try {
      await addUserToGroup(user, group);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRejectClick = async () => {
    try {
      await removeGroupRequestFromUser(user, group.id);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
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
      <ErrorComponent>{error}</ErrorComponent>
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
