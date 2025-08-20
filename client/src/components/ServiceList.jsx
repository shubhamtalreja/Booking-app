import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getAllServices } from '../services/service';

const ServiceList = ({ onServiceSelect, selectedService }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await getAllServices();
                console.log('Fetched services:', response);
                setServices(response);
                setError(null);
            } catch (err) {
                setError('Failed to load services. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchService();
    }, [])

    if (loading) {
        return <div>Loading services...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h3>Step 1: Select a Service</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {services?.map((service) => {
                    const isSelected = selectedService?._id === service._id;

                    return (
                        <div
                            key={service._id}
                            onClick={() => onServiceSelect(service)}
                            style={{
                                border: isSelected ? '2px solid #007bff' : '1px solid #ccc',
                                margin: '8px 0',
                                padding: '12px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                boxShadow: isSelected ? '0 0 5px rgba(0, 123, 255, 0.5)' : 'none'
                            }}
                        >
                            <h4>{service.name}</h4>
                            <p>{service.description}</p>
                            <p>
                                <strong>Duration:</strong> {service.duration} minutes | <strong>Price:</strong> ${service.price}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ServiceList;