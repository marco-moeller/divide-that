import { NavLink } from "react-router-dom";
import useGroup from "../../hooks/useGroup";
import GroupMemberImg from "./GroupMemberImg";
import { nanoid } from "nanoid";
import { memo } from "react";

function GroupListComponent({ groupID }) {
  const { group } = useGroup(groupID);

  if (!group) return;

  return (
    <NavLink to={`/group/${groupID}`} className="group-list-component">
      <div className="img-stack">
        {group.users.map((userID, index) => {
          if (index >= 5) {
            return;
          }
          return (
            <GroupMemberImg userID={userID} index={index} key={nanoid()} />
          );
        })}
      </div>
      <p className="group-name">{group.name}</p>
    </NavLink>
  );
}

export default memo(GroupListComponent);
