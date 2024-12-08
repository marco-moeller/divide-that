import { NavLink } from "react-router-dom";
import useFriend from "../../hooks/useFriend";
import { useAuth } from "../../context/AuthContext";
import {
  getCurrencyIconFromSymbol,
  getOwedAmountColor
} from "../../utility/money";
import useTotalDebtInDefaultCurrency from "../../hooks/useTotalDebtInDefaultCurrency";
import FriendProfilePicture from "./FriendProfilePicture";

function FriendListComponent({ friendId }) {
  const { friend, profileImgUrl } = useFriend(friendId);
  const { user } = useAuth();

  const totalDebtInDefaultCurrency = useTotalDebtInDefaultCurrency(friendId);

  const getOweOrOwes = (amount) => {
    return amount >= 0 ? `Owes you` : `You owe`;
  };

  if (!friend) return <></>;

  return (
    <NavLink to={`/friend/${friendId}`} className="friend">
      {profileImgUrl && (
        <FriendProfilePicture
          profileImgUrl={profileImgUrl}
          friendID={friend.id}
        />
      )}
      <p>{friend.userName}</p>
      <div className={` ${getOwedAmountColor(totalDebtInDefaultCurrency)}`}>
        <span>{getOweOrOwes(totalDebtInDefaultCurrency)} </span>
        <span className="lent-amount">
          {getCurrencyIconFromSymbol(user.defaultCurrency)}
          {Math.abs(totalDebtInDefaultCurrency)}
        </span>
      </div>
    </NavLink>
  );
}

export default FriendListComponent;
