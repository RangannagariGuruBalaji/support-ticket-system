import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';

const TicketTable = ({ tickets, isAgent = false }) => (
  <div className="table-responsive glass-card" style={{ padding: '0' }}>
    <table className="ticket-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Subject</th>
          {isAgent && <th>Customer</th>}
          <th>Priority</th>
          <th>Status</th>
          <th>Created</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>#{ticket.id}</td>
            <td style={{ fontWeight: '600' }}>
              <Link to={`/tickets/${ticket.id}`}>{ticket.subject}</Link>
            </td>
            {isAgent && (
              <td>
                <div style={{ fontSize: '0.85rem' }}>{ticket.customer_name || `User #${ticket.user_id}`}</div>
                {ticket.email && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ticket.email}</div>}
              </td>
            )}
            <td>
              <PriorityBadge priority={ticket.priority} />
            </td>
            <td>
              <StatusBadge status={ticket.status} />
            </td>
            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {new Date(ticket.created_at).toLocaleDateString()}
            </td>
            <td>
              <Link to={`/tickets/${ticket.id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                Manage →
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TicketTable;
