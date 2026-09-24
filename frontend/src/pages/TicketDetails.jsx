import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTicketById, updateTicket } from '../services/ticketService';
import { getComments, addComment } from '../services/commentService';
import { getUsers } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);

  // Agent form edit states
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      setError('');
      const ticketRes = await getTicketById(id);
      if (ticketRes.success && ticketRes.data) {
        setTicket(ticketRes.data);
        setEditStatus(ticketRes.data.status);
        setEditPriority(ticketRes.data.priority);
        setEditAssignedTo(ticketRes.data.assigned_to || '');
      }

      const commentsRes = await getComments(id);
      if (commentsRes.success && Array.isArray(commentsRes.data)) {
        setComments(commentsRes.data);
      }

      if (user?.role === 'agent') {
        const usersRes = await getUsers('agent');
        if (usersRes.success && Array.isArray(usersRes.data)) {
          setAgents(usersRes.data);
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Forbidden: You do not have permission to view this ticket.');
      } else if (err.response && err.response.status === 404) {
        setError('Ticket not found.');
      } else {
        setError('Error loading ticket details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  const handleAgentUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdateSubmitting(true);
      const res = await updateTicket(id, {
        status: editStatus,
        priority: editPriority,
        assigned_to: editAssignedTo ? parseInt(editAssignedTo, 10) : null
      });
      if (res.success && res.data) {
        setTicket(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update ticket.');
    } finally {
      setUpdateSubmitting(false);
    }
  };

  const handleAddComment = async (commentText) => {
    try {
      setCommentSubmitting(true);
      const res = await addComment(id, commentText);
      if (res.success && res.data) {
        setComments(prev => [...prev, res.data]);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const backPath = user?.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard';

  if (loading) return <LoadingSpinner text="Loading ticket details..." />;
  if (error) return (
    <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <ErrorMessage message={error} />
      <Link to={backPath} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
        ← Return to Dashboard
      </Link>
    </div>
  );

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Ticket #{ticket.id}</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '0.2rem' }}>{ticket.subject}</h1>
        </div>
        <Link to={backPath} className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: user?.role === 'agent' ? '1fr 340px' : '1fr 300px', gap: '1.5rem' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Ticket Description Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Description</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: '1.7' }}>
              {ticket.description}
            </p>
          </div>

          {/* Ticket Discussion / Comments */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Discussion & Updates</h3>
            <CommentList comments={comments} />
            <CommentForm onSubmit={handleAddComment} submitting={commentSubmitting} />
          </div>
        </div>

        {/* Sidebar Info & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Ticket Meta Info Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Ticket Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Status</span>
                <StatusBadge status={ticket.status} />
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Customer</span>
                <strong style={{ color: 'var(--text-primary)' }}>{ticket.customer?.name || `User #${ticket.user_id}`}</strong>
                {ticket.customer?.email && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ticket.customer.email}</div>}
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Assigned Agent</span>
                <strong style={{ color: ticket.assigned_agent ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {ticket.assigned_agent ? ticket.assigned_agent.name : 'Unassigned'}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Created On</span>
                <span>{new Date(ticket.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Agent Management Panel */}
          {user?.role === 'agent' && (
            <div className="glass-card" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#c084fc', marginBottom: '1rem' }}>
                ⚙️ Agent Controls
              </h3>

              <form onSubmit={handleAgentUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label">Update Status</label>
                  <select className="form-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label">Update Priority</label>
                  <select className="form-select" value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label">Assign Agent</label>
                  <select className="form-select" value={editAssignedTo} onChange={(e) => setEditAssignedTo(e.target.value)}>
                    <option value="">-- Unassigned --</option>
                    {agents.map(ag => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.email})
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }} disabled={updateSubmitting}>
                  {updateSubmitting ? 'Saving Changes...' : 'Save Agent Changes'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
