import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";

const InvoicePage = ({ match }) => {
  const [suppname, setSuppname] = useState("");
  const [billTotal, setBillTotal] = useState(0);
  const [billData, setBillData] = useState({});
  const [dailyBoxes, setDailyBoxes] = useState({});
  const { supplierId, selectedDate } = useParams();
  const [suppDetails,setSuppDetails]=useState({});
  const [editClicked, setEditClicked] = useState(false);
  const [expenses, setExpenses] = useState({
    Commission: 0,
    Discount: 0,
    Bazar: 0,
    Cartage: 0,
    Railway: 0,
    Ice: 0,
    Cooley: 0,
    TruckHire: 0,
    AssoFee: 0,
    Deposit: 0,
    Rebate: 0,
    Total: 0,
    Payment: 0,
    OtherExpense: 0,
    GrandTotal: 0,
  });
  const [tableData, setTableData] = useState([]);
  const [editedTableData, setEditedTableData] = useState([]);

  const date = new Date(selectedDate);
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const componentRef = useRef();

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/billing/showBill/${supplierId}?date=${date}`
        );
      
        const dailySupp = await axios.get(
          `http://localhost:8000/suplierentry/show/${supplierId}?date=${date}`
        );

    

        const data = response.data;
        const supp =
        {
          suplierName:data.filteredSupplier.supplierDetails.suplierName,
          commission:data.filteredSupplier.supplierDetails.commission,
          discount:data.filteredSupplier.supplierDetails.discount
        } 


        setSuppDetails(supp);

        const dailyBox = {
          byTruck: dailySupp.data.truck,
          byRail: dailySupp.data.railway,
          byAir: dailySupp.data.airway,
          byDirect: dailySupp.data.direct,
          balance: dailySupp.data.balance,
        };

        setDailyBoxes(dailyBox);
        
        console.log("The sent filteredSupplier is:",data.filteredSupplier.fish);

        const transformedData = data.filteredSupplier.fish.map((fish) => ({
          Rupees: Math.round(fish.totalsaleweigth * fish.totalaveragerate),
          Particulars: fish.fishDetails,
          Pieces: fish.totalpieces,
          Kgs: (fish.totalsaleweigth),
          Rate: (Math.round(fish.totalaveragerate)),
        }));

        console.log("The transformed data is:",transformedData);
        const totalAmount = transformedData.reduce(
          (acc, curr) => acc + curr.Rupees,
          0
        );

        const bill = {
          billNumber: response.data.billNumber,
          dailySales: response.data.dailySales,
          dailyExpenses: response.data.dailyExpenses,
          expensesTotal: response.data.expensesTotal,
          previousTotalExpenses: response.data.previousTotalExpenses,
          previousTotalSales: response.data.previousTotalSales,
        };

        console.log("The bill data is:", bill);
        setBillTotal(totalAmount);
        setSuppname(supp.suplierName);
        setBillData(bill);
        setTableData(transformedData);
        setEditedTableData(transformedData);

        return response.data;
      } catch (error) {
        console.error("Error fetching bill data:", error);
        alert("Error fetching the bill data");
      }
    };
    fetchBillData();
  }, [supplierId, selectedDate]);

  useEffect(()=>{
    try{
      const fetchExpenseData=async()=>{
        console.log("The supp details are:",suppDetails)

        const expResponse = await axios.get(
          `http://localhost:8000/expenses/show/${supplierId}?date=${date}`
        ); 
        setExpenses((prevExpenses) => ({
          ...prevExpenses,
          Commission: Math.round((billTotal * suppDetails.commission) / 100),
          Discount: Math.round((billTotal * suppDetails.discount) / 100),
          Bazar: expResponse.data[0].bazar,
          Cartage: expResponse.data[0].cartage,
          Railway: expResponse.data[0].railway,
          Ice: expResponse.data[0].ice,
          Cooley: expResponse.data[0].cooley,
          TruckHire: expResponse.data[0].truckHire,
          AssoFee: expResponse.data[0].assoFee,
          Deposit: expResponse.data[0].deposit,
          Rebate: expResponse.data[0].rebate,
          OtherExpense: expResponse.data[0].otherExpense,
          Payment: expResponse.data[0].payment,
        }));
  
      }

      fetchExpenseData();

    }catch(error){
      console.error("Error fetching bill data:", error);
        alert("Error fetching the bill data");
    }
  },[supplierId, selectedDate,billTotal]);

  useEffect(() => {
    const totalExpenses = Object.entries(expenses)
      .filter(([key]) => !["Total", "Payment", "GrandTotal", "OtherExpense"].includes(key))
      .reduce((acc, [, value]) => acc + parseFloat(value || 0), 0);

    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      Total: totalExpenses,
      GrandTotal: totalExpenses + parseFloat(prevExpenses.Payment || 0) + parseFloat(prevExpenses.OtherExpense || 0),
    }));
  }, [
    expenses.Commission,
    expenses.Discount,
    expenses.Bazar,
    expenses.Cartage,
    expenses.Railway,
    expenses.Ice,
    expenses.Cooley,
    expenses.TruckHire,
    expenses.AssoFee,
    expenses.Deposit,
    expenses.Rebate,
    expenses.OtherExpense,
    expenses.Payment,
  ]);

  const handleExpenseChange = (e, expName) => {
    const { value } = e.target;
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [expName]: expName === "PaymentType" ? value : parseInt(value),
    }));
  };

  const editExpense = () => {
    setEditClicked(true);
  };

  const updateExpense = async () => {
    const updatedFishData=sanitizeData(editedTableData);
    console.log("The updated fish data is:",updatedFishData);
    try {
      const originalDataFormat =updatedFishData.map((row) => ({
        fishDetails: row.Particulars,
        totalpieces: row.Pieces,
        totalsaleweigth: row.Kgs, // Converting back to string if it was originally a string
        totalaveragerate: row.Rate, // Converting back to string if it was originally a string
      }));
    
      await axios.put(`http://localhost:8000/expenses/${supplierId}?date=${date}`, expenses, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      await axios.put(`http://localhost:8000/billing/updateBill/${supplierId}?date=${date}`, {
        transformedData:originalDataFormat,
        dailySales:billTotal
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("!!done update");
      setEditClicked(false);
    } catch (error) {
      console.error(error);
    }
  };

 
  const handleRowChange = (index, field, value) => {
    const updatedData = editedTableData.map((row, i) => {
      if (i === index) {
        // Convert the value to a number
        const numericValue = parseFloat(value);
        const updatedRow = { ...row, [field]: numericValue };
  
        // Recalculate the 'Rupees' value if 'Kgs' or 'Rate' is updated
        if (field === "Kgs" || field === "Rate") {
          const kgs = field === "Kgs" ? numericValue : parseFloat(updatedRow.Kgs);
          const rate = field === "Rate" ? numericValue : parseFloat(updatedRow.Rate);
          updatedRow.Rupees = kgs * rate;
        }
  
        return updatedRow;
      }
      return row;
    });
  
    console.log("The updatedData is:",updatedData);
    setEditedTableData(updatedData);

    const newBillTotal = updatedData.reduce((acc, curr) => acc + curr.Rupees, 0);
    console.log("The new total is:",newBillTotal);
    setBillTotal(newBillTotal);
  };


  const sanitizeData = (data) => {
    return data.map((row) => {
      return {
        ...row,
        Kgs: parseFloat(row.Kgs) || 0, // Ensure Kgs is a number, default to 0 if NaN
        Rate: parseFloat(row.Rate) || 0, // Ensure Rate is a number, default to 0 if NaN
        Rupees: parseFloat(row.Kgs) * parseFloat(row.Rate) || 0, // Recalculate Rupees
      };
    });
  };

  

  const formatCurrency = (value) => {
    if (value === undefined) {
      console.error("formatCurrency received undefined value");
      return ""; // Return a default value or handle the case appropriately
    }
    return value.toLocaleString("en-IN", {
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <>
      <div className="actionDiv">
        <button className="editButton" onClick={editExpense}>
          Edit
        </button>
        <button className="saveButton" onClick={updateExpense}>
          Save
        </button>
        <ReactToPrint trigger={() => <button>Print/Download</button>} content={() => componentRef.current} />
      </div>
      <div ref={componentRef} className="billMainDiv">
        <div className="billHeader">
          <h1>CLASSIC SEA FOODS</h1>
        </div>
        <div className="billInfoDiv">
          <div className="billInfo">
            <p>
              <span className="spanClass">VENDOR NAME:</span>
              {suppname}
            </p>
            <p>
              <span>Bill No - </span>
              {billData.billNumber}
            </p>
            <p>
              <span className="spanClass">Date:</span>
              {formattedDate}
            </p>
            <table className="boxesBillTable">
              <tr>
                <th>By Truck</th>
                <th>By Rail</th>
                <th>By Air</th>
                <th>Direct</th>
                <th>Balance</th>
                <th>Total Box</th>
              </tr>
              <tr>
                <td>{dailyBoxes.byTruck}</td>
                <td>{dailyBoxes.byRail}</td>
                <td>{dailyBoxes.byAir}</td>
                <td>{dailyBoxes.byDirect}</td>
                <td>{dailyBoxes.balance}</td>
                <td>{dailyBoxes.byTruck + dailyBoxes.byRail + dailyBoxes.byAir + dailyBoxes.byDirect + dailyBoxes.balance}</td>
              </tr>
            </table>
          </div>
        </div>
        <div className="billWrapper">
          <div className="billingTableDiv">
            <table className="bills">
              <thead>
                <tr>
                  <th className="serialCol">Sr.No.</th>
                  <th className="itemCol">Particulars</th>
                  <th className="piecesCol">Pieces</th>
                  <th className="weightCol">Kgs</th>
                  <th className="rateCol">Rate</th>
                  <th className="rupeeCol">Amount</th>
                </tr>
              </thead>
              <tbody>
                {editedTableData.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="fishNames">
                      {editClicked ? (
                        <input
                          type="text"
                          value={row.Particulars}
                          onChange={(e) => handleRowChange(index, "Particulars", e.target.value)}
                        />
                      ) : (
                        row.Particulars
                      )}
                    </td>
                    <td>
                      {editClicked ? (
                        <input
                          type="number"
                          value={row.Pieces}
                          onChange={(e) => handleRowChange(index, "Pieces", e.target.value)}
                        />
                      ) : (
                        row.Pieces
                      )}
                    </td>
                    <td>
                      {editClicked ? (
                        <input
                          type="number"
                          value={row.Kgs}
                          onChange={(e) => handleRowChange(index, "Kgs", e.target.value)}
                        />
                      ) : (
                        parseFloat(row.Kgs)
                      )}
                    </td>
                    <td>
                      {editClicked ? (
                        <input
                          type="number"
                          value={row.Rate}
                          onChange={(e) => handleRowChange(index, "Rate", e.target.value)}
                        />
                      ) : (
                        formatCurrency(row.Rate)
                      )}
                    </td>
                    <td>
                       { formatCurrency(row.Rupees)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="expenseDiv">
            <table className="expenseTable">
              <thead>
                <tr>
                  <th>Expenses</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(expenses).map(([key, value], index) => (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>
                      {editClicked &&
                      !["Total", "GrandTotal", "Commission", "Discount"].includes(key) ? (
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => handleExpenseChange(e, key)}
                        />
                      ) : (
                        formatCurrency(value)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="calculationDiv  printFooter">
          <table className="calcTable">
            <thead>
              <tr>
                <th>CREDIT</th>
                <th>DEBIT</th>
                <th>BALANCE</th>
              </tr>
              <tr>
                <td>{formatCurrency(billData.previousTotalSales + billTotal)}</td>
                <td>{formatCurrency(billData.previousTotalExpenses + expenses.GrandTotal)}</td>
                <td>{formatCurrency(billData.previousTotalSales - billData.previousTotalExpenses + (billTotal - expenses.GrandTotal))}</td>
              </tr>
            </thead>
          </table>
          <div className="dailyContents">
            <p>Total Sales: {formatCurrency(Math.round(billTotal))}</p>
            <p>Total Expenses: {formatCurrency(Math.round(expenses.GrandTotal))}</p>
            <p>Total Payable: {formatCurrency(Math.round(billTotal - expenses.GrandTotal))}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;
