import React from "react";


function Expense({ name, amount }) {
    return (
      <tr>
        <td>{name}</td>
        <td>{amount}</td>
      </tr>
    );
  }
  
  export default Expense;
  