import React, { useState, useEffect } from 'react';
import { servicesAPI, appointmentsAPI } from '../services/api';
import './BookAppointment.css';

const BookAppointment = () => {
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    appointmentDate: '',
    notes: ''
  });

  useEffect(() => {
    servicesAPI.getAll()
      .then(data => {
        setServices(data);
        setServicesLoading(false);
      })
      .catch(err => {
        setError('Failed to load services');
        setServicesLoading(false);
      });
  }, []);

  const handleServiceChange = (serviceId) => {
    setFormData(prev => ({ ...prev, serviceId, appointmentDate: '' }));
    setAvailableSlots([]);
    setSelectedTime('');
    
    if (serviceId && formData.appointmentDate) {
      loadAvailableSlots(new Date(formData.appointmentDate), serviceId);
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, appointmentDate: date }));
    setAvailableSlots([]);
    setSelectedTime('');
    
    if (formData.serviceId && date) {
      loadAvailableSlots(new Date(date), formData.serviceId);
    }
  };

  const loadAvailableSlots = (date, serviceId) => {
    appointmentsAPI.getAvailableSlots(date, serviceId)
      .then(slots => {
        setAvailableSlots(slots);
      })
      .catch(err => {
        setAvailableSlots([]);
      });
  };

  const handleTimeSelect = (timeSlot) => {
    setSelectedTime(timeSlot);
    
    // Combine date and time
    const selectedDate = new Date(formData.appointmentDate);
    const timeDate = new Date(timeSlot);
    
    selectedDate.setHours(timeDate.getHours());
    selectedDate.setMinutes(timeDate.getMinutes());
    
    // Update formData with the complete datetime
    setFormData(prev => ({
      ...prev,
      appointmentDate: selectedDate.toISOString()
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate that a time is selected
    if (!selectedTime) {
      setError('Please select a time slot');
      setLoading(false);
      return;
    }

    const appointmentData = {
      ...formData,
      appointmentDate: new Date(formData.appointmentDate).toISOString()
    };

    console.log('Submitting appointment:', appointmentData); // Debug log

    appointmentsAPI.create(appointmentData)
      .then(() => {
        alert('Appointment booked successfully!');
        // Reset form
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          serviceId: '',
          appointmentDate: '',
          notes: ''
        });
        setAvailableSlots([]);
        setSelectedTime('');
      })
      .catch(err => {
        setError(err.response?.data || 'Error booking appointment. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="book-appointment">
      <div className="container">
        <h1>Book Your Appointment</h1>
        
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Service *</label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              required
              disabled={loading || servicesLoading}
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - R{service.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Date *</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate.split('T')[0]} // Only show date part
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              disabled={loading || !formData.serviceId}
            />
            {!formData.serviceId && (
              <small className="hint">Please select a service first</small>
            )}
          </div>

          {availableSlots.length > 0 && (
            <div className="form-group">
              <label>Available Time Slots *</label>
              <div className="time-slots">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    {formatTime(slot)}
                  </button>
                ))}
              </div>
              {!selectedTime && (
                <small className="hint">Please select a time slot</small>
              )}
            </div>
          )}

          {availableSlots.length === 0 && formData.serviceId && formData.appointmentDate && (
            <div className="form-group">
              <div className="no-slots">
                No available slots for this date. Please choose another date.
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              disabled={loading}
              placeholder="Any specific styling requests or requirements..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !selectedTime} 
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;