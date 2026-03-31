import React, { useState, useCallback } from 'react';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import './TaskModal.css';

const PRIORITY_COLOR: Record<string, string> = {
  high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)'
};

interface Props { task: Task; onClose: () => void; }

const TaskModal: React.FC<Props> = ({ task, onClose }) => {
  const { addComment, state } = useApp();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await addComment(task.id, comment.trim());
      setComment('');
    } finally {
      setSubmitting(false);
    }
  }, [comment, task.id, addComment]);

  const currentTask = state.tasks.find(t => t.id === task.id) || task;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={currentTask.title}>
        <div className="modal__header">
          <div className="modal__title-row">
            <span className="modal__priority" style={{ color: PRIORITY_COLOR[currentTask.priority] }}>
              ● {currentTask.priority}
            </span>
            <span className={`modal__status modal__status--${currentTask.status}`}>{currentTask.status}</span>
          </div>
          <h2 className="modal__title">{currentTask.title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal__body">
          <div className="modal__desc">{currentTask.description}</div>

          <div className="modal__meta">
            <div className="modal__meta-item">
              <span className="modal__meta-label">Assignee</span>
              <div className="modal__meta-avatar">{state.user?.avatar || '?'}</div>
            </div>
            <div className="modal__meta-item">
              <span className="modal__meta-label">Due Date</span>
              <span className="modal__meta-val">{currentTask.dueDate}</span>
            </div>
            <div className="modal__meta-item">
              <span className="modal__meta-label">Created</span>
              <span className="modal__meta-val">{currentTask.createdAt}</span>
            </div>
          </div>

          <div className="modal__comments-section">
            <h4 className="modal__comments-title">
              Comments <span className="modal__comments-count">{currentTask.comments.length}</span>
            </h4>

            <div className="modal__comments">
              {currentTask.comments.length === 0 && (
                <p className="modal__no-comments">No comments yet. Be the first!</p>
              )}
              {currentTask.comments.map(c => (
                <div key={c.id} className="comment slide-in">
                  <div className="comment__avatar">{c.userName.split(' ').map(n => n[0]).join('')}</div>
                  <div className="comment__body">
                    <div className="comment__header">
                      <span className="comment__name">{c.userName}</span>
                      <span className="comment__date">{c.createdAt}</span>
                    </div>
                    <p className="comment__text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form className="comment-form" onSubmit={handleSubmit}>
              <div className="comment__avatar comment__avatar--me">{state.user?.avatar}</div>
              <div className="comment-form__input-wrap">
                <textarea
                  className="comment-form__input"
                  placeholder="Add a comment…"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={2}
                  onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(e as any); }}
                />
                <button className="comment-form__submit" type="submit" disabled={!comment.trim() || submitting}>
                  {submitting ? '…' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
