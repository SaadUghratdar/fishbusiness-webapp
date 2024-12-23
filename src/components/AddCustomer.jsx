import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { useCustomersContext } from "./CustomerContext";
import "../styles/homePage.css";
import DateInput from "./dateComp/DateInput";
import { CustomerProvider } from "./CustomerContext";
import ReactToPrint from "react-to-print";

// import AddInputFields from './AddInputFields.jsx'
import { initialState } from "./customerReducer";
const AddCustomer = () => {
  const { state, dispatch } = useCustomersContext();
  const [counterInputs, setCounterInputs] = useState({
    suppName: "",
    custName: "",
    subName: "",
    fishName: "",
    pieces: "",
    weight: "",
    rate: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const componentRef = useRef();
  //Now setting the states for the datalist options
  const [fishes, setFishes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);

  //This is used to calculate the TOTALCOUNTER whenever the state changes
  useEffect(() => {
    dispatch({ type: "UPDATE_COUNTER_TOTAL" });
  }, [state.rows]);

  useEffect(() => {
    //FUNCTION TO FETCH THE FISH DATA
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fishResponse = await axios.get("http://localhost:8000/fish/show");
        const supplierResponse = await axios.get(
          "http://localhost:8000/suplier/show"
        );
        const customerResponse = await axios.get(
          "http://localhost:8000/customer/show"
        );
        setFishes(fishResponse.data);
        setSuppliers(supplierResponse.data);
        setCustomers(customerResponse.data);
      } catch (error) {
        console.error("Error fetching data for the datalist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCustomerData = async () => {
      console.log("I AM IN THE DATA FETCHER!!");
      try {
        const response = await axios.get(
          `http://localhost:8000/cashcounter/show?date=${selectedDate}`
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
            pieces: data.pieces,
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
  }, [dispatch, selectedDate]);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //To add the rows and set the edited index to 0
  const handleAddRow = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/cashcounter?date=${selectedDate}`,
        counterInputs,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // if (!response.ok) {
      //   throw new Error('Failed to add customer');
      // }

      const newCustomer = response.data;
      const newAddedData = {
        id: newCustomer._id,
        suppName: newCustomer.suplierName,
        custName: newCustomer.customerName,
        subName: newCustomer.subName,
        fishName: newCustomer.fishName,
        weight: newCustomer.weight,
        pieces: newCustomer.pieces,
        rate: newCustomer.rate,
        total: newCustomer.total,
      };

      // Dispatch action to update local state with the new customer
      dispatch({ type: "ADD", payload: newAddedData });

      // Clear the form for next entry
      setCounterInputs({
        suppName: "",
        custName: "",
        subName: "",
        fishName: "",
        weight: "",
        pieces: "",
        rate: "",
      });
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };
  //To delete the row
  const handleDeleteRow = async (id) => {
    if (!window.confirm("Are you sure you want to delete this row?")) {
      return;
    }
    console.log("deletign id", id);

    try {
      const response = await axios.delete(
        `http://localhost:8000/cashcounter/${id}`
      ); // DELETE request

      if (response.status === 200) {
        // Check for successful deletion
        dispatch({ type: "DELETE_ROW", payload: id }); // Dispatch action to update context state
      } else {
        console.error("Error deleting customer:", response.statusText); // Handle errors
      }
    } catch (error) {
      console.error("Error deleting customer:", error); // Handle errors
    }
  };

  //To set the editedIndex and EditedRow
  const handleEditRow = (index, row) => {
    setEditIndex(index);
    setEditedRow({ ...row });
  };

  //To save the changes made in the rows
  const handleSaveRow = async (id) => {
    console.log("The edited row for cash counter is:", editedRow);
    try {
      const response = await axios.put(
        `http://localhost:8000/cashcounter/${id}`,
        editedRow,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        // Check for successful update
        dispatch({ type: "SAVE_ROW", payload: { id, updatedRow: editedRow } });
        setEditIndex(null);
        setEditedRow({});
      } else {
        console.error("Error saving changes:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  //To set the changed value and set the TOTAL for the row
  const handleChange = (e, columnName) => {
    const { value } = e.target;

    setEditedRow((prevState) => ({
      ...prevState,
      [columnName]: value,
    }));
    if (columnName === "weight" || columnName === "rate") {
      const weight =
        parseFloat(columnName === "weight" ? value : editedRow.weight) || 0;
      const rate =
        parseFloat(columnName === "rate" ? value : editedRow.rate) || 0;
      const total = (weight * rate).toFixed(0);

      setEditedRow((prevState) => ({
        ...prevState,
        total: total,
      }));
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-IN", {
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <>
     <ReactToPrint trigger={() => <button className="dashPrintButton">Print/Download</button>} content={() => componentRef.current} />
     <div ref={componentRef} className="dashboardMainDiv">
      <div className="cardContainerDiv">
        <div className="counterCard">
          <h3>Counter Total</h3>
          <h1> {formatCurrency(state.counterTotal)}</h1>
        </div>
        <DateInput onDateChange={handleDateChange} />
        {/* <CustomerProvider selectedDate={selectedDate} /> */}
        <div className="cashCard">
          <h3>Cash Total</h3>
          <h1>{formatCurrency(state.cashTotal)}</h1>
        </div>
      </div>
      <div className="counterInputContainer">
        <form onSubmit={handleAddRow}>
          <input
            list="suppDatalistOptions"
            type="text"
            className="suppInput"
            placeholder="Supplier"
            value={counterInputs.suppName}
            onChange={(e) =>
              setCounterInputs({
                ...counterInputs,
                suppName: e.target.value.toUpperCase(),
              })
            }
          />
          <datalist id="suppDatalistOptions">
            {suppliers.map((supp, index) => (
              <option value={supp.suplierName} />
            ))}
          </datalist>

          <input
            list="custDatalistOptions"
            type="text"
            className="custInput"
            placeholder="Customer"
            value={counterInputs.custName}
            onChange={(e) =>
              setCounterInputs({
                ...counterInputs,
                custName: e.target.value.toUpperCase(),
              })
            }
          />

          <datalist id="custDatalistOptions">
            {customers.map((cust, index) => (
              <option value={cust.custName} />
            ))}
          </datalist>
          <input
            type="text"
            className="subInput"
            placeholder="SubCustomer"
            value={counterInputs.subName}
            onChange={(e) =>
              setCounterInputs({
                ...counterInputs,
                subName: e.target.value.toUpperCase(),
              })
            }
          />
          <input
            className="fishInput"
            list="datalistOptions"
            type="text"
            placeholder="Fish"
            value={counterInputs.fishName}
            onChange={(e) =>
              setCounterInputs({
                ...counterInputs,
                fishName: e.target.value.toUpperCase(),
              })
            }
          />
          <datalist id="datalistOptions">
            {fishes.map((fish, index) => (
              <option className="fishOptionClass" value={fish.fishName} />
            ))}
          </datalist>
          <input
            type="number"
            className="weightInput"
            placeholder="Pieces"
            value={counterInputs.pieces}
            onChange={(e) =>
              setCounterInputs({ ...counterInputs, pieces: e.target.value })
            }
          />
          <input
            type="number"
            className="weightInput"
            placeholder="Weight"
            value={counterInputs.weight}
            onChange={(e) =>
              setCounterInputs({ ...counterInputs, weight: e.target.value })
            }
          />
          <input
            type="number"
            className="rateInput"
            placeholder="Rate"
            value={counterInputs.rate}
            onChange={(e) =>
              setCounterInputs({ ...counterInputs, rate: e.target.value })
            }
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <table className="homeTable">
        <thead>
          <tr>
            {/* <th>Row ID</th> */}
            <th>Supplier</th>
            <th>Customer</th>
            <th className="subCol">SubCustomer</th>
            <th className="fishColm">Fish Type</th>
            <th className="piecesCol">Pieces</th>
            <th className="weightCol">Weight</th>
            <th className="rateCol">Rate</th>
            <th className="totalCol">Total</th>
            <th className="lastCol">Action</th>
          </tr>
        </thead>
        <tbody>
          {state.rows.map((row, index) => (
            <tr key={row.id}>
              <td>
                {" "}
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editedRow.supplierName}
                    onChange={(e) => handleChange(e, "supplierName")}
                  />
                ) : (
                  row.supplierName
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editedRow.customerName}
                    onChange={(e) => handleChange(e, "customerName")}
                  />
                ) : (
                  row.customerName
                )}
              </td>
              <td>
                {" "}
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editedRow.subCustomer}
                    onChange={(e) => handleChange(e, "subCustomer")}
                  />
                ) : (
                  row.subCustomer
                )}
              </td>
              <td>
                {" "}
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editedRow.fishName}
                    onChange={(e) => handleChange(e, "fishName")}
                  />
                ) : (
                  row.fishName
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="number"
                    value={editedRow.pieces}
                    onChange={(e) => handleChange(e, "pieces")}
                  />
                ) : (
                  row.pieces
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="number"
                    value={editedRow.weight}
                    onChange={(e) => handleChange(e, "weight")}
                  />
                ) : (
                  row.weight
                )}
              </td>

              <td>
                {editIndex === index ? (
                  <input
                    type="number"
                    value={editedRow.rate}
                    onChange={(e) => handleChange(e, "rate")}
                  />
                ) : (
                  formatCurrency(row.rate)
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="number"
                    value={editedRow.rate * editedRow.weight}
                    onChange={(e) => handleChange(e, "total")}
                  />
                ) : (
                  formatCurrency(row.total)
                )}
              </td>
              <td className="buttonCol">
                {editIndex === index ? (
                  <button
                    className="saveButton"
                    onClick={() => handleSaveRow(row.id)}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    {}
                    <button
                      className="editButton"
                      onClick={() => handleEditRow(index, row)}
                    >
                      Edit
                    </button>
                    <button
                      className="deleteButton"
                      onClick={() => handleDeleteRow(row.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default AddCustomer;
