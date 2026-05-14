import React from 'react';

import {
  NavLink,
} from 'react-router-dom';

import '../styles/dashboard.css';

const Sidebar = () => {

  return (

    <div className="sidebar">

      <h2 className="sidebar-logo">
        CRISPII ADMIN
      </h2>



      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? 'sidebar-btn active'
            : 'sidebar-btn'
        }
      >
        Dashboard
      </NavLink>



      <NavLink
        to="/products"
        className={({ isActive }) =>
          isActive
            ? 'sidebar-btn active'
            : 'sidebar-btn'
        }
      >
        Products
      </NavLink>

    </div>

  );

};

export default Sidebar;