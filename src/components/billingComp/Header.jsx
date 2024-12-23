import React from "react";

function Header({ companyInfo }) {
    return (
      <header className="invoice-header">
        {companyInfo.logo && <img src={companyInfo.logo} alt="Company Logo" />}
        <div className="company-info">
          <h2>{companyInfo.name}</h2>
          <p>{companyInfo.address}</p>
        </div>
        <div className="invoice-details">
          <p>Invoice No: {companyInfo.invoiceNumber}</p>
          <p>Date: {companyInfo.invoiceDate}</p>
        </div>
      </header>
    );
  }
  
  export default Header;
  