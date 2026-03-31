import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Project, SortField } from '../../types';
import './Projects.css';

const ProjectCard: React.FC<{ project: Project; onOpen: (id: string) => void }> = React.memo(({ project, onOpen }) => (
  <div className="proj-card fade-in">
    <div className="proj-card__header">
      <div className="proj-card__color" style={{ background: project.color }} />
      <div className="proj-card__meta">
        <h3 className="proj-card__name">{project.name}</h3>
        <p className="proj-card__desc">{project.description}</p>
      </div>
      <span className={`proj-card__badge proj-card__badge--${project.status}`}>{project.status}</span>
    </div>

    <div className="proj-card__progress">
      <div className="proj-card__progress-bar">
        <div className="proj-card__progress-fill" style={{ width: `${project.progress}%`, background: project.color }} />
      </div>
      <span className="proj-card__progress-pct">{project.progress}%</span>
    </div>

    <div className="proj-card__stats">
      <div className="proj-card__stat">
        <span className="proj-card__stat-val">{project.taskCount}</span>
        <span className="proj-card__stat-lbl">Tasks</span>
      </div>
      <div className="proj-card__stat">
        <span className="proj-card__stat-val" style={{ color: 'var(--success)' }}>{project.completedTasks}</span>
        <span className="proj-card__stat-lbl">Done</span>
      </div>
      <div className="proj-card__stat">
        <span className="proj-card__stat-val" style={{ color: project.overdueTasks > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
          {project.overdueTasks}
        </span>
        <span className="proj-card__stat-lbl">Overdue</span>
      </div>
      <div className="proj-card__stat">
        <span className="proj-card__stat-val">{project.dueDate}</span>
        <span className="proj-card__stat-lbl">Due</span>
      </div>
    </div>

    <button className="proj-card__open" onClick={() => onOpen(project.id)}>Open Board →</button>
  </div>
));

const Projects: React.FC = () => {
  const { state, loadProjects, setSelectedProject, setView, setFilters } = useApp();
  const [searchInput, setSearchInput] = useState(state.filters.search);
  const debouncedSearch = useDebounce(searchInput, 280);

  useEffect(() => {
    if (state.projects.length === 0) loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  const filtered = useMemo(() => {
    let list = [...state.projects];
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (state.filters.status !== 'all') {
      list = list.filter(p => p.status === state.filters.status);
    }
    list.sort((a, b) => {
      const aVal = a[state.filters.sortField as keyof Project];
      const bVal = b[state.filters.sortField as keyof Project];
      const cmp = String(aVal).localeCompare(String(bVal));
      return state.filters.sortOrder === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [state.projects, state.filters]);

  const handleOpen = useCallback((id: string) => {
    setSelectedProject(id);
    setView('kanban');
  }, [setSelectedProject, setView]);

  const toggleSort = useCallback((field: SortField) => {
    if (state.filters.sortField === field) {
      setFilters({ sortOrder: state.filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilters({ sortField: field, sortOrder: 'asc' });
    }
  }, [state.filters]);

  return (
    <div className="projects">
      <div className="projects__toolbar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search projects…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button className="search-clear" onClick={() => { setSearchInput(''); setFilters({ search: '' }); }}>×</button>
          )}
        </div>

        <div className="toolbar-controls">
          <select
            className="filter-select"
            value={state.filters.status}
            onChange={e => setFilters({ status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>

          <div className="sort-btns">
            {(['name', 'dueDate', 'progress'] as SortField[]).map(f => (
              <button
                key={f}
                className={`sort-btn ${state.filters.sortField === f ? 'sort-btn--active' : ''}`}
                onClick={() => toggleSort(f)}
              >
                {f === 'name' ? 'Name' : f === 'dueDate' ? 'Due' : 'Progress'}
                {state.filters.sortField === f && (
                  <span>{state.filters.sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {state.errors.projects && (
        <div className="error-banner">⚠ {state.errors.projects}</div>
      )}

      {state.loading.projects ? (
        <div className="projects__grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="proj-card-skeleton skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="projects__empty">
          <span className="projects__empty-icon">◫</span>
          <p>No projects match your filters</p>
        </div>
      ) : (
        <>
          <p className="projects__count">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</p>
          <div className="projects__grid">
            {filtered.map(p => <ProjectCard key={p.id} project={p} onOpen={handleOpen} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;
