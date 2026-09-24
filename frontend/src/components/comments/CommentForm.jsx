import React, { useState } from 'react';

const CommentForm = ({ onSubmit, submitting }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onSubmit(commentText.trim());
    setCommentText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
      <div className="form-group">
        <label className="form-label" htmlFor="newComment">Add Response / Comment</label>
        <textarea
          id="newComment"
          className="form-textarea"
          style={{ minHeight: '90px' }}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type your response or update here..."
          disabled={submitting}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
        disabled={submitting || !commentText.trim()}
      >
        {submitting ? 'Posting...' : '💬 Post Comment'}
      </button>
    </form>
  );
};

export default CommentForm;
