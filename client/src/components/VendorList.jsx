import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getAllVendors } from '@/services/vendorService';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);



  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await getAllVendors();
        setVendors(response.allVendors);
        setError(null);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, []);

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
    );
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className='flex flex-col gap-4'>
      <h3 className="text-xl font-semibold flex justify-center items-center">
        All Vendors &nbsp;
      </h3>
      <div className='services-container grid-cols-3'>
        {vendors?.map((vendor) => (
          <div
            key={vendor._id}
            className="flex justify-between items-center bg-white rounded-md shadow p-4 border hover:shadow-lg transition cursor-pointer"
            style={{ border: '1px solid #e0e0e0' }}
          >
            {/* Left: info */}
            <div className="flex-1 pr-4">
              {/* {service.isBestseller && (
                <div className="text-green-700 text-xs font-bold mb-1">
                  BESTSELLER IN DELHI NCR
                </div>
              )} */}
              <div className="font-bold text-lg">{vendor.name}</div>
              <div className="text-gray-700 text-sm mb-2">{vendor.description}</div>
              <div className="flex gap-6 text-base font-medium">
                {/* <span>{vendor.address}</span>
                <span>{vendor.city} </span> */}
                <span>{vendor.category} </span>
                {/* {service.rating && (
                  <span className="text-purple-700">
                    ★ {service.rating} ({service.reviews})
                  </span>
                )} */}
              </div>
              <Button
                className="cursor-pointer p-0"
                variant='link'
                style={{ color: "#4810efff" }}
                onClick={() => { setVendorDetails(vendor); setIsOpen(!isOpen) }}
              >
                View Details
              </Button>
            </div>
            {/* Right: image + button */}
            <div className="flex flex-col items-center ml-4">
              <img
                src={vendor.imageUrls?.[0] || '/default_service.png'}
                alt={vendor.name}
                className="w-20 h-20 object-cover rounded-lg mb-2"
              />
              <Button
                className="cursor-pointer"
                style={{ backgroundColor: "#28a745", color: "#fff" }}
                // onClick={() => onServiceSelect(service)}
              >
                Services
              </Button>
            </div>

          </div>

        ))}

      </div>

              {isOpen && vendorDetails &&
      <div className="modal-content overflow-auto  max-h-[500px]">
        <div className="modal-header">
          <h3>Vendor Details</h3>
        </div>

        <div className="modal-body">
          <Card className="p-4 flex flex-col items-center">
            {/* Image centered */}
            <Carousel
              className="w-full max-w-sm mb-4"
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 2000,
                }),
              ]}
            >
              <CarouselContent>
                {vendorDetails.imageUrls && vendorDetails.imageUrls.length > 0 ? (
                  vendorDetails.imageUrls.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded">
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="object-cover w-full h-full rounded"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="flex items-center justify-center w-full h-64 bg-gray-200 text-gray-500">
                      No Image Available
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
               {vendorDetails.imageUrls?.length > 0 && <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full shadow-md" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full shadow-md" /></>}
            </Carousel>

            {/* Text aligned left under image */}
            <div className="w-full text-left space-y-2">
              <p><strong>Description:</strong> {vendorDetails.description}</p>
              <p><strong>Name:</strong> {vendorDetails.name}</p>
              <p><strong>Address:</strong> {vendorDetails.address}</p>
              <p><strong>City:</strong> {vendorDetails.city}</p>
              <p><strong>Address:</strong> {vendorDetails.address}</p>
              <p><strong>Rating:</strong> &#9733;&#9733;&#9733;&#9733;&#9734;</p>
            </div>
          </Card>
        </div>

        <div className="modal-footer">
          <Button className="btn-cancel" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </div>
          }

    </div>
  );
};

export default VendorList;
