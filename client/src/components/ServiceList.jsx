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
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from './ui/button';

const ServiceList = ({ onServiceSelect, selectedService }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await getAllServices();
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
        <div className='flex flex-col gap-4'>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight justify-center align-center items-center flex">
                All Service
            </h3>
            <div className='services-container grid-cols-3'>
                {services?.map((service) => {
                    return (
                        <Card className="cursor-pointer hover:shadow-lg transition duration-300 hover:bg-zinc-200"
                            style={{ border: selectedService?._id === service._id ? '2px solid #28282bff' : '1px solid #e0e0e0' }}
                            key={service._id}
                        >
                            <Carousel className="cursor-pointer hover:scale-105 transition-transform duration-300" opts={{
                                align: "start",
                                loop: true,
                            }}>
                                <CarouselContent>
                                    {service.imageUrls && service.imageUrls.length > 0 ? (
                                        service.imageUrls.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <div className="flex items-center justify-center w-full h-100 bg-gray-100">
                                                    <img
                                                        src={image}
                                                        alt={`Image ${index + 1}`}
                                                        className="object-cover w-full h-100 rounded"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))
                                    ) : (
                                        <CarouselItem>
                                            <div className="flex items-center justify-center w-full h-100 bg-gray-200 text-gray-500">
                                                No Image Available
                                            </div>
                                        </CarouselItem>
                                    )}
                                </CarouselContent>
                                {service.imageUrls?.length > 1 && <>
                                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full shadow-md" />
                                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full shadow-md" /></>}
                                {/* Dots */}
                                <div className="flex justify-center gap-2 mt-2">
                                    {service.imageUrls?.length > 0 &&
                                        service.imageUrls.map((_, i) => (
                                            <span
                                                key={i}
                                                className={"h-2 w-2 rounded-full bg-gray-300"}
                                            />
                                        ))}
                                </div>
                            </Carousel>
                            <CardHeader>
                                <CardTitle>{service.name}</CardTitle>
                                <CardDescription>
                                    <p>{service.description}</p>
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <strong>Duration:</strong> {service.duration} minutes | <strong>Price:</strong> &#8377;{service.price}

                            </CardContent>
                            <CardFooter className="flex justify-end gap-1">
                                <Button
                                    onClick={() => { onServiceSelect(service); selectedService?._id === service._id ? onServiceSelect(null) : null }}
                                    style={{ backgroundColor: '#28a745' }}
                                >
                                    Book Service
                                </Button>
                            </CardFooter>

                        </Card>)
                })}
            </div>
        </div>
    )
}

export default ServiceList;