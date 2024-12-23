import React, { useContext, useState, useEffect } from "react";
import "./suppStyle.css";
import axios from "axios";

const SuppliersTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [suppInputs, setSuppInputs] = useState({
    suppName: "",
    truck:"",
    railway:"",
    airway:"",
    direct:"",
    balance:"",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/suplierentry/show?date=${selectedDate}`
        );
        setSuppliers(response.data);
        console.log("sent supplier", suppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [selectedDate]);

  const handleAddSupplier = async (e) => {
    e.preventDefault();

    if (
      suppInputs.suppName.trim() !== "") {
      setSuppliers([suppInputs, ...suppliers]);
      setSuppInputs({ suppName: "",truck:"",railway:"",airway:"",direct: "",balance:"",});
    } else {
      // Notify the user that all fields are required
      alert("Please fill in all fields");
    }

    setIsLoading(true); // Set loading state to true
    console.log("The supplier inputs are:",suppInputs);
    try {
      const response = await axios.post(
        `http://localhost:8000/suplierentry?date=${selectedDate}`,
        suppInputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("THE RESPONSE:", response.data);
      setSuppliers([response.data, ...suppliers]); // Add newly created fish to state
    } catch (error) {
      console.error("Error adding SuplierEntry:", error);
      alert("Error adding Suplier. Please try again."); // Inform user about error
    } finally {
      setIsLoading(false); // Set loading state to false after adding or error
    }
  };

  //Function to find the index of the editing row
  const handleEditSuplier = async (suplierId) => {
    setSelectedSupplierId(suplierId);
    const selectedSuplier = suppliers.find((supp) => supp._id === suplierId);
    console.log("in edit ", selectedSuplier);
    setSuppInputs({
      suppName: selectedSuplier.suppName,
      boxes: selectedSuplier.boxes,
      truck:selectedSuplier.truck,
      railway:selectedSuplier.railway,
      airway:selectedSuplier.airway,
      direct:selectedSuplier.direct,
      balance:selectedSuplier.balance,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!suppInputs.suppName.trim()) {
      alert("Please fill in all required fields!!");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:8000/suplierentry/${selectedSupplierId}`,
        suppInputs
      );

      const updatedSupplierIndex = suppliers.findIndex(
        (supp) => supp._id === selectedSupplierId
      );
      setSuppliers([
        ...suppliers.slice(0, updatedSupplierIndex),
        response.data,
        ...suppliers.slice(updatedSupplierIndex + 1),
      ]);
      setSelectedSupplierId(null); // Clear selected supplier after saving
      setSuppInputs({ suppName: "", truck:"",railway:"",airway:"",direct: "",balance:"",});
    } catch (error) {
      console.error("Error updating Suplier Entry:", error);
      alert("Error updating Suplier Entry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedSupplierId(null); // Clear selected fish
    setSuppInputs({ suppName: "", truck:"",railway:"",airway:"",direct: "",balance:"",}); // Clear input fields
  };

  const handleDeleteSuplier = async (suplierId,suppName) => {
    if (!window.confirm("Are you sure you want to delete this suplier?")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.delete(
        `http://localhost:8000/suplierentry/${suplierId}/${selectedDate}?supp=${suppName}`
      );
      console.log(response);
      setSuppliers(suppliers.filter((supp) => supp._id !== suplierId));
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Error deleting fish. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    // onDateChange(date)
  }
  return (
    <>
      
          <div className="dailySuppDateDiv">
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
          </div>
         
          <div className="dailySuppInputContainer">
            <form
              className="dailySuppInputcontainer"
              onSubmit={selectedSupplierId ? handleSaveEdit : handleAddSupplier}
            >
              <input
                className="mastSuppNameInput"
                type="text"
                placeholder="Supplier Name"
                value={suppInputs.suppName}
                onChange={(e) =>
                  setSuppInputs({ ...suppInputs, suppName: e.target.value })
                }
              />
              <input
                className="boxesInput"
                type="number"
                placeholder="Truck"
                value={suppInputs.truck}
                onChange={(e) =>
                  setSuppInputs({ ...suppInputs, truck: e.target.value })
                }
              />
              <input
                className="boxesInput"
                type="number"
                placeholder="Railway"
                value={suppInputs.railway}
                onChange={(e) =>
                  setSuppInputs({ ...suppInputs, railway: e.target.value })
                }
              />
              <input
                className="boxesInput"
                type="number"
                placeholder="Airway"
                value={suppInputs.airway}
                onChange={(e) =>
                  setSuppInputs({ ...suppInputs, airway: e.target.value })
                }
              />
              <input
                className="boxesInput"
                type="number"
                placeholder="Direct"
                value={suppInputs.direct}
                onChange={(e) =>
                  setSuppInputs({ ...suppInputs, direct: e.target.value })
                }
              />
              <input
                className="boxesInput"
                type="number"
                placeholder="Balance"
                value={suppInputs.balance}
                onChange={(e) =>
                  setSuppInputs({ ...suppInputs, balance: e.target.value })
                }
              />
    
              {selectedSupplierId === null ? (
                <button type="submit">ADD</button>
              ) : (
                <>
                  <button className="saveButton" type="submit">SAVE</button>
                  <button className="deleteButton" onClick={handleCancelEdit}>CANCLE</button>
                </>
              )}
            </form>
          </div>
          <div className="scrollableTable">
          <div className="tableWrapper">
          <table className="supplierTable">
            <thead>
              <tr>
                <th className="suppCol">Supplier</th>
                <th className="boxCol">Truck</th>
                <th className="boxCol">Railway</th>
                <th className="boxCol">Airway</th>
                <th className="boxCol">Direct</th>
                <th className="boxCol">Balance</th>
                <th className="boxCol">Boxes</th>
                <th className="actCol">Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, index) => (
                <tr key={index}>
                  <td>{supplier.suppName}</td>
                  <td>{supplier.truck}</td>
                  <td>{supplier.railway}</td>
                  <td>{supplier.airway}</td>
                  <td>{supplier.direct}</td>
                  <td>{supplier.balance}</td>
                  <td>{supplier.truck+supplier.railway+supplier.airway+supplier.direct+supplier.balance}</td>
                  <td>
                    <button
                      className="editButton"
                      onClick={() => handleEditSuplier(supplier._id)}
                      type="submit"
                    >
                      EDIT
                    </button>
                    <button
                      className="deleteButton"
                      onClick={() => handleDeleteSuplier(supplier._id,supplier.suppName)}
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
    </>
  );
};

export default SuppliersTable;
