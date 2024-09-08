import { nanoid } from "nanoid";
import { useAuth } from "../../context/AuthContext";
import useTotalDebt from "../../hooks/useTotalDebt";
import useTotalDebtInDefaultCurrency from "../../hooks/useTotalDebtInDefaultCurrency";
import {
  getCurrencyIconFromSymbol,
  getOwedAmountColor
} from "../../utility/money";
import HideElement from "../layout/HideElement";

function DebtInfo({ friend, expensesList }) {
  const totalDebt = useTotalDebt(friend.id, expensesList);
  const totalDebtInDefaultCurrency = useTotalDebtInDefaultCurrency(friend.id);
  const { user } = useAuth();

  const getOweOrOwes = (amount) => {
    return amount >= 0
      ? `${friend.userName} owes you `
      : `You owe ${friend.userName} `;
  };

  return (
    <>
      <div className="hero-content">
        <h1 className="name">{friend.userName}</h1>
        <span className="total-debt-info">
          <p>
            {getOweOrOwes(totalDebtInDefaultCurrency)}
            <span className={getOwedAmountColor(totalDebtInDefaultCurrency)}>
              {getCurrencyIconFromSymbol(user.defaultCurrency)}
              {Math.abs(totalDebtInDefaultCurrency)}
            </span>
            {" in total."}
          </p>
          <HideElement>
            {totalDebt &&
              Object.keys(totalDebt).map((key) => (
                <p key={nanoid()}>
                  {getOweOrOwes(totalDebt[key])}
                  <span className={getOwedAmountColor(totalDebt[key])}>
                    {key}
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

export default DebtInfo;
