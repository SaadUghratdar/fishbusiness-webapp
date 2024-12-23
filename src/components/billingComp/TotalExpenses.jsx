import Expense from './Expense';
import React from "react";

function TotalExpenses({ expenses }) {
  return (
    <table>
      <tbody>
        {expenses.map((expense) => (
          <Expense key={expense.name} {...expense} />
        ))}
      </tbody>
    </table>
  );
}

export default TotalExpenses;
