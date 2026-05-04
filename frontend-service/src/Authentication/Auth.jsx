import { useState } from 'react';
import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';

export default function Auth({onLogin}) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer');

  // Logical addition: Track input values
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auth.jsx
  const handleSubmit = (e) => {
    e.preventDefault();

    onLogin({
      name: formData.fullName || "User",
      role: role,
      notifications: 0
    });

    if (role === 'agent') {
      navigate('/agent/workspace');
    } else {
      navigate('/customer/tickets');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className={styles.subtitle}>
          {isLogin ? 'Login to manage your support tickets' : 'Join our support system today'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>I am a...</label>
            <div className={styles.segmentedControl}>
              <button
                type="button"
                className={`${styles.segmentBtn} ${role === 'customer' ? styles.activeSegment : ''}`}
                onClick={() => setRole('customer')}
              >
                Customer
              </button>
              <button
                type="button"
                className={`${styles.segmentBtn} ${role === 'agent' ? styles.activeSegment : ''}`}
                onClick={() => setRole('agent')}
              >
                Support Agent
              </button>
            </div>
          </div>

          {/* This is the Register-specific logic */}
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                className={styles.inputField}
                placeholder="Hafsa Hikal"
                onChange={handleChange}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className={styles.inputField}
              placeholder="name@example.com"
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              className={styles.inputField}
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          <button className={styles.primaryBtn} type="submit">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className={styles.toggleLink}
            style={{ cursor: 'pointer' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
