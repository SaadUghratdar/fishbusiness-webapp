import React, { useState } from 'react';
import { FaHome, FaWpforms, FaDatabase, FaBars } from 'react-icons/fa';
import { IoHomeOutline } from 'react-icons/io5';
import { IoIosHome } from "react-icons/io";
import { IoReceiptSharp } from "react-icons/io5";
import { LiaReceiptSolid } from 'react-icons/lia';
import { IoFish } from "react-icons/io5";
import { ImHome } from "react-icons/im";
import { SiGoogleforms } from "react-icons/si";
import { NavLink } from 'react-router-dom';
import { FaUsers } from "react-icons/fa";
import { BsPersonBoundingBox } from "react-icons/bs";
const Sidebar = ({ children }) => {
    const[isOpen,setIsOpen]=useState(false);
    const toggle = () => setIsOpen(!isOpen);
  const menuitems = [
    {
      path: '/',
      name: 'Home',
      icon: <ImHome />,
    },
    {
      path: '/cashCounter',
      name: 'Cash Counter',
      icon: <SiGoogleforms />,
    },
    {
      path: '/suppliers',
      name: 'Suppliers',
      icon: <FaDatabase />,
    },
    {
      path: '/billing',
      name: 'Billing',
      icon: <IoReceiptSharp />,
    },
    {
      path: '/dailySuppliers',
      name: 'Daily Suppliers',
      icon: <FaUsers />,
    },
    {
      path:'/fishes',
      name:'Fishes',
      icon:<IoFish/>
    },
    {
      path:'/customers',
      name:'Customers',
      icon:<BsPersonBoundingBox />
    },
    {
      path:'/paypending',
      name:'Credits',
      icon:<SiGoogleforms />
    }
  ];

  return (
    <div style={{visibility:isOpen?"block":"none"}} className="containerSideBar" activeClassName="menuActive">
      <div style={{width:isOpen?"300px":"60px"}} className="sidebarDiv" >
        <div className="topSection">
          <h1  style={{display:isOpen?"block":"none"}} className="compLogo">LOGO</h1>
          <div style={{marginLeft:isOpen?"30px":"0px"}}className="toggleBars">
              <div className='inBars'><FaBars onClick={toggle}/></div>
          </div>
        </div>
        <div className="linkDiv">
        {menuitems.map((item, index) => (
          <NavLink to={item.path} key={index} className="link" activeClassName="active">
            <div className="icon">{item.icon}</div>
            <div style={{display:isOpen?"block":"none"}} className="link_text">{item.name}</div>
          </NavLink>
        ))}
        </div>
        
      </div>
      <main>  
        {children}</main>
    </div>
  );
};

export default Sidebar;
