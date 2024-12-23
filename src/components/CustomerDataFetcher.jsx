import React, { useState, useEffect } from "react";
import { useCustomersContext } from "./CustomerContext";
import axios from "axios";
const CustomerDataFetcher = ({ date }) => {
  const { state, dispatch } = useCustomersContext();

  console.log("The date in Fetcher is ",date);
  useEffect(() => {
    const fetchCustomerData = async () => {
      console.log("I AM IN THE DATA FETCHER!!");
      try {
        const response = await axios.get(
          "http://localhost:8000/cashcounter/show"
        );
       
        //WE HAVE DESTRUCTURED THE INCOMING DATA
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
        
        dispatch({ type: "FETCH_CUSTOMER_DATA", payload: tableData }); // Dispatch action with fetched data
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomerData();
  }, [dispatch, date]);
  return null;
};

export default CustomerDataFetcher;
