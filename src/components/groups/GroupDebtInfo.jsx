import useFriend from "../../hooks/useFriend";
import {
  getCurrencyIconFromSymbol,
  getOwedAmountColor
} from "../../utility/money";
import { useAuth } from "../../context/AuthContext";
import HideElement from "../layout/HideElement";
import useTotalGroupDebt from "../../hooks/useTotalGroupDebt";
import useTotalGroupDebtInDefaultCurrency from "../../hooks/useTotalGroupDebtInDefaultCurrency";

function GroupDebtInfo({ expenses, selectedMember }) {
  const { friend } = useFriend(selectedMember);
  const { totalDebt } = useTotalGroupDebt(selectedMember, expenses);

  const { totalGroupDebtInDefaultCurrency } =
    useTotalGroupDebtInDefaultCurrency(totalDebt || 0);
  const { user } = useAuth();

  const getOweOrOwes = (amount) => {
    return amount >= 0
      ? `${friend.userName} owes you `
      : `You owe ${friend.userName} `;
  };

  if (!user || !friend) return;

  return (
    <>
      <div className="hero-content">
        <span className="total-debt-info">
          <p className="owes-you-in-total">
            {getOweOrOwes(totalGroupDebtInDefaultCurrency)}
            <span
              className={getOwedAmountColor(totalGroupDebtInDefaultCurrency)}
            >
              &nbsp;{getCurrencyIconFromSymbol(user.defaultCurrency)}
              {Math.abs(totalGroupDebtInDefaultCurrency)}&nbsp;
            </span>
            {" in total."}
          </p>
          <HideElement>
            {totalDebt &&
              Object.keys(totalDebt).map((key) => (
                <p key={key} className="owes-you-in-total">
                  {getOweOrOwes(totalDebt[key])}
                  <span className={getOwedAmountColor(totalDebt[key])}>
                    &nbsp; {key}
                    {Math.abs(totalDebt[key]).toFixed(2)}
                  </span>
                  .
                </p>
              ))}
          </HideElement>
        </span>
      </div>
    </>
  );
}

export default GroupDebtInfo;
