
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminLogin.css';
const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://crispii.onrender.com/api/admin';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      if (res.data.success && res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        if (onLogin) onLogin();
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-bg">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h2 className="admin-login-title">Admin Login</h2>
        {error && <div className="admin-login-error">{error}</div>}
        <div>
          <label className="admin-login-label">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="admin-login-input" required />
        </div>
        <div>
          <label className="admin-login-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="admin-login-input" required />
        </div>
        <button type="submit" className="admin-login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
