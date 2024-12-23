import React from "react";


function InvoiceSummary({ total, amountPaid, balanceDue }) {
    return (
      <section className="invoice-summary">
        <table>
          <tbody>
            <tr>
              <td>Total:</td>
              <td>{total}</td>
            </tr>
            <tr>
              <td>Amount Paid:</td>
              <td>{amountPaid}</td>
            </tr>
            <tr>
              <td>Balance Due:</td>
              <td>{balanceDue}</td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }
  
  export default InvoiceSummary;
  