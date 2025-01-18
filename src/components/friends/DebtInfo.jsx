import { useAuth } from "../../context/AuthContext";
import useTotalDebt from "../../hooks/useTotalDebt";
import useTotalDebtInDefaultCurrency from "../../hooks/useTotalDebtInDefaultCurrency";
import {
  getCurrencyIconFromSymbol,
  getOwedAmountColor
} from "../../utility/money";
import HideElement from "../layout/HideElement";

function DebtInfo({ friend, expenses }) {
  const totalDebt = useTotalDebt(friend.id, expenses);
  const { totalDebtInDefaultCurrency } = useTotalDebtInDefaultCurrency(
    friend.id
  );
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
        <div className="total-debt-info">
          <p className="owes-you-in-total">
            {getOweOrOwes(totalDebtInDefaultCurrency)}
            <span className={getOwedAmountColor(totalDebtInDefaultCurrency)}>
              &nbsp;{getCurrencyIconFromSymbol(user.defaultCurrency)}
              {Math.abs(totalDebtInDefaultCurrency)}&nbsp;
            </span>
            {" in total."}
          </p>
          <HideElement>
            {totalDebt &&
              Object.keys(totalDebt).map((key) => (
                <p key={key} className="owes-you-in-total">
                  {getOweOrOwes(totalDebt[key])}
                  <span className={getOwedAmountColor(totalDebt[key])}>
                    &nbsp;{key}
                    {Math.abs(totalDebt[key]).toFixed(2)}
                  </span>
                  .
                </p>
              ))}
          </HideElement>
        </div>
      </div>
    </>
  );
}

export default DebtInfo;
