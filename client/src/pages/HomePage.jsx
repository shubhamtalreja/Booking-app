import { Button } from '@/components/ui/button';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Mens from '../assets/Mens.png'
import Womens from '../assets/Womens.png'

const HomePage = () => {
  const serviceImages = [Mens, Womens];
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center justify-center gap-2 p-2'>
      <Carousel className="w-full max-w-4xl h-100" opts={{
        align: "start",
        loop: true,
      }}>
        <CarouselContent className="h-100">
          {serviceImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1 h-100 w-full">
                <Card onClick={() => navigate('/booking')} className="h-100 w-full cursor-pointer hover:scale-105 transition-transform duration-300">
                  <CardContent className="flex items-center justify-center p-2 w-full h-100">
                    <img key={index} src={image} alt={`Image ${index + 1}`} className="rounded-sm object-cover w-full h-full"/>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Welcome to our Appointment Booking App! Easily schedule your appointments
        online with just a few clicks. Choose your preferred service, select a convenient
        date and time, and confirm your booking instantly. Start planning ahead and enjoy a
        hassle-free appointment experience—book your appointment today!</h4>
      <Button className="mt-4 hover:scale-105 transition-transform duration-300" variant="default" size="lg" asChild>
        <Link to="/booking">
          Book Now
        </Link>
      </Button>
    </div>
  );
};


export default HomePage;