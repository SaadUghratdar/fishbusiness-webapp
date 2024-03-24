// InputFields.js
import React from 'react';
import { useCustomersContext } from './CustomerContext';
import { initialState } from './customerReducer';
import '../styles/homePage.css'
const AddInputFields = () => {
  const {state, dispatch } = useCustomersContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;    
    dispatch({ type: 'UPDATE_INPUT', payload: { field: name, value } });
    let totalCost=0;
    if (name === 'weight' || name === 'rate') {
      const weight = parseFloat(state.inputValues.weight) ;
      const rate = parseInt(state.inputValues.rate);
      totalCost = weight * rate;
    }
    dispatch({ type: 'UPDATE_INPUT', payload: { field: 'total', value: totalCost.toFixed(2) } });
  };

  const generateRowId = () => {
    return state.rows.length > 0 ?state.rows[state.rows.length - 1].id + 1 : 1;
  };

  const handleAddRow = () => {
    const newRow = { id: generateRowId(), ...state.inputValues };
    if (Object.values(state.inputValues).some((value) => value === '')) {
      alert('Please fill in all fields before adding a new row.');
      return;
    }
    dispatch({ type: 'ADD_ROW', payload: newRow });
  };

  return (
    <div>
      {Object.keys(state.inputValues).map((fieldName) => (
        fieldName==='total'?
        <input
          key={fieldName}
          type='number'
          name={fieldName}
          value={(state.inputValues.weight)*(state.inputValues.rate)}
          onChange={handleInputChange}
          placeholder={fieldName.toUpperCase()}
        />
        :
        <input
          key={fieldName}
          type={(fieldName === 'weight' || fieldName === 'rate' || fieldName === 'total' || fieldName === 'lotNos'||fieldName === 'box' ) ? 'number' : 'text'}
          name={fieldName}
          value={(state.inputValues[fieldName]).toUpperCase()}
          onChange={handleInputChange}
          placeholder={fieldName.toUpperCase()}
        />)
      )}
      <button onClick={handleAddRow}>Add Row</button>
    </div>
  );
};

export default AddInputFields;
