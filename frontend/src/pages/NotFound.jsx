import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  const homePath = user?.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '440px', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          The page or support resource you are looking for does not exist or has been moved.
        </p>
        <Link to={homePath} className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
