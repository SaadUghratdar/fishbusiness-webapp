import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cust.css";
const MasterCust = () => {
  const [custInputs, setCustInputs] = useState({
    custName: "",
    phoneNum: "",
    credit: 0,
  });
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/customer/show");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, []);
  const handleAddCustomer = async (e) => {
    e.preventDefault();

    if (custInputs.custName.trim() !== "" && custInputs.phoneNum !== "") {
      setCustomers([...customers, custInputs]);
      setCustInputs({ custName: "", phoneNum: "" });
    } else {
      // Notify the user that all fields are required
      alert("Please fill in all fields");
    }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post(
        "http://localhost:8000/customer",
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
      console.error("Error adding customer:", error);
      alert("Error adding customer. Please try again."); // Inform user about error
    } finally {
      setIsLoading(false); // Set loading state to false after adding or error
    }
  };

  //Function to find the index of the editing row
  const handleEditCustomer = async (paypendingId) => {
    setSelectedCustomerId(paypendingId);
    const selectedCustomer = customers.find(
      (pay) => pay._id === paypendingId
    );

    console.log("in edit ", selectedCustomer);
    setCustInputs({
      custName: selectedCustomer.custName,
      phoneNum: selectedCustomer.phoneNum,
      credit: selectedCustomer.credit,
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
      const response = await axios.put(`http://localhost:8000/customer/${selectedCustomerId}`,
        custInputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedCustomerIndex = customers.findIndex(
        (pay) => pay._id === selectedCustomerId
      );
      setCustomers([
        ...customers.slice(0, updatedCustomerIndex),
        response.data,
        ...customers.slice(updatedCustomerIndex + 1),
      ]);
      setSelectedCustomerId(null); // Clear selected supplier after saving
      setCustInputs({ custName: "", phoneNum: "" }); // Clear input fields
    } catch (error) {
      console.error("Error updating Customer:", error);
      alert("Error updating Customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedCustomerId(null); // Clear selected fish
    setCustInputs({ custName: "", phoneNum: "" }); // Clear input fields
  };

  const handleDeleteCustomer = async (paypendingId) => {
    if (!window.confirm("Are you sure you want to delete this Customer?")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.delete(
        `http://localhost:8000/customer/${paypendingId}`
      );
      console.log(response);
      setCustomers(customers.filter((pay) => pay._id !== paypendingId));
      
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Error deleting customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckDetails=(customerId)=>{
    console.log("!!!The selected customer id for details is",customerId)
    window.open(`/creditDetails/${customerId}`, "_blank", "noopener,noreferrer");
  }

  const formatCurrency = (value) => {
    // if (value === undefined) {
    //   console.error('formatCurrency received undefined value');
    //   return ''; // Return a default value or handle the case appropriately
    // }
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
        <div className="masterCustInputContainer">
          <form
            className="mastCustForm"
            onSubmit={selectedCustomerId ? handleSaveEdit : handleAddCustomer}
          >
            <input
              className="mastCustNameInput"
              type="text"
              placeholder="Customer Name"
              value={custInputs.custName}
              onChange={(e) =>
                setCustInputs({ ...custInputs, custName: e.target.value })
              }
            />
            <input
              className="mastNumberInput"
              type="number"
              placeholder="Phone Number"
              value={custInputs.phoneNum}
              onChange={(e) =>
                setCustInputs({ ...custInputs, phoneNum: e.target.value })
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
              <th className="suppCol">Customer</th>
              <th className="numCol">Contact</th>
              <th className="salesCol">Credit</th>
              <th className="detailsCol">Details</th>
              <th className="actCol">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.custName}</td>
                <td>{customer.phoneNum}</td>
                <td>{customer.credit?formatCurrency(customer.credit):0}</td>
                <td>
                  <button className="saveButton" onClick={()=>handleCheckDetails(customer._id)}>DETAILS</button>
                </td>
                <td>
                  <button
                    className="editButton"
                    onClick={() => handleEditCustomer(customer._id)}
                    type="submit"
                  >
                    EDIT
                  </button>
                  <button
                    className="deleteButton"
                    onClick={() => handleDeleteCustomer(customer._id)}
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

export default MasterCust;