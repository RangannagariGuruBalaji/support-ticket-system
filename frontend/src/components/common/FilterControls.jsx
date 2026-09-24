import React from 'react';

const FilterControls = ({ statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, sortOption, setSortOption }) => (
  <div className="filter-group">
    {setStatusFilter && (
      <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
    )}

    {setPriorityFilter && (
      <select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    )}

    {setSortOption && (
      <select className="form-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="newest">Sort: Newest First</option>
        <option value="oldest">Sort: Oldest First</option>
        <option value="priority">Sort: Highest Priority</option>
      </select>
    )}
  </div>
);

export default FilterControls;
