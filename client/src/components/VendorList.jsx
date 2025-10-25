import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Button } from './ui/button';
import { getAllVendors } from '@/services/vendorService';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



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
            className="flex justify-between items-center bg-white rounded-md shadow p-4 border hover:shadow-lg transition"
            // style={{ border: selectedService?._id === service._id ? '2px solid #28282bff' : '1px solid #e0e0e0' }}
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
                <span>{vendor.address}</span>
                <span>{vendor.city} </span>
                <span>{vendor.category} </span>
                {/* {service.rating && (
                  <span className="text-purple-700">
                    ★ {service.rating} ({service.reviews})
                  </span>
                )} */}
              </div>
              {/* <Button
                className="cursor-pointer p-0"
                variant='link'
                style={{ color: "#4810efff" }}
                onClick={() => { setServiceDetails(service); setIsOpen(true) }}
              >
                View Details
              </Button> */}
            </div>
            {/* Right: image + button */}
            {/* <div className="flex flex-col items-center ml-4">
              <img
                src={service.imageUrls?.[0] || '/default_service.png'}
                alt={service.name}
                className="w-20 h-20 object-cover rounded-lg mb-2"
              />
              <Button
                className="cursor-pointer"
                style={{ backgroundColor: "#28a745", color: "#fff" }}
                onClick={() => onServiceSelect(service)}
              >
                Book Service
              </Button>
            </div> */}

          </div>

        ))}
        {/* <ServiceDetailModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          selection={serviceDetails}

        /> */}
      </div>

    </div>
  );
};

export default VendorList;
