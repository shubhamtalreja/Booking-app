import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getAllServices } from '../services/service';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './ServiceList.css';

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
        return (
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                <h2><Skeleton width={200} /></h2>
                <div className="appointment-card-skeleton">
                    <h3><Skeleton width={`80%`} /></h3>
                    <p><Skeleton count={2} /></p>
                </div>
                <div className="appointment-card-skeleton">
                    <h3><Skeleton width={`60%`} /></h3>
                    <p><Skeleton count={2} /></p>
                </div>
            </SkeletonTheme>
        );;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h3>Step 1: Select a Service</h3>
            <div className='services-container' style={{ display: 'flex', flexDirection: 'column' }}>
                {services?.map((service) => {
                    const isSelected = selectedService?._id === service._id;

                    return (
                        <div 
                            className='service-card'
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