import React, { useState, useEffect } from 'react';
import { appointmentsAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    appointmentsAPI.getAll()
      .then(data => {
        console.log('Appointments loaded:', data);
        setAppointments(data);
        setError('');
      })
      .catch(err => {
        setError('Failed to load appointments');
        console.error('Error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleConfirm = (id) => {
    appointmentsAPI.confirm(id)
      .then(() => {
        loadAppointments();
      })
      .catch(err => {
        setError('Failed to confirm appointment');
      });
  };

  const handleComplete = (id) => {
    appointmentsAPI.complete(id)
      .then(() => {
        loadAppointments();
      })
      .catch(err => {
        setError('Failed to complete appointment');
      });
  };

  const handleCancel = (id) => {
    appointmentsAPI.cancel(id)
      .then(() => {
        loadAppointments();
      })
      .catch(err => {
        setError('Failed to cancel appointment');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      appointmentsAPI.delete(id)
        .then(() => {
          loadAppointments();
        })
        .catch(err => {
          setError('Failed to delete appointment');
        });
    }
  };

  // ✅ FIXED: Use string status values
  const getStatusBadge = (status) => {
    const statusClass = {
      'Pending': 'status-pending',
      'Confirmed': 'status-confirmed',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled',
      '0': 'status-pending',      // Fallback for numeric
      '1': 'status-confirmed',    // Fallback for numeric
      '2': 'status-completed',    // Fallback for numeric
      '3': 'status-cancelled'     // Fallback for numeric
    };
    
    const statusText = {
      'Pending': 'Pending',
      'Confirmed': 'Confirmed',
      'Completed': 'Completed',
      'Cancelled': 'Cancelled',
      '0': 'Pending',      // Fallback for numeric
      '1': 'Confirmed',    // Fallback for numeric
      '2': 'Completed',    // Fallback for numeric
      '3': 'Cancelled'     // Fallback for numeric
    };

    return <span className={`status-badge ${statusClass[status]}`}>{statusText[status]}</span>;
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  // ✅ FIXED: Use string status values for counting
  const pendingCount = appointments.filter(a => a.status === 'Pending' || a.status === 0).length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 1).length;
  const completedCount = appointments.filter(a => a.status === 'Completed' || a.status === 2).length;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        
        {error && <div className="error">{error}</div>}

        <div className="stats">
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="stat-number">{pendingCount}</div>
          </div>
          <div className="stat-card">
            <h3>Confirmed</h3>
            <div className="stat-number">{confirmedCount}</div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="stat-number">{completedCount}</div>
          </div>
          <div className="stat-card">
            <h3>Total</h3>
            <div className="stat-number">{appointments.length}</div>
          </div>
        </div>

        <div className="appointments-section">
          <div className="section-header">
            <h2>All Appointments</h2>
            <button onClick={loadAppointments} className="refresh-btn">
              Refresh
            </button>
          </div>

          <div className="appointments-list">
            {appointments.length === 0 ? (
              <div className="no-appointments">No appointments found.</div>
            ) : (
              appointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h3>{appointment.customerName}</h3>
                    <p><strong>Email:</strong> {appointment.customerEmail}</p>
                    <p><strong>Phone:</strong> {appointment.customerPhone}</p>
                    <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
                    <p><strong>Service:</strong> {appointment.service?.name} - R{appointment.service?.price}</p>
                    {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                  </div>
                  <div className="appointment-actions">
                    {getStatusBadge(appointment.status)}
                    <div className="action-buttons">
                      {/* ✅ FIXED: Check for string 'Pending' */}
                      {(appointment.status === 'Pending' || appointment.status === 0) && (
                        <>
                          <button 
                            onClick={() => handleConfirm(appointment.id)}
                            className="btn-confirm"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleCancel(appointment.id)}
                            className="btn-cancel"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {/* ✅ FIXED: Check for string 'Confirmed' */}
                      {(appointment.status === 'Confirmed' || appointment.status === 1) && (
                        <button 
                          onClick={() => handleComplete(appointment.id)}
                          className="btn-complete"
                        >
                          Complete
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(appointment.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;