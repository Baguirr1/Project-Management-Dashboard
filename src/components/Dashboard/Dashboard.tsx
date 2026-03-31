import React, { useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import './Dashboard.css';

const Skeleton: React.FC<{ width?: string; height?: string }> = ({ width = '100%', height = '20px' }) => (
  <div className="skeleton" style={{ width, height }} />
);

const MetricCard: React.FC<{
  label: string; value: number | undefined; icon: string;
  color: string; loading: boolean; suffix?: string;
}> = React.memo(({ label, value, icon, color, loading, suffix = '' }) => (
  <div className="metric-card fade-in" style={{ '--card-accent': color } as React.CSSProperties}>
    <div className="metric-card__top">
      <span className="metric-card__icon" style={{ color }}>{icon}</span>
      <span className="metric-card__label">{label}</span>
    </div>
    {loading ? (
      <Skeleton width="60px" height="36px" />
    ) : (
      <div className="metric-card__value">{value}{suffix}</div>
    )}
    <div className="metric-card__bar" style={{ '--bar-color': color } as React.CSSProperties} />
  </div>
));

const ProjectRow: React.FC<{ project: { id: string; name: string; progress: number; color: string; status: string; taskCount: number } }> = React.memo(({ project }) => (
  <div className="proj-row fade-in">
    <div className="proj-row__dot" style={{ background: project.color }} />
    <span className="proj-row__name">{project.name}</span>
    <span className={`proj-row__status proj-row__status--${project.status}`}>{project.status}</span>
    <div className="proj-row__track">
      <div className="proj-row__fill" style={{ width: `${project.progress}%`, background: project.color }} />
    </div>
    <span className="proj-row__pct">{project.progress}%</span>
  </div>
));

const Dashboard: React.FC = () => {
  const { state, loadMetrics, loadProjects, setView } = useApp();

  useEffect(() => {
    if (!state.metrics) loadMetrics();
    if (state.projects.length === 0) loadProjects();
  }, [loadMetrics, loadProjects, state.metrics, state.projects.length]);

  const topProjects = useMemo(
    () => [...state.projects].sort((a, b) => b.progress - a.progress).slice(0, 5),
    [state.projects]
  );

  const metrics = [
    { label: 'Total Projects', value: state.metrics?.totalProjects, icon: '◫', color: 'var(--accent)' },
    { label: 'Total Tasks', value: state.metrics?.totalTasks, icon: '☑', color: 'var(--info)' },
    { label: 'Completed', value: state.metrics?.completedTasks, icon: '✓', color: 'var(--success)' },
    { label: 'Overdue', value: state.metrics?.overdueTasks, icon: '⚠', color: 'var(--danger)' },
  ];

  return (
    <div className="dashboard">
      <section className="dashboard__metrics">
        {metrics.map(m => (
          <MetricCard key={m.label} {...m} loading={state.loading.metrics} />
        ))}
      </section>

      <div className="dashboard__body">
        <section className="dashboard__section">
          <div className="section-header">
            <h3 className="section-title">Project Progress</h3>
            <button className="section-link" onClick={() => setView('projects')}>View all →</button>
          </div>

          {state.loading.projects ? (
            <div className="proj-list">
              {[1, 2, 3, 4].map(i => <div key={i} style={{ marginBottom: 4 }}><Skeleton height="44px" /></div>)}
            </div>
          ) : (
            <div className="proj-list">
              {topProjects.map(p => <ProjectRow key={p.id} project={p} />)}
            </div>
          )}
        </section>

        <section className="dashboard__section">
          <div className="section-header">
            <h3 className="section-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="qa-btn" onClick={() => setView('kanban')}>
              <span className="qa-btn__icon">⊞</span>
              <span className="qa-btn__label">Open Kanban</span>
              <span className="qa-btn__desc">Drag & drop tasks</span>
            </button>
            <button className="qa-btn" onClick={() => setView('projects')}>
              <span className="qa-btn__icon">◫</span>
              <span className="qa-btn__label">Browse Projects</span>
              <span className="qa-btn__desc">Search & filter</span>
            </button>
          </div>

          <div className="section-header" style={{ marginTop: 24 }}>
            <h3 className="section-title">Status Breakdown</h3>
          </div>
          <div className="status-breakdown">
            {[
              { label: 'Active', count: state.projects.filter(p => p.status === 'active').length, color: 'var(--success)' },
              { label: 'On Hold', count: state.projects.filter(p => p.status === 'on-hold').length, color: 'var(--warning)' },
              { label: 'Completed', count: state.projects.filter(p => p.status === 'completed').length, color: 'var(--accent)' },
            ].map(s => (
              <div key={s.label} className="status-item">
                <div className="status-item__dot" style={{ background: s.color }} />
                <span className="status-item__label">{s.label}</span>
                <span className="status-item__count">{s.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
