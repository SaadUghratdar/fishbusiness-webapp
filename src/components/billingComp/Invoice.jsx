import React, { useState } from 'react';
import Header from './Header';
import BillingInfo from './BillingInfo';
import InvoiceItemsTable from './InvoiceItemsTable';
import Calculation from './Calculation';
import Expense from './Expense';
import TotalExpenses from './TotalExpenses';
import InvoiceSummary from './InvoiceSummary';
import "./style.css"

function Invoice({ supplierName }) {
  const [invoiceData, setInvoiceData] = useState({
    companyInfo: {
      name: 'Your Company Name',
      address: 'Your Company Address',
      logo: '', // Optional logo URL
    },
    billingInfo: {
      name: 'Customer Name',
      address: 'Customer Address',
    },
    invoiceItems: [
      { description: 'Item 1', quantity: 2, rate: 10 },
      { description: 'Item 2', quantity: 1, rate: 20 },
    ],
    subTotal: 40,
    commission: 5, // Optional
    discount: 0, // Optional
    expenses: {
      Bazar: 2,
      Cartage: 1,
    },
  });

  const handleExpenseChange = (category, value) => {
    setInvoiceData({
      ...invoiceData,
      expenses: {
        ...invoiceData.expenses,
        [category]: value,
      },
    });
  };

  const calculateTotal = () => {
    const subTotal = invoiceData.invoiceItems.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    const commissionAmount = subTotal * (invoiceData.commission / 100) || 0;
    const discountAmount = subTotal * (invoiceData.discount / 100) || 0;
    const totalExpenses = Object.values(invoiceData.expenses).reduce((acc, expense) => acc + expense, 0);
    return subTotal + commissionAmount - discountAmount + totalExpenses;
  };

  const total = calculateTotal();

  return (
    <div className="invoice">
      <Header companyInfo={invoiceData.companyInfo} />
      <h2>Supplier: {supplierName}</h2> {/* Display supplier name */}
      <BillingInfo billingInfo={invoiceData.billingInfo} />
      <InvoiceItemsTable items={invoiceData.invoiceItems} />
      <table>
        <tbody>
          <Calculation label="Sub Total" value={invoiceData.subTotal} />
          {invoiceData.commission > 0 && (
            <Calculation label="Commission" value={calculateTotal(invoiceData.commission)} />
          )}
          {invoiceData.discount > 0 && (
            <Calculation label="Discount" value={calculateTotal(invoiceData.discount)} />
          )}
        </tbody>
      </table>
      <TotalExpenses expenses={invoiceData.expenses} />
      <InvoiceSummary total={total} />
      {/* Add logic to generate and download PDF here */}
    </div>
  );
}

export default Invoice;
