import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../services/ticketService';
import TicketCard from '../components/tickets/TicketCard';
import TicketTable from '../components/tickets/TicketTable';
import SearchBar from '../components/common/SearchBar';
import FilterControls from '../components/common/FilterControls';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StatsCard from '../components/common/StatsCard';

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const fetchCustomerTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getTickets({
        status: statusFilter,
        priority: priorityFilter,
        search: searchTerm,
        sort: sortOption
      });
      if (res.success && Array.isArray(res.data)) {
        setTickets(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load support tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerTickets();
  }, [statusFilter, priorityFilter, searchTerm, sortOption]);

  const totalTickets = tickets.length;
  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const closedCount = tickets.filter(t => t.status === 'closed').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>My Support Tickets</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track and manage all your submitted help requests</p>
        </div>
        <Link to="/customer/create-ticket" className="btn btn-primary">
          ➕ Create New Ticket
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <StatsCard label="Total Tickets" value={totalTickets} icon="🎫" iconBg="rgba(99, 102, 241, 0.15)" iconColor="#6366f1" />
        <StatsCard label="Open Tickets" value={openCount} icon="🟢" iconBg="rgba(16, 185, 129, 0.15)" iconColor="#10b981" />
        <StatsCard label="In Progress" value={inProgressCount} icon="🟠" iconBg="rgba(245, 158, 11, 0.15)" iconColor="#f59e0b" />
        <StatsCard label="Closed Tickets" value={closedCount} icon="⚪" iconBg="rgba(100, 116, 139, 0.15)" iconColor="#94a3b8" />
      </div>

      {/* Filter & Controls */}
      <div className="controls-bar">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FilterControls
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('grid')}
            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            Table
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner text="Fetching your support tickets..." />
      ) : tickets.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Tickets Found</h3>
          <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            {searchTerm || statusFilter || priorityFilter
              ? 'No tickets match your active filter criteria. Try clearing search filters.'
              : "You haven't submitted any support tickets yet."}
          </p>
          <Link to="/customer/create-ticket" className="btn btn-primary">
            Submit Your First Ticket
          </Link>
        </div>
      ) : viewMode === 'table' ? (
        <TicketTable tickets={tickets} isAgent={false} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
