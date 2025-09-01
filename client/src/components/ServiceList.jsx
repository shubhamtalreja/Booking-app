import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getAllServices } from '../services/service';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './ServiceList.css';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Step 1: Select a Service
            </h4>
            <div className='services-container' style={{ display: 'flex', flexDirection: 'column' }}>
                {services?.map((service) => {
                    return (
                        <Card key={service._id}
                            onClick={() => onServiceSelect(service)}>
                            <CardHeader>
                                <CardTitle>{service.name}</CardTitle>
                                <CardDescription>
                                    <p>{service.description}</p>
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <strong>Duration:</strong> {service.duration} minutes | <strong>Price:</strong> ${service.price}

                            </CardContent>
                        </Card>)
                })}
            </div>
        </div>
    )
}

export default ServiceList;