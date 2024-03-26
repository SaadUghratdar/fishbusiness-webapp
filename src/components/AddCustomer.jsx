//This component is used to add customer to cash Counter which is rendered from the home page

import React,{useState,useEffect} from 'react'
import { useCustomersContext } from './CustomerContext';
import '../styles/homePage.css'

// import AddInputFields from './AddInputFields.jsx'
import { initialState } from './customerReducer';
const AddCustomer = () => {
  const {state,dispatch}=useCustomersContext();
  const [counterInputs,setCounterInputs]=useState({suppName:'',custName:'',subName:'',fishName:'',weight:'',rate:''})
  const [editIndex, setEditIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});
 
  
  //This is used to calculate the TOTALCOUNTER whenever the state changes
  useEffect(() => {
      dispatch({ type: 'UPDATE_COUNTER_TOTAL' });
     }, [state.rows])
  ;


  //To add the rows and set the edited index to 0
  const handleAddRow=async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/cashcounter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(counterInputs),
      });

      if (!response.ok) {
        throw new Error('Failed to add customer');
      }

      // const newCustomer = await response.json();

      // // Dispatch action to update local state with the new customer
      // dispatch({ type: 'ADD', payload: newCustomer });

      // Clear the form for next entry
      setCounterInputs({ suppName: '', custName: '', subName: '', fishName: '', weight: '', rate: '' });
    } catch (error) {
      console.error('Error adding customer:', error);
      // Handle errors appropriately, e.g., display error message to user
    }
  };
  //To delete the row
  const handleDeleteRow = (id) => {
    dispatch({ type: 'DELETE_ROW', payload: id });
  };
  
  //To set the editedIndex and EditedRow
  const handleEditRow = (index, row) => {
    setEditIndex(index);
    setEditedRow({ ...row });
  };
  
  //To save the changes made in the rows 
  const handleSaveRow = (id) => {
    dispatch({ type: 'SAVE_ROW', payload: { id, updatedRow: editedRow } });
    setEditIndex(null);
    setEditedRow({});
  };

  //To set the changed value and set the TOTAL for the row
  const handleChange = (e, columnName) => {
    const { value } = e.target;
    console.log("event Value",e.target.value);
      setEditedRow(prevState => ({
        ...prevState,
        [columnName]: value,
      }));
      if (columnName === 'weight' || columnName === 'rate') {
        const weight = parseFloat(columnName === 'weight' ? value : editedRow.weight) || 0;
        const rate = parseFloat(columnName === 'rate' ? value : editedRow.rate) || 0;
        const total = (weight * rate).toFixed(2);
        
        setEditedRow(prevState => ({
          ...prevState,
          total: total,
        }));
      }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
  
    });
};

  
  return (
    <>
    <div className='cardContainerDiv'>
      <div className="counterCard">
        <h3>Counter Total</h3>
        <h1> {formatCurrency(state.counterTotal)}</h1>
      </div>
      <div className='cashCard'>
      <h3>Cash Total</h3>
      <h1>{formatCurrency(state.cashTotal)}</h1>
      </div>
    </div>
    <div className='counterInputContainer'>
      <form onSubmit={handleAddRow}>
          <input
             type="text"
             className='suppInput'
             placeholder='Supplier'
             value={counterInputs.supplierName}
             onChange={(e) => setCounterInputs({...counterInputs,suppName : e.target.value})}
            />
          <input
              type="text"
              className='custInput'
              placeholder='Customer'
              value={counterInputs.customerName}
              onChange={(e) =>setCounterInputs({...counterInputs,custName : e.target.value})}
           />
          <input
              type="text"
              className='subInput'
              placeholder='SubCustomer'
              value={counterInputs.subCustomer}
              onChange={(e) => setCounterInputs({...counterInputs,subName : e.target.value})}
          />
           <input
               type="text"
               className='fishInput'
               placeholder='Fish'
               value={counterInputs.fishName}
               onChange={(e) => setCounterInputs({...counterInputs,fishName : e.target.value})}
           />
           <input
              type="number"
              className='weightInput'
              placeholder='Weight'
              value={counterInputs.weight}
              onChange={(e) => setCounterInputs({...counterInputs,weight : e.target.value})}
            />
            <input
              type="number"
              className='rateInput'
              placeholder='Rate'
              value={counterInputs.rate}
              onChange={(e) => setCounterInputs({...counterInputs,rate : e.target.value})}
            />

            <button type='submit'>Add Row</button>
      </form>
    </div>
    <table>
      <thead>
        <tr>
          {/* <th>Row ID</th> */}
          <th>Supplier</th>
          <th>Customer</th>
          <th>SubCustomer</th>
          <th>Fish Type</th>
          {/* <th>Lot Nos.</th>
          <th>Boxes</th> */}
          <th className='weightCol'>Weight</th>
          <th className='rateCol'>Rate</th>
          <th>Total</th>
          {/* <th className='payCol'>Payment</th> */}
          <th className='lastCol'>Action</th>
        </tr>
      </thead>
      <tbody>
        
          {state.rows.map((row,index)=>(
            <tr key={row.id}>
              <td> {editIndex===index? (
                  <input
                    type="text"
                    value={editedRow.supplierName}
                    onChange={(e) => handleChange(e,'supplierName')}
                  />
                ) : (
                
                row.supplierName
 
                )}
              </td>
              <td>{editIndex===index? (
                  <input
                    type="text"
                    value={editedRow.customerName}
                    onChange={(e) => handleChange(e,'customerName')}
                  />
                ) : (
                  row.customerName
                )}
              </td>
              <td> {editIndex===index? (
                  <input
                    type="text"
                    value={editedRow.subCustomer}
                    onChange={(e) => handleChange(e, 'subCustomer')}
                  />
                ) : (
                  row.subCustomer
                )}
              </td>
              <td> {editIndex===index? (
                  <input
                    type="text"
                    value={editedRow.fishName}
                    onChange={(e) => handleChange(e, 'fishName')}
                  />
                ) : (
                  row.fishName
                )}
              </td>
              {/* <td> {editIndex===index? (
                  <input
                    type="number"
                    value={editedRow.lotNos}
                    onChange={(e) => handleChange(e, 'lotNos')}
                  />
                ) : (
                  row.lotNos
                )}
              </td>
              <td> {editIndex===index? (
                  <input
                    type="number"
                    value={editedRow.box}
                    onChange={(e) => handleChange(e, 'box')}
                  />
                ) : (
                  row.box
                )}
              </td> */}
              <td> {editIndex===index? (
                  <input
                    type="number"
                    value={editedRow.weight}
                    onChange={(e) => handleChange(e, 'weight')}
                  />
                ) : (
                  row.weight
                )}
              </td>
              <td>
              {editIndex===index? (
                  <input
                    type="number"
                    value={editedRow.rate}
                    onChange={(e) => handleChange(e, 'rate') }
                  />
                ) : (
                  row.rate
                )}
              </td>
              <td>{editIndex===index? (
                  <input
                    type="number"
                    value={editedRow.rate*editedRow.weight}
                    onChange={(e) => handleChange(e,'total')}
                  />
                ) : (
                 row.total
                )}
              </td>
              {/* <td>
              {editIndex===index ? (
                    <select
                        value={editedRow.paymentType}
                        onChange={(e) => handleChange(e, 'paymentType')}
                    >
                         <option value="Select">Select</option>
                        <option value="Credit">Credit</option>
                        <option value="Cash">Cash</option>
                    </select>
                ) : (
                    row.paymentType
                )}
              </td> */}
              <td>
                {editIndex === index ? (
                  <button className='saveButton' onClick={() => handleSaveRow(row.id)}>Save</button>
                ) : (
                  <>
                    <button className='editButton' onClick={() => handleEditRow(index, row)}>Edit</button>
                    <button className='deleteButton' onClick={() => handleDeleteRow(row.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
    
        </tbody>
      </table>
      </>
  )
  }


export default AddCustomer