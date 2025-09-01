import { Button } from '@/components/ui/button';
import React from 'react';
import { Link } from 'react-router-dom';
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
  return (
    <div className='flex flex-col items-center justify-center gap-2 p-2'>
      <Carousel className="w-full max-w-lg" opts={{
    align: "start",
    loop: true,
  }}>
        <CarouselContent>
          {serviceImages.map(( image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-2 w-full">
                    <img key={index} src={image} alt={`Image ${index + 1}`} className="rounded-sm" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* <AspectRatio ratio={16 / 9}>
        <Image src="..." alt="Image" className="rounded-md object-cover" />
      </AspectRatio> */}
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Welcome to our Appointment Booking App! Easily schedule your appointments
        online with just a few clicks. Choose your preferred service, select a convenient
        date and time, and confirm your booking instantly. Start planning ahead and enjoy a
        hassle-free appointment experience—book your appointment today!</h4>
      <Button className="mt-4" variant="default" size="lg" asChild>
        <Link to="/booking">
          Book Now
        </Link>
      </Button>
    </div>
  );
};


export default HomePage;