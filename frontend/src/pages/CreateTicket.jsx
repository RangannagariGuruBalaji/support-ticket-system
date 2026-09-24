import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTicket } from '../services/ticketService';
import TicketForm from '../components/tickets/TicketForm';

const CreateTicket = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (ticketData) => {
    try {
      setSubmitting(true);
      setError('');
      const res = await createTicket(ticketData);
      if (res.success && res.data) {
        navigate(`/tickets/${res.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Submit New Ticket</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Fill out the details below so our support agents can assist you</p>
        </div>
        <Link to="/customer/dashboard" className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <TicketForm onSubmit={handleCreate} submitting={submitting} error={error} />
    </div>
  );
};

export default CreateTicket;
