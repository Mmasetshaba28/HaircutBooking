import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (isLogin) {
        result = await login(email, password);
        
        if (result.success) {
          if (result.role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        } else {
          setError(result.error);
        }
      } else {
        // Registration flow
        result = await register(email, password);
        
        if (result.success) {
          // Show success popup instead of auto-login
          setSuccessMessage('Account created successfully! Please sign in with your credentials.');
          setShowSuccessPopup(true);
          
          // Clear form
          setEmail('');
          setPassword('');
          
          // Switch to login tab after a delay
          setTimeout(() => {
            setShowSuccessPopup(false);
            setIsLogin(true);
          }, 3000);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      const data = await authAPI.register(email, password);
      console.log('Registration successful:', data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setIsLogin(true);
  };

  return (
    <div className="login-container">
      {/* Background Image with Overlay */}
      <div className="login-background"></div>
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="popup-icon">✅</div>
            <h3>Account Created Successfully!</h3>
            <p>{successMessage}</p>
            <button 
              onClick={closeSuccessPopup}
              className="popup-close-btn"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      )}
      
      <div className="login-content">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="brand-logo">💈</div>
          <h1>BarberShop</h1>
          <p className="brand-tagline">Precision Cuts, Perfect Style</p>
          <div className="brand-features">
            <div className="feature">
              
              <span>Expert Barbers</span>
            </div>
            <div className="feature">
              
              <span>Easy Booking</span>
            </div>
            <div className="feature">
              
              <span>Quality Service</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="form-header">
            <h2>{isLogin ? 'Welcome Back' : 'Join BarberShop'}</h2>
            <p>{isLogin ? 'Sign in to your account' : 'Create your account today'}</p>
          </div>

          <div className="form-tabs">
            <button 
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button 
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Create Account
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="styled-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength="6"
                  className="styled-input"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`submit-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="toggle-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up now' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;