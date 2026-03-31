import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User, Project, Task, DashboardMetrics, FilterState } from '../types';
import { api } from '../services/api';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  projects: Project[];
  tasks: Task[];
  metrics: DashboardMetrics | null;
  selectedProjectId: string | null;
  activeView: 'dashboard' | 'projects' | 'kanban';
  filters: FilterState;
  loading: { auth: boolean; projects: boolean; tasks: boolean; metrics: boolean };
  errors: { projects: string | null; tasks: string | null; metrics: string | null };
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_METRICS'; payload: DashboardMetrics }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'SET_SELECTED_PROJECT'; payload: string | null }
  | { type: 'SET_VIEW'; payload: AppState['activeView'] }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_LOADING'; payload: Partial<AppState['loading']> }
  | { type: 'SET_ERROR'; payload: Partial<AppState['errors']> };

const initialState: AppState = {
  user: null,
  theme: 'dark',
  projects: [],
  tasks: [],
  metrics: null,
  selectedProjectId: null,
  activeView: 'dashboard',
  filters: { status: 'all', search: '', sortField: 'createdAt', sortOrder: 'desc' },
  loading: { auth: false, projects: false, tasks: false, metrics: false },
  errors: { projects: null, tasks: null, metrics: null },
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload };
    case 'TOGGLE_THEME': {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pm_theme', next);
      return { ...state, theme: next };
    }
    case 'SET_PROJECTS': return { ...state, projects: action.payload };
    case 'SET_TASKS': return { ...state, tasks: action.payload };
    case 'SET_METRICS': return { ...state, metrics: action.payload };
    case 'UPDATE_TASK': return {
      ...state,
      tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
    };
    case 'SET_SELECTED_PROJECT': return { ...state, selectedProjectId: action.payload };
    case 'SET_VIEW': return { ...state, activeView: action.payload };
    case 'SET_FILTERS': return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_LOADING': return { ...state, loading: { ...state.loading, ...action.payload } };
    case 'SET_ERROR': return { ...state, errors: { ...state.errors, ...action.payload } };
    default: return state;
  }
}

interface AppContextValue {
  state: AppState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleTheme: () => void;
  loadProjects: () => Promise<void>;
  loadTasks: (projectId: string) => Promise<void>;
  loadMetrics: () => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  setView: (view: AppState['activeView']) => void;
  setSelectedProject: (id: string | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('pm_user');
    const savedTheme = localStorage.getItem('pm_theme') as 'light' | 'dark' | null;
    if (savedUser) dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    if (savedTheme) dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser || 'null') });
    if (savedTheme) {
      // apply saved theme directly since we need a special init
      dispatch({ type: 'TOGGLE_THEME' });
      if (savedTheme === 'light') dispatch({ type: 'TOGGLE_THEME' }); // reset to light if needed
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: { auth: true } });
    try {
      const user = await api.login(email, password);
      dispatch({ type: 'SET_USER', payload: user });
      localStorage.setItem('pm_user', JSON.stringify(user));
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { auth: false } });
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'SET_USER', payload: null });
    localStorage.removeItem('pm_user');
  }, []);

  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);

  const loadProjects = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { projects: true } });
    dispatch({ type: 'SET_ERROR', payload: { projects: null } });
    try {
      const projects = await api.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: { projects: 'Failed to load projects' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { projects: false } });
    }
  }, []);

  const loadTasks = useCallback(async (projectId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { tasks: true } });
    dispatch({ type: 'SET_ERROR', payload: { tasks: null } });
    try {
      const tasks = await api.getTasksByProject(projectId);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: { tasks: 'Failed to load tasks' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { tasks: false } });
    }
  }, []);

  const loadMetrics = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { metrics: true } });
    try {
      const metrics = await api.getMetrics();
      dispatch({ type: 'SET_METRICS', payload: metrics });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: { metrics: 'Failed to load metrics' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { metrics: false } });
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, status: Task['status']) => {
    // Optimistic update
    const prev = state.tasks.find(t => t.id === taskId);
    if (prev) dispatch({ type: 'UPDATE_TASK', payload: { ...prev, status } });
    try {
      const updated = await api.updateTaskStatus(taskId, status);
      dispatch({ type: 'UPDATE_TASK', payload: updated });
    } catch {
      if (prev) dispatch({ type: 'UPDATE_TASK', payload: prev }); // rollback
    }
  }, [state.tasks]);

  const addComment = useCallback(async (taskId: string, text: string) => {
    if (!state.user) return;
    const updated = await api.addComment(taskId, text, state.user);
    dispatch({ type: 'UPDATE_TASK', payload: updated });
  }, [state.user]);

  const setView = useCallback((view: AppState['activeView']) => dispatch({ type: 'SET_VIEW', payload: view }), []);
  const setSelectedProject = useCallback((id: string | null) => dispatch({ type: 'SET_SELECTED_PROJECT', payload: id }), []);
  const setFilters = useCallback((filters: Partial<FilterState>) => dispatch({ type: 'SET_FILTERS', payload: filters }), []);

  return (
    <AppContext.Provider value={{
      state, login, logout, toggleTheme, loadProjects, loadTasks,
      loadMetrics, updateTaskStatus, addComment, setView, setSelectedProject, setFilters,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
