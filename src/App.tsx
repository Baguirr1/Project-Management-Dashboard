import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Auth/Login';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './components/Dashboard/Dashboard';
import './styles/globals.css';

const Projects = lazy(() => import('./components/Projects/Projects'));
const Kanban = lazy(() => import('./components/Kanban/Kanban'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-muted)' }}>
    <div style={{ width: 20, height: 20, border: '2px solid var(--border-strong)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  </div>
);

const AppRoutes: React.FC = () => {
  const { state } = useApp();
  return (
    <Suspense fallback={<LoadingFallback />}>
      {state.activeView === 'dashboard' && <Dashboard />}
      {state.activeView === 'projects' && <Projects />}
      {state.activeView === 'kanban' && <Kanban />}
    </Suspense>
  );
};

const AppInner: React.FC = () => {
  const { state } = useApp();
  if (!state.user) return <Login />;
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppInner />
  </AppProvider>
);

export default App;
