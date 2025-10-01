import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { FaCut, FaUserMd, FaGift, FaSpa, FaTooth, FaHeartbeat } from "react-icons/fa";
import Autoplay from "embla-carousel-autoplay";

import salon from "../assets/Mens.png";
import medical from "../assets/Healthcare.jpg";
import spa from "../assets/spa-body.png";

// Add more images if needed

const HomePage = () => {
  const serviceImages = [salon, medical,spa]; // Add more images here
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-12 p-6 max-w-7xl mx-auto">
      {/* Carousel Section */}
      {/* <Carousel
        className="w-full max-w-6xl h-full"
        opts={{ align: "start", loop: true }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent className="h-[500px]">
          {serviceImages.map((image, index) => (
            <CarouselItem key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-full w-full cursor-pointer"
                onClick={() => navigate("/booking")}
              >
                    <img
                      src={image}
                      alt={`Service ${index + 1}`}
                      className="rounded-md object-cover w-full h-full"
                      style={{ maxHeight: "4200px" }}
                    />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel> */}

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl text-center px-4"
      >
        <h4 className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight">
          Welcome to <span className="text-primary">TapApt</span> your one-stop appointment booking solution! Easily schedule your appointments online with just a few clicks. Choose your service, select a convenient time, and confirm your booking instantly.
        </h4>
      </motion.div>

      {/* Book Now Button */}
      <motion.div whileHover={{ scale: 1.1 }}>
        <Button size="lg" asChild>
          <Link to="/booking">Book Now</Link>
        </Button>
      </motion.div>

      {/* Services Section */}
      <div className="w-full py-20 bg-muted/40 rounded-xl">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            Our Services
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <FaCut className="text-5xl text-pink-500 mb-4" />,
                title: "Salon Services",
                desc: "Book men’s and women’s salon services with professional staff.",
              },
              {
                icon: <FaUserMd className="text-5xl text-blue-500 mb-4" />,
                title: "Doctor Appointments",
                desc: "Easily schedule appointments with doctors and specialists.",
              },
              {
                icon: <FaGift className="text-5xl text-green-500 mb-4" />,
                title: "Special Offers",
                desc: "Exclusive deals and discounts on salon and medical bookings.",
              },
              {
                icon: <FaSpa className="text-5xl text-purple-500 mb-4" />,
                title: "Spa & Wellness",
                desc: "Relax with massage, spa, and wellness treatments.",
              },
              {
                icon: <FaTooth className="text-5xl text-teal-500 mb-4" />,
                title: "Dentist Appointments",
                desc: "Book dental checkups and treatments with trusted dentists.",
              },
              {
                icon: <FaHeartbeat className="text-5xl text-red-500 mb-4" />,
                title: "Health Checkups",
                desc: "Preventive health packages and regular checkups made easy.",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => navigate("/booking")}>
                  <CardHeader>
                    <div className="flex justify-center">{service.icon}</div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.desc}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;