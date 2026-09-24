import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';

const TicketCard = ({ ticket }) => (
  <div className="glass-card glass-card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>#{ticket.id}</span>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />
      </div>
    </div>
    <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>{ticket.subject}</h3>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
      {ticket.description}
    </p>
    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Created {new Date(ticket.created_at).toLocaleDateString()}
      </span>
      <Link to={`/tickets/${ticket.id}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
        View Details →
      </Link>
    </div>
  </div>
);

export default TicketCard;
