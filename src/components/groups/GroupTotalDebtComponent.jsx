import { useAuth } from "../../context/AuthContext";
import useGroup from "../../hooks/useGroup";
import useTotalGroupDebtFromAllMembersInDefaultCurrency from "../../hooks/useTotalGroupDebtFromAllMembersInDefaultCurrency";
import {
  getCurrencyIconFromSymbol,
  getOwedAmountColor
} from "../../utility/money";

function GroupTotalDebtComponent({ groupID }) {
  const { group } = useGroup(groupID);
  const { user } = useAuth();
  const { totalGroupDebtFromAllMembersInDefaultCurrency } =
    useTotalGroupDebtFromAllMembersInDefaultCurrency(group);

  const getOweOrOwed = (amount) => {
    return amount >= 0 ? `You are owed ` : `You owe `;
  };

  if (!group || !user) {
    return;
  }

  return (
    <p
      className={`total-group-debt ${getOwedAmountColor(
        totalGroupDebtFromAllMembersInDefaultCurrency
      )}`}
    >
      {getOweOrOwed(totalGroupDebtFromAllMembersInDefaultCurrency)}
      {Math.abs(totalGroupDebtFromAllMembersInDefaultCurrency)}
      {getCurrencyIconFromSymbol(user.defaultCurrency)}
    </p>
  );
}

export default GroupTotalDebtComponent;
