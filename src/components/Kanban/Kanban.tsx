import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus } from '../../types';
import TaskModal from '../Tasks/TaskModal';
import './Kanban.css';

const COLUMNS: { id: TaskStatus; label: string; icon: string }[] = [
  { id: 'todo', label: 'To Do', icon: '○' },
  { id: 'in-progress', label: 'In Progress', icon: '◑' },
  { id: 'done', label: 'Done', icon: '●' },
];

const PRIORITY_DOT: Record<string, string> = {
  high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)'
};

const TaskCard: React.FC<{
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onOpen: (task: Task) => void;
}> = React.memo(({ task, onDragStart, onOpen }) => (
  <div
    className="task-card fade-in"
    draggable
    onDragStart={e => onDragStart(e, task.id)}
    onClick={() => onOpen(task)}
    role="button"
    tabIndex={0}
    aria-label={`Task: ${task.title}`}
    onKeyDown={e => e.key === 'Enter' && onOpen(task)}
  >
    <div className="task-card__top">
      <span className="task-card__priority-dot" style={{ background: PRIORITY_DOT[task.priority] }} title={task.priority} />
      <span className="task-card__priority">{task.priority}</span>
    </div>
    <p className="task-card__title">{task.title}</p>
    <p className="task-card__desc">{task.description.slice(0, 80)}{task.description.length > 80 ? '…' : ''}</p>
    <div className="task-card__footer">
      <span className="task-card__due">{task.dueDate}</span>
      {task.comments.length > 0 && (
        <span className="task-card__comments">💬 {task.comments.length}</span>
      )}
    </div>
  </div>
));

const KanbanColumn: React.FC<{
  id: TaskStatus; label: string; icon: string; tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent, col: TaskStatus) => void;
  onOpen: (task: Task) => void;
}> = ({ id, label, icon, tasks, onDragStart, onDrop, onOpen }) => {
  const [over, setOver] = useState(false);

  return (
    <div
      className={`kanban-col ${over ? 'kanban-col--over' : ''}`}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { setOver(false); onDrop(e, id); }}
      role="region"
      aria-label={`${label} column`}
    >
      <div className="kanban-col__header">
        <span className="kanban-col__icon">{icon}</span>
        <span className="kanban-col__label">{label}</span>
        <span className="kanban-col__count">{tasks.length}</span>
      </div>
      <div className="kanban-col__tasks">
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} onDragStart={onDragStart} onOpen={onOpen} />
        ))}
        {tasks.length === 0 && (
          <div className="kanban-col__empty">Drop tasks here</div>
        )}
      </div>
    </div>
  );
};

const Kanban: React.FC = () => {
  const { state, loadTasks, loadProjects, updateTaskStatus, setSelectedProject } = useApp();
  const [dragging, setDragging] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (state.projects.length === 0) loadProjects();
  }, []);

  const projectId = state.selectedProjectId || (state.projects[0]?.id ?? null);

  useEffect(() => {
    if (projectId) loadTasks(projectId);
  }, [projectId]);

  const tasksByCol = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], 'in-progress': [], done: [] };
    state.tasks.forEach(t => { if (map[t.status]) map[t.status].push(t); });
    return map;
  }, [state.tasks]);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDragging(taskId);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, col: TaskStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    setDragging(null);
    if (!taskId) return;
    const task = state.tasks.find(t => t.id === taskId);
    if (task && task.status !== col) {
      await updateTaskStatus(taskId, col);
    }
  }, [state.tasks, updateTaskStatus]);

  const currentProject = state.projects.find(p => p.id === projectId);

  return (
    <div className="kanban">
      <div className="kanban__toolbar">
        <select
          className="kanban__project-select"
          value={projectId || ''}
          onChange={e => setSelectedProject(e.target.value)}
        >
          {state.projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {currentProject && (
          <div className="kanban__project-info">
            <div className="kanban__proj-dot" style={{ background: currentProject.color }} />
            <span className="kanban__proj-progress">{currentProject.progress}% complete</span>
          </div>
        )}
      </div>

      {state.errors.tasks && <div className="error-banner">⚠ {state.errors.tasks}</div>}

      {state.loading.tasks ? (
        <div className="kanban__board">
          {COLUMNS.map(c => (
            <div key={c.id} className="kanban-col">
              <div className="kanban-col__header">
                <span>{c.icon}</span><span>{c.label}</span>
              </div>
              <div className="kanban-col__tasks">
                {[1,2,3].map(i => <div key={i} className="task-card-skeleton skeleton" />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="kanban__board">
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.id}
              {...col}
              tasks={tasksByCol[col.id]}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onOpen={setSelectedTask}
            />
          ))}
        </div>
      )}

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default Kanban;
