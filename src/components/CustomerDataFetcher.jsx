import React,{useState,useEffect} from 'react'
import { useCustomersContext } from './CustomerContext';
import axios from 'axios';
const CustomerDataFetcher = () => {
    const {state,dispatch}=useCustomersContext();
    useEffect(() => {
        const fetchCustomerData = async () => {
          try {
            const response = await axios.get('http://localhost:8000/cashcounter/show'); // Replace with your API endpoint
            //WE HAVE DESTRUCTURED THE INCOMING DATA 
            const tableData=response.data.map(data=>{
              return {
                id:data._id,
                supplierName: data.suplierId.suplierName,
                customerName: data.customerId.customerName,
                subCustomer:data.sunCustomerName,
                fishName:data.fishId.fishName,
                weight:data.kg,
                rate:data.rate,
                total: data.amount
              }
            });
            console.log(tableData);
            dispatch({type:'FETCH_CUSTOMER_DATA',payload:tableData}); // Dispatch action with fetched data
          } catch (error) {
            console.error('Error fetching customer data:', error);
          }
        };
    
        fetchCustomerData();
      }, [dispatch]); 
    return null;
}

export default CustomerDataFetcher