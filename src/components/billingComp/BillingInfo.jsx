import React from "react";

function BillingInfo({ billingInfo }) {
    return (
      <section className="billing-info">
        <h3>Bill To:</h3>
        <p>{billingInfo.name}</p>
        <p>{billingInfo.address}</p>
      </section>
    );
  }
  
  export default BillingInfo;
  