import { useState, useEffect } from 'react';
import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api';
import toast from 'react-hot-toast';


export default function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // You can even use a promise toast for the whole process
    const loginPromise = (async () => {
      let result;

      if (isLogin) {
        result = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        // Handle the "Logged in as wrong role" case
        if (result && result.user && result.user.role !== role) {
          throw new Error(`Account registered as ${result.user.role}. Change selection.`);
        }
      } else {
        const registerResult = await registerUser({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role,
        });

        if (registerResult.error) throw new Error(registerResult.message);

        result = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      }

      if (!result || !result.token) {
        throw new Error(result?.message || "Authentication failed");
      }

      // Success logic
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      onLogin({
        id: result.user._id,
        name: result.user.name,
        role: result.user.role,
      });

      return result.user;
    })();

    toast.promise(loginPromise, {
      loading: 'Authenticating...',
      success: (user) => `Welcome back, ${user.name}!`,
      error: (err) => `${err.message}`,
    });

    try {
      const user = await loginPromise;
      // Redirection happens after toast starts
      if (user.role === "agent") {
        navigate("/agent/workspace");
      } else {
        navigate("/customer/tickets");
      }
    } catch (err) {
      // Error is already handled by toast.promise
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className={styles.subtitle}>
          {isLogin
            ? "Login to manage your support tickets"
            : "Join our support system today"}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className={styles.inputGroup}>
            <label>I am a...</label>
            <div className={styles.segmentedControl}>
              <button
                type="button"
                className={`${styles.segmentBtn} ${role === "customer" ? styles.activeSegment : ""}`}
                onClick={() => setRole("customer")}
              >
                Customer
              </button>
              <button
                type="button"
                className={`${styles.segmentBtn} ${role === "agent" ? styles.activeSegment : ""}`}
                onClick={() => setRole("agent")}
              >
                Support Agent
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                className={styles.inputField}
                placeholder="Hafsa Hikal"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              required
              className={styles.inputField}
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              className={styles.inputField}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            className={styles.primaryBtn}
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className={styles.toggleLink}
            style={{ cursor: "pointer" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
