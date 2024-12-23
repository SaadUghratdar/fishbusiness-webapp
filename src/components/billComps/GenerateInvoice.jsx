import React,{useState,useEffect} from 'react'
import axios from 'axios';
import './billingPage.css'

const GenerateInvoice = (supplierId,selectedDate) => {
  const emptyRows={Rupees:'',Particulars:'',Pieces:'',Kgs:'',Grams:'',Rate:''};
  const initialEmptyRows = Array(20).fill(emptyRows);
   const [tableData, setTableData] = useState(initialEmptyRows);
  console.log("The id",supplierId);
   useEffect((supplierId) => {
    const fetchBillData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/billing/${supplierId}`);
        console.log("The bill data is :", response.data);
        // Assuming response.data is the array of billing data
        // setTableData(response.data);
      } catch (error) {
        console.error('Error fetching bill data:', error);
      }
    };

    fetchBillData();
  }, [supplierId]);
  return (

 <div className='billingTableDiv'>
    <table className='bills'>
      <thead>
      <tr>
        <th className='rupeeCol'>Rupees</th>
        <th className='itemCol'>Particulars</th>
        <th className='piecesCol'>Pieces</th>
        <th className='weightCol'>Kgs</th>
        <th className='gramCol'>Grams</th>
        <th className='rateCol'>Rate</th>
      </tr>
      </thead>
      <tbody>
     {
      tableData.map((row, index) => (
        <tr key={index}>
          <td>{row.Rupees}</td>
          <td>{row.Particulars}</td>
          <td>{row.Pieces}</td>
          <td>{row.Kgs}</td>
          <td>{row.Grams}</td>
          <td>{row.Rate}</td>
        </tr>
      ))
    };
  </tbody>
    </table>
  </div>

  )
}

export default GenerateInvoice