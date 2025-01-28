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
    <>
      {Object.keys(totalGroupDebtFromAllMembersInDefaultCurrency).map(
        (debt, index) => {
          if (totalGroupDebtFromAllMembersInDefaultCurrency[debt] === 0) {
            return;
          }

          return (
            <p
              key={index}
              className={`total-group-debt ${getOwedAmountColor(
                totalGroupDebtFromAllMembersInDefaultCurrency[debt]
              )}`}
            >
              {getOweOrOwed(
                totalGroupDebtFromAllMembersInDefaultCurrency[debt]
              )}
              {Math.abs(totalGroupDebtFromAllMembersInDefaultCurrency[debt])}
              {getCurrencyIconFromSymbol(user.defaultCurrency)}
            </p>
          );
        }
      )}
    </>
  );
}

export default GroupTotalDebtComponent;
