import React from 'react';

import '../styles/dashboard.css';

const Navbar = ({
  title,
  onLogout,
}) => {

  return (

    <header className="navbar">

      <div className="navbar-left">

        <h1 className="navbar-title">
          {title}
        </h1>

      </div>



      <div className="navbar-right">

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </header>

  );

};

export default Navbar;