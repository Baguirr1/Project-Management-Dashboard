import React from 'react';
import { useApp } from '../../context/AppContext';
import './Layout.css';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'projects', label: 'Projects', icon: '◫' },
  { id: 'kanban', label: 'Kanban', icon: '⊞' },
] as const;

const Sidebar: React.FC = () => {
  const { state, setView, logout } = useApp();
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-mark">◆</span>
        <span className="sidebar__logo-name">Orbit</span>
      </div>

      <nav className="sidebar__nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`sidebar__nav-item ${state.activeView === item.id ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{state.user?.avatar}</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{state.user?.name}</span>
            <span className="sidebar__user-email">{state.user?.email}</span>
          </div>
        </div>
        <button className="sidebar__logout" onClick={logout} title="Sign out">⎋</button>
      </div>
    </aside>
  );
};

const Header: React.FC = () => {
  const { state, toggleTheme } = useApp();
  const titles: Record<string, string> = { dashboard: 'Dashboard', projects: 'Projects', kanban: 'Kanban Board' };
  return (
    <header className="header">
      <h2 className="header__title">{titles[state.activeView]}</h2>
      <button className="header__theme-btn" onClick={toggleTheme} title="Toggle theme">
        {state.theme === 'dark' ? '☀' : '☾'}
      </button>
    </header>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  return (
    <div className="app-layout" data-theme={state.theme}>
      <Sidebar />
      <div className="app-layout__main">
        <Header />
        <main className="app-layout__content">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
