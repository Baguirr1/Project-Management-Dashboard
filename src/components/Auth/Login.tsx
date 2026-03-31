import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Login.css';

const Login: React.FC = () => {
  const { login, state } = useApp();
  const [email, setEmail] = useState('alex@company.io');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch {
      setError('Invalid email or password. Try alex@company.io / password');
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="login-orb login-orb--1" />
        <div className="login-orb login-orb--2" />
        <div className="login-grid" />
      </div>

      <div className="login-card fade-in">
        <div className="login-logo">
          <span className="login-logo__mark">◆</span>
          <span className="login-logo__name">Orbit</span>
        </div>
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your workspace</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              className="login-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.io"
              autoComplete="email"
            />
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit" disabled={state.loading.auth}>
            {state.loading.auth ? (
              <span className="login-spinner" />
            ) : 'Sign in'}
          </button>
        </form>

        <p className="login-hint">Demo: alex@company.io / password</p>
      </div>
    </div>
  );
};

export default Login;
