import React, { useState, useEffect } from 'react';
import { appointmentsAPI } from '../services/api';
import './CustomerBookings.css';

const CustomerBookings = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    setLoading(true);
    setError('');
    
    console.log('🔄 Loading appointments...');
    
    appointmentsAPI.getMyAppointments()
      .then(data => {
        console.log('✅ Appointments loaded:', data);
        setAppointments(data);
      })
      .catch(err => {
        console.error('❌ Error loading appointments:', err);
        console.log('Full error object:', err);
        
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           err.message || 
                           'Failed to load your appointments';
        
        setError(`Error: ${errorMessage}`);
        setAppointments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      appointmentsAPI.cancel(id)
        .then(() => {
          loadAppointments();
        })
        .catch(err => {
          console.error('Error canceling appointment:', err);
          setError('Failed to cancel appointment');
        });
    }
  };

  // ✅ FIXED: Use string status values
  const getStatusText = (status) => {
    const statusMap = {
      'Pending': 'Pending',
      'Confirmed': 'Confirmed',
      'Completed': 'Completed',
      'Cancelled': 'Cancelled',
      '0': 'Pending',      // Fallback for numeric
      '1': 'Confirmed',    // Fallback for numeric
      '2': 'Completed',    // Fallback for numeric
      '3': 'Cancelled'     // Fallback for numeric
    };
    return statusMap[status] || 'Unknown';
  };

  // ✅ FIXED: Use string status values
  const getStatusClass = (status) => {
    const classMap = {
      'Pending': 'status-pending',
      'Confirmed': 'status-confirmed',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled',
      '0': 'status-pending',      // Fallback for numeric
      '1': 'status-confirmed',    // Fallback for numeric
      '2': 'status-completed',    // Fallback for numeric
      '3': 'status-cancelled'     // Fallback for numeric
    };
    return classMap[status] || '';
  };

  if (loading) {
    return <div className="loading">Loading your appointments...</div>;
  }

  return (
    <div className="customer-bookings">
      <div className="container">
        <h1>My Appointments</h1>
        
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
            <button onClick={loadAppointments} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        <div className="bookings-header">
          <button 
            onClick={() => window.location.href = '/book'} 
            className="btn-primary"
          >
            Book New Appointment
          </button>
          <button onClick={loadAppointments} className="btn-secondary">
            Refresh
          </button>
        </div>

        <div className="appointments-list">
          {appointments.length === 0 && !error ? (
            <div className="no-appointments">
              <p>You don't have any appointments yet.</p>
              <button 
                onClick={() => window.location.href = '/book'} 
                className="btn-primary"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            appointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-info">
                  <h3>{appointment.service?.name}</h3>
                  <p><strong>Date & Time:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
                  <p><strong>Price:</strong> R{appointment.service?.price}</p>
                  <p><strong>Duration:</strong> {appointment.service?.durationMinutes} minutes</p>
                  {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                </div>
                <div className="appointment-actions">
                  <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                  {/* ✅ FIXED: Check for string 'Pending' */}
                  {(appointment.status === 'Pending' || appointment.status === 0) && (
                    <button 
                      onClick={() => handleCancel(appointment.id)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerBookings;