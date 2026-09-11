import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import './Navbar.scss';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate('/');
  };

  const isCurrentPath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">PF</div>
          <span className="brand-name">PrepForge AI</span>
        </Link>

        <nav className="navbar-links">
          <Link to="/" className={`nav-link ${isCurrentPath('/') ? 'active' : ''}`}>
            Home
          </Link>
          <a href="/#how-it-works" className="nav-link">
            How It Works
          </a>
          <a href="/#features" className="nav-link">
            Features
          </a>

          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isCurrentPath('/dashboard') ? 'active' : ''}`}>
                Plan Generator
              </Link>
              <Link to="/interview-voice" className={`nav-link ${isCurrentPath('/interview-voice') ? 'active' : ''}`}>
                Voice Mock
              </Link>
              <Link to="/history" className={`nav-link ${isCurrentPath('/history') ? 'active' : ''}`}>
                History
              </Link>
              <Link to="/progress" className={`nav-link ${isCurrentPath('/progress') ? 'active' : ''}`}>
                Progress
              </Link>
            </>
          ) : (
            <>
              <a href="/#voice-mock" className="nav-link">
                Voice Mock
              </a>
              <a href="/#progress-demo" className="nav-link">
                Progress Demo
              </a>
            </>
          )}
        </nav>

        <div className="navbar-user">
          {user ? (
            <div className="user-profile">
              <button className="dashboard-link-btn" onClick={() => navigate('/dashboard')}>
                Dashboard →
              </button>
              <div className="avatar" title={user.username || user.email}>
                {(user.username || user.email || 'U')[0].toUpperCase()}
              </div>
              <button className="logout-btn" onClick={onLogout} title="Logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-nav-buttons">
              <Link to="/login" className="login-nav-btn">
                Login
              </Link>
              <Link to="/register" className="register-nav-btn">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
