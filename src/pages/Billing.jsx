import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/server";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";

import GenerateInvoice from "../components/billComps/GenerateInvoice";
const Billing = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [disabledButtons, setDisabledButtons] = useState({});
  const emptyRows = {
    Particulars: "",
    Pieces: "",
    Kgs: "",
    Grams: "",
    Rate: "",
    Rupees: "",
  };
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/suplierentry/show?date=${selectedDate}`);
        setSuppliers(response.data);
        console.log("sent supplier", response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      setDisabledButtons({});
      }
    };

    fetchSuppliers();
  }, [selectedDate]);
  const handlePrintBill = (supplierId) => {
    setSelectedSupplierId(supplierId);
    console.log("I am in the print bill function.");
    window.open(`/invoice/${supplierId}/${selectedDate}`, "_blank", "noopener,noreferrer");
  };

  const handleGenerateBill=async (supplierId)=>{
    setDisabledButtons(prevState => ({ ...prevState, [supplierId]: true }));
    console.log("IN THE HANDLE GENERATE BILL!", supplierId, selectedDate);
    try {
      const response = await axios.get(
        `http://localhost:8000/billing/${supplierId}?date=${selectedDate}`
      );
      console.log("I generated Bill!", response);
    } catch (error) {
      console.error("Error generating bill:", error);
    } 
  };
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);

  }

  return (
    <div className="dailySupplierWrapper">
      <div className="date-input-container">
        <label htmlFor="dateInput">Date:</label>
        <input
          type="date"
          id="dateInput"
          name="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <table className="supplierTable">
        <thead>
          <tr>
            <th className="suppCol">Supplier</th>
            <th className="actCol">Action</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier, index) => (
            <tr key={supplier._id}>
              <td>{supplier.suppName}</td>
              <td>
              <button
                  className="makeBillButton"
                  onClick={() => handleGenerateBill(supplier.supplierId)}
                  type="submit"
                  disabled={disabledButtons[supplier.supplierId] || false}
                >
                  {disabledButtons[supplier.supplierId] ? "DONE" : "MAKE BILL"}
                </button>
                <button
                  onClick={() => handlePrintBill(supplier.supplierId)}
                  type="submit"
                >
                  SHOW BILL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Billing;

// const generateInvoice = (supplierId) => {
//   return <GenerateInvoice supplierId={supplierId} />; // Return the Invoice component
// };

// const createInvoiceTable = (doc, data) => {
//   const tableHeaders = Object.keys(data); // Assuming data object structure matches emptyRows

//   // Define table options (adjust as needed)
//   const tableOptions = {
//     startY: 30,
//     margin: { top: 20 },
//     headStyles: { fontSize: 12, fillColor: '#f0f0f0' },
//     bodyStyles: { fontSize: 10 },
//     columnWidth: 'auto',
//   };

//   doc.autoTable(tableHeaders, data, tableOptions);
// };
