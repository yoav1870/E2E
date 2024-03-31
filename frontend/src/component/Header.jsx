import React from 'react';
import logo from '../assets/images/logo.png'; 

const Header = () => {
  const headerStyle = {
    background: '#fff', 
    color: '#333', 
    padding: '10px 20px',
    textAlign: 'center', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
  };

  const logoStyle = {
    height: '50px',
    marginBottom: '10px', 
  };

  return (
    <header style={headerStyle}>
      <img src={logo} alt="Logo" style={logoStyle} />
      <h1>My Website Header</h1>
    </header>
  );
}

export default Header;
