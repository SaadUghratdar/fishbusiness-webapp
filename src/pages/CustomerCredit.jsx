import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/cashcounter.css'
const CustomerCredit = ({ match }) => {
  const [fetchedDetails, setFetchedDetails] = useState([]);
  const { customerId } = useParams();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const response = await axios.get(
        `http://localhost:8000/cashcounter/show?customerId=${customerId}`
      );
      const tableData = response.data.map((data) => {
        return {
          id: data._id,
          supplierName: data.suplierId.suplierName,
          customerName: data.customerId.customerName,
          subCustomer: data.subName,
          fishName: data.fishId.fishName,
          weight: data.kg,
          rate: data.rate,
          total: data.amount,
        };
      });

      console.log("@@The data received for the customer id is:", tableData);
      setFetchedDetails(tableData);
    };
    fetchCustomerDetails();
  }, [customerId]);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  return (
    <>
     
      <div className="tableDiv">
        <table className="homeTable">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Customer</th>
              <th className="subCol">SubCustomer</th>
              <th className="fishColm">Fish Type</th>
              <th className="weightCol">Weight</th>
              <th className="rateCol">Rate</th>
              <th className="totalCol">Total</th>
            </tr>
          </thead>
          <tbody>
            {fetchedDetails.map((row, index) => (
              <tr key={index}>
                <td>{row.supplierName}</td>
                <td>{row.customerName}</td>
                <td>{row.subCustomer}</td>
                <td>{row.fishName}</td>
                <td>{row.weight}</td>
                <td>{formatCurrency(row.rate)}</td>
                <td>{formatCurrency(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomerCredit;
