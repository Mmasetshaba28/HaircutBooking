import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { user, isCustomer } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Barber Shop</h1>
          <p>Professional haircuts with expert styling. Book your appointment today!</p>
          <div className="hero-buttons">
            {user ? (
              isCustomer ? (
                <>
                  <Link to="/book" className="cta-button primary">Book Appointment</Link>
                  <Link to="/services" className="cta-button secondary">View Services</Link>
                </>
              ) : (
                <Link to="/admin" className="cta-button primary">Admin Dashboard</Link>
              )
            ) : (
              <>
                <Link to="/login" className="cta-button primary">Login to Book</Link>
                <Link to="/services" className="cta-button secondary">View Services</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Our Barber Shop?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✂️</div>
              <h3>Expert Barbers</h3>
              <p>Professional haircuts with years of experience and training</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Easy Online Booking</h3>
              <p>Book your appointment anytime, anywhere with our simple system</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💈</div>
              <h3>Quality Service</h3>
              <p>Premium products and techniques for the best results</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Fair Prices</h3>
              <p>High-quality service at affordable, transparent prices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      {user && isCustomer && (
        <section className="quick-actions">
          <div className="container">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <Link to="/book" className="action-card">
                <h3>Book Appointment</h3>
                <p>Schedule your next haircut</p>
              </Link>
              <Link to="/bookings" className="action-card">
                <h3>My Appointments</h3>
                <p>View and manage your bookings</p>
              </Link>
              <Link to="/services" className="action-card">
                <h3>Our Services</h3>
                <p>Explore all our offerings</p>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;