import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/authSlice';
import DashboardMetrics from './DashboardMetrics';
import ProjectList from '../projects/ProjectList';
import KanbanBoard from '../kanban/KanbanBoard';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>Project Management Dashboard</h1>
        <div className="user-controls">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-section">
          <h2>Overview</h2>
          <DashboardMetrics />
        </section>

        <section className="dashboard-section">
          <h2>Active Projects</h2>
          <ProjectList />
        </section>

        <section className="dashboard-section">
          <h2>Task Board</h2>
          <KanbanBoard />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;