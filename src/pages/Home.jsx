import {React,memo} from 'react'
import '../styles/App.css';
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

export default memo(Home);