import React from 'react'
import { CustomerProvider } from '../components/CustomerContext'
import AddInputFields from '../components/AddInputFields'

import AddCustomer from '../components/AddCustomer'
import '../styles/homePage.css'
const Home = () => {
  
  
  return (
      <div className='container'>
        <div className='table-container'>
          <AddCustomer />
        </div>
      </div>
  )
}

export default Home