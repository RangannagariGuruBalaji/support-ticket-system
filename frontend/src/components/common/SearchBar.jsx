import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = 'Search tickets by subject or description...' }) => (
  <div className="search-input-wrapper">
    <input
      type="text"
      className="form-input"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default SearchBar;
