import React, { useState, useEffect } from "react";

const TodaySuppTable = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/suplierentry/show"
        );
        setSuppliers(response.data);
        console.log("sent supplier", response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);
  return (
    <>
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
                  type="submit"
                >
                  BILL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default TodaySuppTable;
