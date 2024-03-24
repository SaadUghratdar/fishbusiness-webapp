import React, { useState }  from 'react'
import AddSupplier from '../components/AddSupplier'
const InputCounter = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [newSupplier, setNewSupplier] = useState({ name: '', id: '' });
  
    
  
    const handleAddSupplier = () => {
        setSuppliers([...suppliers, { ...newSupplier }]);
        setNewSupplier({ name: '', id: '' });
      };
      
      const handleSaveSupplier = (index) => {
       console.log('Saving supplier details:', suppliers[index]);
      };
    
      const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        setSuppliers((prevSuppliers) => {
          const updatedSuppliers = [...prevSuppliers];
          updatedSuppliers[index][name] = value;
          return updatedSuppliers;
        });
      };
  return (
    <div>
    
    <button onClick={handleAddSupplier}>ADD SUPPLIER</button>

    {suppliers.map((supplier, index) => (
      <><div key={index} style={{ display: 'flex', marginTop: '10px', backgroundColor: 'black', height: '50px' }}>

        <input
          type="text"
          placeholder="Supplier Name"
          name="name"
          value={supplier.name}
          onChange={handleInputChange} />
        <input
          type="text"
          placeholder="Supplier ID"
          name="id"
          value={supplier.id}
          onChange={handleInputChange} />


        <button onClick={handleSaveSupplier}>SAVE</button>
      </div><AddSupplier/></>
    ))}
  </div>
    
  )
}

export default InputCounter