import React from 'react';

const PriorityBadge = ({ priority }) => {
  const p = (priority || 'medium').toLowerCase();
  return (
    <span className={`badge badge-priority-${p}`}>
      ▲ {p}
    </span>
  );
};

export default PriorityBadge;
