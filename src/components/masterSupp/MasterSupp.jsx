import React, {useState }  from 'react';
import './supp.css'
const MasterSupp = () => {
  const [suppInputs, setSuppInputs] = useState({ suppName: '', phoneNum: '', sales:''});
  const [suppliers, setSuppliers] = useState([]);

  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (suppInputs.suppName.trim() !== '' && suppInputs.phoneNum !== '') {
      setSuppliers([...suppliers, suppInputs]);
      setSuppInputs({ suppName: '', phoneNum: '', });
    } else {
      // Notify the user that all fields are required
      alert('Please fill in all fields');
    }
  };

  return (
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
        <input
          className='piecesInput'
          type="number"
          placeholder="Pieces"
          value={suppInputs.pieces}
          onChange={(e) => setSuppInputs({ ...suppInputs, pieces: e.target.value })}
        />
        <button type="submit">ADD</button>
      </form>
    </div>
    
    <table className='supplierTable'>
      <thead>
        <tr>
          <th className='suppCol'>Supplier</th>
          <th className='boxCol'>Contact</th>
          <th className='pieceCol'>Pieces</th>
          <th className='actCol'>Action</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier, index) => (
          <tr key={index}>
            <td>{supplier.suppName}</td>
            <td>{supplier.phoneNum}</td>
            <td>{supplier.pieces}</td>
            <td>
            <button type="submit">EDIT</button>
            <button type="submit">DELETE</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default MasterSupp