// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import CustomerBookings from './components/CustomerBookings';
import BookAppointment from './pages/BookAppointment';
import ProtectedRoute from './components/ProtectedRoute';
import Services from './pages/Services';
import Home from './pages/Home'; // Add this import
import Navbar from './components/Navbar';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'Admin' ? '/admin' : '/home'} />} />
      
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      
      {/* Customer Routes */}
      <Route path="/bookings" element={
        <ProtectedRoute>
          <CustomerBookings />
        </ProtectedRoute>
      } />
      <Route path="/book" element={
        <ProtectedRoute>
          <BookAppointment />
        </ProtectedRoute>
      } />
      <Route path="/services" element={<Services />} /> {/* Make services public */}
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      {/* Default redirect */}
      {/*<Route path="*" element={<Navigate to={user ? (user.role === 'Admin' ? '/admin' : '/home') : '/home'} />} />*/}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;