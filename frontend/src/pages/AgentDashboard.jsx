import React, { useState, useEffect } from 'react';
import { getTickets, getTicketStats } from '../services/ticketService';
import TicketTable from '../components/tickets/TicketTable';
import SearchBar from '../components/common/SearchBar';
import FilterControls from '../components/common/FilterControls';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StatsCard from '../components/common/StatsCard';

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, closed: 0, high_priority: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const fetchAgentDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const [ticketsRes, statsRes] = await Promise.all([
        getTickets({
          status: statusFilter,
          priority: priorityFilter,
          search: searchTerm,
          sort: sortOption
        }),
        getTicketStats()
      ]);

      if (ticketsRes.success && Array.isArray(ticketsRes.data)) {
        setTickets(ticketsRes.data);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load support agent dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentDashboard();
  }, [statusFilter, priorityFilter, searchTerm, sortOption]);

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Support Agent Portal</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Overview of customer support queue, ticket assignments, and priority requests</p>
      </div>

      {/* Real-time Ticket Metrics */}
      <div className="stats-grid">
        <StatsCard label="Total Tickets" value={stats.total} icon="📊" iconBg="rgba(99, 102, 241, 0.15)" iconColor="#6366f1" />
        <StatsCard label="Open Queue" value={stats.open} icon="🟢" iconBg="rgba(16, 185, 129, 0.15)" iconColor="#10b981" />
        <StatsCard label="In Progress" value={stats.in_progress} icon="🟠" iconBg="rgba(245, 158, 11, 0.15)" iconColor="#f59e0b" />
        <StatsCard label="Closed Tickets" value={stats.closed} icon="⚪" iconBg="rgba(100, 116, 139, 0.15)" iconColor="#94a3b8" />
        <StatsCard label="High Priority" value={stats.high_priority} icon="🔥" iconBg="rgba(239, 68, 68, 0.15)" iconColor="#ef4444" />
      </div>

      {/* Search and Filters */}
      <div className="controls-bar">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search tickets by subject, description or customer..." />
        <FilterControls
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner text="Fetching support tickets database..." />
      ) : tickets.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">📥</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Tickets Found</h3>
          <p style={{ fontSize: '0.88rem' }}>No tickets match your active filter parameters.</p>
        </div>
      ) : (
        <TicketTable tickets={tickets} isAgent={true} />
      )}
    </div>
  );
};

export default AgentDashboard;
