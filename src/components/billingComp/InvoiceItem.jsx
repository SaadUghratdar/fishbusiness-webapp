import React from "react";

function InvoiceItem({ description, pieces, kgs, grams, rate }) {
    return (
      <tr>
        <td>{description}</td>
        <td>{pieces}</td>
        <td>{kgs}</td>
        <td>{grams}</td>
        <td>{rate}</td>
        <td>{pieces * kgs * grams * rate}</td>  // Assuming calculation for total
      </tr>
    );
  }
  
  export default InvoiceItem;
  