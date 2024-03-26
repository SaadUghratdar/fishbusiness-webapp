import React, { useContext, useState,useEffect} from 'react';
import './suppStyle.css';
import axios from 'axios';

const SuppliersTable = () => {
  const [suppInputs, setSuppInputs] = useState({ suppName: '', boxes: '', pieces: '' });
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/suplierentry/show');
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
    // if (suppInputs.suppName.trim() !== '' && suppInputs.boxes !== '' && suppInputs.pieces !== '') {
      setSuppliers([suppInputs,...suppliers]);
      setSuppInputs({ suppName: '', boxes: '', pieces: '' });
    // } else {
    //   // Notify the user that all fields are required
    //   alert('Please fill in all fields');
    // }
  };

  return (
    <>
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
              className='boxesInput'
              type="number"
              placeholder="Boxes"
              value={suppInputs.boxes}
              onChange={(e) => setSuppInputs({ ...suppInputs, boxes: e.target.value })}
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
              <th className='boxCol'>Boxes</th>
              <th className='pieceCol'>Pieces</th>
              <th className='actCol'>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={index}>
                <td>{supplier.suppName}</td>
                <td>{supplier.boxes}</td>
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
      </div>
    </>
  );
};

export default SuppliersTable;
