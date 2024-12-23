import React, { useState, useEffect } from "react";
// import DateInput from '../dateComp/DateInput';
import axios from "axios";
import "./supp.css";
const MasterSupp = () => {
  const [suppInputs, setSuppInputs] = useState({
    suppName: "",
    phoneNum: "",
    commission:"",
    discount:"",
    sales: 0,
    expenses:0,
  });
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/suplier/show");
        console.log("The incoming data for the supplier table is:",response.data)
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);
  const handleAddSupplier = async (e) => {
    e.preventDefault();

    if (suppInputs.suppName.trim() !== "" && suppInputs.phoneNum !== ""&& suppInputs.commission !== 0&& suppInputs.discount !== 0) {
      setSuppliers([...suppliers, suppInputs]);
      setSuppInputs({ suppName: "", phoneNum: "",commission:0,discount:0 });
    } else {
      // Notify the user that all fields are required
      alert("Please fill in all fields");
    }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post(
        "http://localhost:8000/suplier",
        suppInputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("THE RESPONSE:", response.data);
      setSuppliers([response.data, ...suppliers]); 
    } catch (error) {
      console.error("Error adding Suplier:", error);
      alert("Error adding Supler. Please try again."); // Inform user about error
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
      suppName: selectedSuplier.suplierName,
      phoneNum: selectedSuplier.phoneNum,
      commission:selectedSuplier.commission,
      discount:selectedSuplier.discount,
      sales: selectedSuplier.sales,
      expenses: selectedSuplier.expenses,
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
        `http://localhost:8000/suplier/${selectedSupplierId}`,
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
      setSuppInputs({ suppName: "", phoneNum: "" ,commission:0,discount:0}); // Clear input fields
    } catch (error) {
      console.error("Error updating Fish:", error);
      alert("Error updating fish. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedSupplierId(null); // Clear selected fish
    setSuppInputs({ suppName: "", phoneNum: "",commission:0,discount:0}); // Clear input fields
  };

  const handleDeleteSuplier = async (suplierId) => {
    if (!window.confirm("Are you sure you want to delete this suplier?")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.delete(
        `http://localhost:8000/suplier/${suplierId}`);
      console.log(response);
      setSuppliers(suppliers.filter((supp) => supp._id !== suplierId));
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Error deleting fish. Please try again.");
    } finally {
      setIsLoading(false);
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
        {/* <div className="dateDiv"><DateInput/></div> */}
        <div className="masterInputContainer">
          <form className="masterSuppForm" onSubmit={selectedSupplierId ? handleSaveEdit : handleAddSupplier}>
            <input
              className="masterSuppNameInput"
              type="text"
              placeholder="Supplier Name"
              value={suppInputs.suppName}
              onChange={(e) =>
                setSuppInputs({ ...suppInputs, suppName: e.target.value })
              }
            />
            <input
              className="numberInput"
              type="number"
              placeholder="Phone Nos."
              value={suppInputs.phoneNum}
              onChange={(e) =>
                setSuppInputs({ ...suppInputs, phoneNum: e.target.value })
              }
            />
              <input
              className="commissionInput"
              type="number"
              placeholder="Commission"
              value={suppInputs.commission}
              onChange={(e) =>
                setSuppInputs({ ...suppInputs, commission: e.target.value })
              }
            />
            <input
              className="discountInput"
              type="number"
              placeholder="Discount"
              value={suppInputs.discount}
              onChange={(e) =>
                setSuppInputs({ ...suppInputs, discount: e.target.value })
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
        <div class="scrollableTable">
        <div className="masterTableWrapper">
        <table className="supplierMasterTable">
          <thead>
            <tr className="headingRow">
              <th className="masterSuppCol">Supplier</th>
              <th className="masterNumCol">Contact</th>
              <th className="masterCommCol">Commission</th>
              <th className="masterDiscountCol">Discount</th>
              <th className="masterSalesCol">Sales</th>
              <th className="masterSalesCol">Expenses</th>
              <th className="mastrtActCol">Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={index}>
                <td>{supplier.suplierName}</td>
                <td>{supplier.phoneNum}</td>
                <td className="masterCommColAlign">{supplier.commission}</td>
                <td  className="masterDiscountColAlign">{supplier.discount}</td>
                <td className="masterSalesColAlign">{formatCurrency(supplier.sales)}</td>
                <td className="masterExpenseColAlign">{formatCurrency(supplier.expenses)}</td>
                <td>
                  <button
                    className="editButton"
                    onClick={() => handleEditSuplier(supplier._id)}
                    type="submit"
                  >
                    EDIT
                  </button>
                  {/* <button
                    className="deleteButton"
                    onClick={() => handleDeleteSuplier(supplier._id)}
                    type="submit"
                  >
                    DELETE
                  </button> */}
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

export default MasterSupp;