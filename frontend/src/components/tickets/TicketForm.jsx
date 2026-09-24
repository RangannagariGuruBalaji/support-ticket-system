import React, { useState } from 'react';

const TicketForm = ({ onSubmit, submitting, error }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!subject.trim()) {
      setValidationError('Please enter a ticket subject.');
      return;
    }

    if (!description.trim()) {
      setValidationError('Please provide a description of your issue.');
      return;
    }

    onSubmit({ subject: subject.trim(), description: description.trim(), priority });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card">
      {(validationError || error) && (
        <div className="alert-error">
          ⚠️ {validationError || error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="subject">Ticket Subject *</label>
        <input
          id="subject"
          type="text"
          className="form-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief summary of the issue (e.g., Cannot access invoice)"
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="priority">Priority Level *</label>
        <select
          id="priority"
          className="form-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={submitting}
        >
          <option value="low">Low - General inquiry or feature request</option>
          <option value="medium">Medium - Normal issue impacting non-critical work</option>
          <option value="high">High - Urgent problem or critical service outage</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">Detailed Description *</label>
        <textarea
          id="description"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please provide full details, error messages, and steps to reproduce..."
          disabled={submitting}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={submitting}>
        {submitting ? 'Submitting Ticket...' : '🚀 Submit Ticket'}
      </button>
    </form>
  );
};

export default TicketForm;
