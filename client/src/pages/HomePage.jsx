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

import { FaCut, FaUserMd, FaGift } from "react-icons/fa"; // icons
import Mens from '../assets/Mens.png'
import Womens from '../assets/Womens.png'

const HomePage = () => {
  const serviceImages = [Mens, Womens];
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6">
      {/* Carousel Section */}
      <Carousel className="w-full max-w-4xl h-100" opts={{
        align: "start",
        loop: true,
      }}>
        <CarouselContent className="h-100">
          {serviceImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1 h-100 w-full">
                <Card 
                  onClick={() => navigate('/booking')} 
                  className="h-100 w-full cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <CardContent className="flex items-center justify-center p-2 w-full h-100">
                    <img 
                      key={index} 
                      src={image} 
                      alt={`Image ${index + 1}`} 
                      className="rounded-sm object-cover w-full h-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Intro Text */}
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center max-w-3xl">
        Welcome to our Appointment Booking App! Easily schedule your appointments
        online with just a few clicks. Choose your preferred service, select a convenient
        date and time, and confirm your booking instantly. Start planning ahead and enjoy a
        hassle-free appointment experience—book your appointment today!
      </h4>

      <Button 
        className="mt-2 hover:scale-105 transition-transform duration-300" 
        variant="default" 
        size="lg" 
        asChild
      >
        <Link to="/booking">
          Book Now
        </Link>
      </Button>

      {/* Our Services Section */}
      <section id="services" className="py-20 bg-gray-100 w-full">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">
              <FaCut className="text-6xl text-pink-500 mx-auto mb-6 hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold mb-3">Salon Services</h3>
              <p className="text-gray-600">
                Book men’s and women’s salon services with professional staff and hassle-free scheduling.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">
              <FaUserMd className="text-6xl text-blue-500 mx-auto mb-6 hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold mb-3">Doctor Appointments</h3>
              <p className="text-gray-600">
                Easily schedule appointments with doctors and specialists at your convenience.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">
              <FaGift className="text-6xl text-green-500 mx-auto mb-6 hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold mb-3">Special Offers</h3>
              <p className="text-gray-600">
                Explore exclusive deals and discounts on salon and medical appointments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
