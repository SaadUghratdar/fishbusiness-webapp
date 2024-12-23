import React from 'react';
import Sidebar from './components/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CashCounter from './pages/CashCounter.jsx';
import Master from './pages/Master.jsx';
import Billing from './pages/Billing.jsx';
import Suppliers from './pages/Suppliers.jsx'
import Fishes from './pages/Fishes';
import Customers from './pages/Customers';
import PayPending from './pages/PayPending';
import { CustomerProvider } from './components/CustomerContext';
import GenerateInvoice from './components/billComps/GenerateInvoice';
import InvoicePage from './pages/InvoicePage';
import CustomerCredit from './pages/CustomerCredit'


function App() {
  return (
    <BrowserRouter>
      <Sidebar>
        <CustomerProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cashCounter" element={<CashCounter />} />
            <Route path="/suppliers" element={<Master />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/dailySuppliers" element={<Suppliers />} />
            <Route path="/fishes" element={<Fishes />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/paypending" element={<PayPending />} />
            <Route path="/invoice/:supplierId/:selectedDate" element={<InvoicePage/>} />
            <Route path="/creditDetails/:customerId" element={<CustomerCredit/>}/>
          </Routes>
        </CustomerProvider>
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
