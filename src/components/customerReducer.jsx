
import { v4 as uuidv4 } from 'uuid';


//The initialState of the table
export const initialState = {
    counterTotal:0,
    cashTotal:0,
    rows:[],
    //  inputValues: {
    //   rowId:'',
    //   supplierName: '',
    //   customerName: '',
    //   subCustomer: '',
    //   fishName: '',
    //   lotNos:'',
    //   box:'',
    //   weight: '',
    //   rate: '',
    //   total: '',
    // },
};

//The main reducer function to change the state according to the dispatch type
const customerReducer=(state,action)=>{
    switch(action.type){
       case 'ADD' :
        console.log('in add action',action.payload);
           return{...state,
               rows:[
                {
                id:uuidv4(), 
                supplierName:action.payload.suppName,
                customerName: action.payload.custName,
                subCustomer: action.payload.subName,
                fishName: action.payload.fishName,
                weight: action.payload.weight,
                rate: action.payload.rate,
                total: '',
               },...state.rows,],
            };
        
       case 'FETCH_CUSTOMER_DATA':
           return{
               ...state,
               rows:action.payload,
           };  
           
       case 'SAVE_ROW':
           return {
               ...state,
               rows: state.rows.map(row => {
                if (row.id === action.payload.id) {
                  return { ...row, ...action.payload.updatedRow };
                }
                return row;
              }),
           };


       case 'DELETE_ROW':
           return {
               ...state,
               rows: state.rows.filter((row) => row.id !== action.payload),
           };

      
        case 'UPDATE_TOTAL':
            return {
                ...state,
                rows: state.rows.map(row => {
                    if (row.id === action.payload.id) {
                      const weight = parseFloat(action.payload.updatedRow.weight) || 0;
                      const rate = parseFloat(action.payload.updatedRow.rate) || 0;
                      const total = (weight * rate).toFixed(1);
                      return { ...row, total };
                    }
                    return row;
                  }),
            };
        case 'UPDATE_COUNTER_TOTAL':
              // Calculate the sum of the total field for each row
           const totalSum = state.rows.reduce((accumulator, row) => accumulator + parseFloat(row.total || 0), 0);
           const cashSum = state.rows.reduce((accumulator, row) => {
            if (row.customerName === 'Cash') {
                return accumulator + parseFloat(row.total || 0);
            }
                 return accumulator;
            }, 0);
            return {
                ...state,
                counterTotal: totalSum,
                cashTotal:cashSum,
            };
          

         
       default:
           return state;
    }

}
export default customerReducer