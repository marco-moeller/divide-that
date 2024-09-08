export const userHasPaid = (userID, suckerID) => {
  return userID === suckerID;
};

export const getExpenseColor = (userPaid) => {
  return userPaid ? "green" : "red";
};
