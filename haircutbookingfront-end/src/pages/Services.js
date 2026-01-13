import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../services/api'; // Keep this import
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // MOCK DATA AS FALLBACK
    const mockServices = [
      { id: 1, name: "Basic Haircut", description: "A standard haircut service.", price: 20.00, durationMinutes: 30 },
      { id: 2, name: "Deluxe Haircut", description: "A premium haircut service with additional styling.", price: 35.00, durationMinutes: 45 },
      { id: 3, name: "Beard Trim", description: "Professional beard shaping and trimming", price: 15.00, durationMinutes: 20 },
      { id: 4, name: "Haircut + Beard", description: "Complete grooming package", price: 45.00, durationMinutes: 60 },
      { id: 5, name: "Kids Haircut", description: "Special haircut for children with fun styling", price: 18.00, durationMinutes: 25 },
      { id: 6, name: "Senior Haircut", description: "Haircut service for senior citizens", price: 17.00, durationMinutes: 30 },
      { id: 7, name: "Fade Haircut", description: "Modern fade style with precise blending", price: 30.00, durationMinutes: 45 },
      { id: 8, name: "Buzz Cut", description: "Short, even length buzz cut all over", price: 15.00, durationMinutes: 20 },
      { id: 9, name: "Scissor Cut", description: "Precise scissor-only haircut for natural look", price: 25.00, durationMinutes: 40 },
      { id: 10, name: "Hair Wash & Treatment", description: "Professional hair washing with conditioning treatment", price: 12.00, durationMinutes: 20 },
      { id: 11, name: "Hair Coloring", description: "Professional hair coloring service", price: 50.00, durationMinutes: 90 },
      { id: 12, name: "Hair Styling", description: "Professional styling for special occasions", price: 22.00, durationMinutes: 30 },
      { id: 13, name: "Traditional Shave", description: "Traditional straight razor shave with hot towels", price: 25.00, durationMinutes: 30 },
      { id: 14, name: "Mustache Trim", description: "Precise mustache shaping and trimming", price: 10.00, durationMinutes: 15 },
      { id: 15, name: "Hair & Scalp Treatment", description: "Deep conditioning treatment for hair and scalp", price: 35.00, durationMinutes: 45 }
    ];

    // TRY API FIRST, FALLBACK TO MOCK DATA
    servicesAPI.getAll()
      .then(data => {
        console.log('✅ API Data received:', data);
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ API Failed, using mock data:', err.message);
        // Use mock data as fallback
        setServices(mockServices);
        setLoading(false);
        setError('Note: Using demo data (API connection failed)');
      });
  }, []);

  const getServiceImage = (serviceId) => {
    const baseUrl = process.env.PUBLIC_URL || '';
    const imageMap = {
      1: `${baseUrl}/images/services/classic-haircut.jpg`,
      2: `${baseUrl}/images/services/premium-haircut.jpg`,
      3: `${baseUrl}/images/services/beard-trim.jpg`,
      4: `${baseUrl}/images/services/haircut-beard-combo.jpg`,
      5: `${baseUrl}/images/services/kids-haircut.jpg`,
      6: `${baseUrl}/images/services/senior-haircut.jpg`,
      7: `${baseUrl}/images/services/fade-haircut.jpg`,
      8: `${baseUrl}/images/services/buzz-cut.jpg`,
      9: `${baseUrl}/images/services/scissor-cut.jpg`,
      10: `${baseUrl}/images/services/hair-wash.jpg`,
      11: `${baseUrl}/images/services/hair-color.jpg`,
      12: `${baseUrl}/images/services/styling.jpg`,
      13: `${baseUrl}/images/services/shaving.jpg`,
      14: `${baseUrl}/images/services/facial.jpg`,
      15: `${baseUrl}/images/services/hair-treatment.jpg`
    };
    
    return imageMap[serviceId] || `${baseUrl}/images/services/classic-haircut.jpg`;
  };

  if (loading) return <div className="loading">Loading services...</div>;

  return (
    <div className="services-page">
      <div className="container">
        <h1>Our Services</h1>
        
        {error && (
          <div className="warning" style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            color: '#856404',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            ⚠️ {error} - <a href="http://localhost:5274/api/services" target="_blank" rel="noreferrer">
              Check if backend is running
            </a>
          </div>
        )}

        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-image">
                <img 
                  src={getServiceImage(service.id)} 
                  alt={service.name}
                  onLoad={() => console.log(`✅ Image loaded: ${service.name}`)}
                />
              </div>
              <div className="service-content">
                <h3>{service.name}</h3>
                <p className="description">{service.description}</p>
                <div className="service-footer">
                  <span className="price">R{service.price}</span>
                  <span className="duration">{service.durationMinutes} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;