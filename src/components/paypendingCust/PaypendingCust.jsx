import React, { useState, useEffect } from "react";
import axios from "axios";
import "./pay.css";
const PayPendingCust = () => {
  const [custInputs, setCustInputs] = useState({
    custName: "",
    amount:"",
  });
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/paypending/show"
        );
        console.log("The received pay pending data is:",response);
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching paypending:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, []);
  const currentDate=new Date().toLocaleString();
  const handleAddCustomer = async (e) => {
    e.preventDefault();

    if (custInputs.custName.trim() !== "" && custInputs.amount !== "") {
      console.log("The cust inputs before setting it to customers:",custInputs);
      setCustomers([...customers, custInputs]);
      setCustInputs({ custName: "", amount: "" });
    } else {
      // Notify the user that all fields are required
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post(
        "http://localhost:8000/paypending",
        custInputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("THE RESPONSE:", response.data);
      setCustomers([response.data, ...customers]); // Add newly created fish to state
    } catch (error) {
      console.error("Error adding paypending entry:", error);
      alert("Error adding paypending entry. Please try again."); // Inform user about error
    } finally {
      setIsLoading(false); // Set loading state to false after adding or error
    }
  };
  
  //Function to find the index of the editing row
  const handleEditSuplier = async (paypendingId) => {
    setSelectedCustomerId(paypendingId);
    const selectedCustomer = customers.find(
      (cust) => cust._id === paypendingId
    );
    console.log("in edit ", selectedCustomer);
    setCustInputs({
      custName: selectedCustomer.custName,
      amount: selectedCustomer.amount,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!custInputs.custName.trim()) {
      alert("Please fill in all required fields!!");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:8000/paypending/${selectedCustomerId}`,
        custInputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedCustomerIndex = customers.findIndex(
        (cust) => cust._id === selectedCustomerId
      );
      setCustomers([
        ...customers.slice(0, updatedCustomerIndex),
        response.data,
        ...customers.slice(updatedCustomerIndex + 1),
      ]);
      setSelectedCustomerId(null); // Clear selected supplier after saving
      setCustInputs({ custName: "",amount: "" }); // Clear input fields
    } catch (error) {
      console.error("Error updating paypending entry:", error);
      alert("Error updating paypending entry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedCustomerId(null); // Clear selected fish
    setCustInputs({ custName: "", amount: "" }); // Clear input fields
  };

  const handleDeleteSuplier = async (paypendingId) => {
    if (
      !window.confirm("Are you sure you want to delete this paypending entry?")
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.delete(
        `http://localhost:8000/paypending/${paypendingId}`
      );
      console.log(response);
      setCustomers(customers.filter((cust) => cust._id !== paypendingId));
    } catch (error) {
      console.error("Error deleting paypending entry:", error);
      alert("Error deleting paypending entry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
       if (value === undefined) {
      return ''; // Return a default value or handle the case appropriately
    }
    return value.toLocaleString("en-IN", {
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  return (
    <div class="scrollableTable">
      <div className="tableWrapper">
        {/* <div className="dateDiv">DATE</div> */}
        <div className="inputContainer">
          <form
            className="payPenForm"
            onSubmit={selectedCustomerId ? handleSaveEdit : handleAddCustomer}
          >
            <input
              className="payPenNameInput"
              type="text"
              placeholder="Customer Name"
              value={custInputs.custName}
              onChange={(e) =>
                setCustInputs({ ...custInputs, custName: e.target.value })
              }
            />
            <input
              className="payPenNumberInput"
              type="number"
              placeholder="Amount"
              value={custInputs.amount}
              onChange={(e) =>
                setCustInputs({ ...custInputs, amount: e.target.value })
              }
            />
            {selectedCustomerId === null ? (
              <button type="submit">ADD</button>
            ) : (
              <>
                <button className="saveButton" type="submit">SAVE</button>
                <button className="deleteButton" onClick={handleCancelEdit}>CANCLE</button>
              </>
            )}
          </form>
        </div>

        <table className="customerMasterTable">
          <thead>
            <tr>
              <th className="dateCol">Date</th>
              <th className="suppCol">Customer</th>
              <th className="salesCol">Amount</th>
              <th className="actCol">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.date}</td>
                <td>{customer.custName}</td>
                <td>{formatCurrency(customer.amount)}</td>
                <td>
                  <button
                    className="editButton"
                    onClick={() => handleEditSuplier(customer._id)}
                    type="submit"
                  >
                    EDIT
                  </button>
                  <button
                    className="deleteButton"
                    onClick={() => handleDeleteSuplier(customer._id)}
                    type="submit"
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayPendingCust;