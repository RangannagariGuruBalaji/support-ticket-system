import React from 'react';

const StatusBadge = ({ status }) => {
  const formattedStatus = (status || 'open').replace('_', ' ');
  return (
    <span className={`badge badge-${status || 'open'}`}>
      ● {formattedStatus}
    </span>
  );
};

export default StatusBadge;
