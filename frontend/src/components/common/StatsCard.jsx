import React from 'react';

const StatsCard = ({ label, value, icon, iconBg = 'rgba(99, 102, 241, 0.15)', iconColor = '#6366f1' }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: iconBg, color: iconColor }}>
      {icon}
    </div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default StatsCard;
