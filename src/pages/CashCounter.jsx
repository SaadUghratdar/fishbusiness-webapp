import React, { useState, useEffect,useRef } from "react";
import "../styles/cashcounter.css";
import ReactToPrint from "react-to-print";
import "../styles/App.css";
import axios from "axios";
const CashCounter = () => {
  const [groupedData, setGroupedData] = useState({});
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [counterData, setCounterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const componentRef = useRef();
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    // onDateChange(date)
  };
  useEffect(() => {
    const fetchCounter = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/cashcounter/show?date=${selectedDate}`
        );
        //WE HAVE DESTRUCTURED THE INCOMING DATA
        const tableData = response.data.map((data) => {
          return {
            id: data._id,
            time:data.time,
            supplierName: data.suplierId.suplierName,
            customerName: data.customerId.customerName,
            subCustomer: data.subName,
            fishName: data.fishId.fishName,
            weight: data.kg,
            rate: data.rate,
            total: data.amount,
          };
        });
        console.log("The data for cash counter is :", tableData);
        setCounterData(tableData);

        console.log(
          "The data for cash counter after setting is :",
          counterData
        );
        const result = tableData.reduce((groupedData, item) => {
          const { supplierName, fishName } = item;
          console.log("THE SUPLIER IS:", supplierName)

          // Initialize the supplier group if it doesn't exist
          if (!groupedData[supplierName]) {
            groupedData[supplierName] = {};
          }
          console.log("THE fish IS:", fishName)
          
          // Initialize the fish group within the supplier group if it doesn't exist
          if (!groupedData[supplierName][fishName]) {
            groupedData[supplierName][fishName] = [];
          }
        
          // Push the current item into the corresponding group
          groupedData[supplierName][fishName].push(item);
        
          return groupedData;
        }, {});
        
        setGroupedData(result);
        console.log("The grouped result is:", result);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounter();
  }, [selectedDate]);
  // const [expanded, setExpanded] = React.useState(false);

  // const handleChange = (panel) => (event, isExpanded) => {
  //   setExpanded(isExpanded ? panel : false);
  // };

  // const supplierNames = [
  //   {
  //     id: 'supp01',
  //     name: 'Krish'
  //   },
  //   {
  //     id: 'supp02',
  //     name: 'Saad'
  //   }
  // ];

  // return (
  // <>
  //   <Container disableGutters={true} className="mainDiv" >
  //     {supplierNames.map((supp, index) => (
  //       <Box key={supp.id} sx={{marginTop:'2rem',backgroundColor:' hsl(190, 20%, 58%,0.2)',padding:'10px',borderRadius:'7px'}}>
  //         <Accordion
  //           expanded={expanded === supp.name}
  //           onChange={handleChange(supp.name)}
  //         >
  //           <AccordionSummary
  //             expandIcon={<FaAngleDown />}
  //             aria-controls={`panel-${supp.name}-content`}
  //             id={`panel-${supp.name}-header`}
  //           >
  //            <h1>{supp.name} </h1>
  //           </AccordionSummary>
  //           <AccordionDetails>
  //               <AddSupplier />
  //           </AccordionDetails>
  //         </Accordion>
  //       </Box>
  //     ))}
  //   </Container>
  // </>
  // );
  const handleSupplierClick = (supplierName) => {
    setSelectedSupplier(supplierName);
  };
  
  const formatCurrency = (value) => {
    return value.toLocaleString("en-IN", {
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="mainContainer">
      <div className="counterDateDiv">
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
        <div className="printButtonDiv">
         <ReactToPrint trigger={() => <button>Print/Download</button>} content={() => componentRef.current} />
        </div>

      </div>
      <div style={{ display: 'flex' }}>
      <aside className="supplier-sidebar">
        <div className="supplierAsideDiv"><h1>Suppliers</h1></div>
        <ul className="supplier-list">
          {Object.keys(groupedData).map((supplier) => (
            <li key={supplier} onClick={() => handleSupplierClick(supplier)}>
              {supplier?supplier: ""}
            </li>
          ))}
        </ul>
      </aside>
      <main style={{ flex: 1, padding: '10px' }}>
        {selectedSupplier && groupedData[selectedSupplier]? (
          <>
          <div  className="detailsMainDiv" ref={componentRef} >
            <div className="summDetailsDiv">
            <h3> {selectedSupplier}</h3>
            <h3>{selectedDate}</h3>
            </div>
            {Object.entries(groupedData[selectedSupplier]).map(([fishName, items]) => {
              // Calculate the sum of totals for the current fish group
              const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
              const totalWeight=items.reduce((sum,item)=>sum+item.weight,0);
              return (
                <table key={fishName}>
                  <thead>
                    <tr>
                      <th colSpan="6" style={{ borderBottom: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                        {fishName}
                      </th>
                    </tr>
                    <tr>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ccc'}} className="time">Time</th>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>Customer Name</th>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>Sub Customer</th>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ccc' }} className="weight">Weight</th>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ccc' }} className="rate">Rate</th>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ccc' }} className="total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.time}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.customerName}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.subCustomer || '-'}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.weight}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.rate}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.total}</td>
                      </tr>
                    ))}
                 
                    <tr>
                      <td colSpan="3" style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #ccc'}}>TOTAL</td>
                      <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>{formatCurrency(totalWeight)}</td>
                      <td></td>
                      <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>{formatCurrency(totalAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              );
            })}
            </div>
          </>
        ) : (
          <p>Please select a supplier to see the fish data.</p>
        )}
      </main>
    </div>
    </div>
  );
};

export default CashCounter;
