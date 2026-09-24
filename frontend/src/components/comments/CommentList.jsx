import React from 'react';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        💬 No comments or updates yet. Be the first to leave a comment!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            background: comment.user_role === 'agent' ? 'rgba(168, 85, 247, 0.08)' : 'rgba(15, 23, 42, 0.6)',
            border: `1px solid ${comment.user_role === 'agent' ? 'rgba(168, 85, 247, 0.25)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{comment.user_name || 'User'}</span>
              <span className={`role-tag ${comment.user_role}`}>{comment.user_role}</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
            {comment.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
