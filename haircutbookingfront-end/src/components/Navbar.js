import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isCustomer } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <h2>💈 Sweets Barber</h2>
          </Link>
        </div>
        
        <div className="nav-links">
          {user ? (
            <>
              {/* Customer Navigation */}
              {isCustomer && (
                <>
                  <Link 
                    to="/home" 
                    className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/services" 
                    className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
                  >
                    Services
                  </Link>
                  <Link 
                    to="/book" 
                    className={`nav-link ${location.pathname === '/book' ? 'active' : ''}`}
                  >
                    Book Now
                  </Link>
                  <Link 
                    to="/bookings" 
                    className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}
                  >
                    My Appointments
                  </Link>
                </>
              )}
              
              {/* Admin Navigation */}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  Admin Dashboard
                </Link>
              )}
              
              <span className="nav-user">Hello, {user.email}</span>
              <button onClick={handleLogout} className="nav-logout">Logout</button>
            </>
          ) : (
            /* Public Navigation */
            <>
              <Link 
                to="/home" 
                className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
              >
                Services
              </Link>
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;