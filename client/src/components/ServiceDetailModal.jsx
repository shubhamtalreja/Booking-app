import React from 'react'
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import { Button } from './ui/button';

const ServiceDetailModal = ({ isOpen, onClose, selection }) => {
  if (!isOpen || !selection) {
    return null;
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Service Details</h3>
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
                {selection.imageUrls && selection.imageUrls.length > 0 ? (
                  selection.imageUrls.map((image, index) => (
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
               {selection.imageUrls?.length > 0 && <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full shadow-md" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full shadow-md" /></>}
            </Carousel>

            {/* Text aligned left under image */}
            <div className="w-full text-left space-y-2">
              <p><strong>Description:</strong> {selection.description}</p>
              <p><strong>Service:</strong> {selection.name}</p>
              <p><strong>Price:</strong> &#8377;{selection.price}</p>
              <p><strong>Rating:</strong> &#9733;&#9733;&#9733;&#9733;&#9734;</p>
            </div>
          </Card>
        </div>

        <div className="modal-footer">
          <Button className="btn-cancel" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;
