import React, {useState,useEffect}  from 'react';
import axios from 'axios';
import './supp.css'
const MasterSupp = () => {
  const [suppInputs, setSuppInputs] = useState({ suppName: '', phoneNum: '', sales:'0'});
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/suplier/show');
        setSuppliers(response.data);
        
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);
  const handleAddSupplier = (e) => {
    e.preventDefault();
    // if (suppInputs.suppName.trim() !== '' && suppInputs.phoneNum !== '') {
      setSuppliers([...suppliers, suppInputs]);
      setSuppInputs({ suppName: '', phoneNum: '', });
    // } else {
    //   // Notify the user that all fields are required
    //   alert('Please fill in all fields');
    // }
  };

  return (
    <div class="scrollableTable">
    <div className="tableWrapper">
    <div className='dateDiv'>
        DATE
    </div>
    <div className="inputContainer">
      <form onSubmit={handleAddSupplier}>
        <input
          className='suppNameInput'
          type="text"
          placeholder="Supplier Name"
          value={suppInputs.suppName}
          onChange={(e) => setSuppInputs({ ...suppInputs, suppName: e.target.value })}
        />
        <input
          className='numberInput'
          type="number"
          placeholder="Phone Nos."
          value={suppInputs.phoneNum}
          onChange={(e) => setSuppInputs({ ...suppInputs, phoneNum: e.target.value })}
        />
        {/* <input
          className='salesInput'
          type="number"
          placeholder="Pieces"
          value={suppInputs.pieces}
          onChange={(e) => setSuppInputs({ ...suppInputs, pieces: e.target.value })}
        /> */}
        <button type="submit">ADD</button>
      </form>
    </div>
    
    <table className='supplierMasterTable'>
      <thead>
        <tr>
          <th className='suppCol'>Supplier</th>
          <th className='numCol'>Contact</th>
          <th className='salesCol'>Sales</th>
          <th className='actCol'>Action</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier, index) => (
          <tr key={index}>
            <td>{supplier.suppName}</td>
            <td>{supplier.phoneNum}</td>
            <td>{supplier.sales}</td>
            <td>
            <button type="submit">EDIT</button>
            <button type="submit">DELETE</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  </div>
  )
}

export default MasterSupp