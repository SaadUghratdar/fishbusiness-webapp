import React,{useContext,useReducer,createContext,useState} from 'react'
import { initialState } from './customerReducer';
import customerReducer from './customerReducer';
import CustomerDataFetcher from './CustomerDataFetcher';
const CustomersContext=createContext(initialState)

export function CustomerProvider({children, selectedDate}){
    
    const [state,dispatch]=useReducer(
        customerReducer,
        initialState
    );

  
  return (
    <CustomersContext.Provider value={{state,dispatch}} >
        {/* <CustomerDataFetcher date={selectedDate} /> */}
        {children}
    </CustomersContext.Provider>
  )
}


// const customersReducer=(customers,action)=>{
//      switch(action.type){
//         case 'ADD' :
//             return{...customers,
//                 rows:[...customers.rows,{...action.payload,isEditing:false}],
                
//             };
//         case 'UPDATE_INPUT':
//             return {
//                 ...customers,
//                 inputValues: { ...customers.inputValues, [action.payload.field]: action.payload.value },
//             };
//         case 'UPDATE_ROW':
//             return {
//                 ...customers,
//                 rows: customers.rows.map((row) =>
//                      row.id === action.payload.id ? { ...row, isEditing: !row.isEditing } : row
//                 ),
//             };
//         case 'DELETE_ROW':
//             return {
//                 ...customers,
//                 rows: customers.rows.filter((row) => row.id !== action.payload),
//             };
//         case 'SAVE_ROW':
//             return {
//                   ...customers,
//                   rows: customers.rows.map((row) =>
//                     row.id === action.payload.id ? { ...row, isEditing: false } : row
//                   ),
//             };
//         default:
//             return customers;
//      }

//  }

export const useCustomersContext=()=>{
    const context=useContext(CustomersContext);
    if (!context) {
        throw new Error('useCustomersContext must be used within a TableProvider');
      }
    return context;
}
