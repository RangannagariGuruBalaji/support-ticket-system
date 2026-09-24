import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user?.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard'} className="navbar-brand">
          <div className="navbar-logo-icon">ST</div>
          <span>SupportDesk</span>
        </Link>

        {isAuthenticated && user && (
          <div className="navbar-links">
            <div className="user-badge">
              <span>{user.name}</span>
              <span className={`role-tag ${user.role}`}>{user.role}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
