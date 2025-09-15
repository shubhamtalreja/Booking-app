import React, { useEffect, useState } from 'react'
import { getAllServices, createService, updateService, deleteService } from '../services/service'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button';
import { Input } from './ui/input';
import ENV_CONFIG from '@/config/EnvConfig';
import axios from 'axios';


const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', duration: '', price: '' });
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadedUrls = [];
    setImageLoading(true);

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("upload_preset", "service-image");
      const res = await axios.post(
        ENV_CONFIG.IMAGE_UPLOAD_API_URL,
        formData
      );

      uploadedUrls.push(res.data.secure_url);
    }
    setImageLoading(false);

    setImageUrls((prev) => [...prev, ...uploadedUrls]);
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getAllServices();
        setServices(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles the form submission for both creating and updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, imageUrls };
      if (editingService) {
        // --- UPDATE LOGIC ---
        const updated = await updateService(editingService._id, payload);
        // Find the index of the old service and replace it with the updated one.
        setServices(services.map((s) => (s._id === updated._id ? updated : s)));
      } else {
        // --- CREATE LOGIC ---
        const newService = await createService(payload);
        // Add the new service to the top of the list for immediate feedback.
        setServices([newService, ...services]);
      }
      resetForm();
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  // Handles the "Delete" button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        // Filter out the deleted service from the state to update the UI.
        setServices(services.filter((s) => s._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Sets up the form for editing when an "Edit" button is clicked
  const startEditing = (service) => {
    setEditingService(service);
    // Populate the form with the data of the service to be edited.
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
    });
    setImageUrls(service.imageUrls || []);
  };

  // Resets the form and exits "edit mode"
  const resetForm = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', duration: '', price: '' });
    setImageUrls([]);
  };

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

  return (
    <div>
      <h3 className='scroll-m-20 text-md font-semibold tracking-tight justify-center align-center items-center flex mt-10'>
        Manage Services</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* --- The Create/Edit Form --- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h4>{editingService ? 'Edit Service' : 'Add a New Service'}</h4>
        <Input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Service Name" required style={{ marginRight: '10px', padding: '8px' }} />
        <Input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required style={{ marginRight: '10px', padding: '8px' }} />
        <Input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Duration (mins)" required style={{ marginRight: '10px', padding: '8px' }} />
        <Input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" required style={{ marginRight: '10px', padding: '8px' }} />
        <Input type="file" name="image" multiple onChange={handleImageUpload} placeholder="Upload Image" required style={{ marginRight: '10px', padding: '8px' }} />
        {/* Preview */}
        <div className="flex gap-2 mt-5 mb-5">
          {imageUrls.map((url, idx) => (
            <img key={idx} src={url} alt="preview" width="80" />
          ))}
        </div>
        <Button type="submit" style={{ padding: '8px 12px', cursor: 'pointer' }} disabled={imageLoading}>{editingService ? 'Update Service' : 'Add Service'}</Button>
        {editingService && <Button type="button" onClick={resetForm} style={{ marginLeft: '10px', padding: '8px 12px', cursor: 'pointer' }}>Cancel</Button>}
      </form>

      {/* --- The List of Existing Services --- */}
      <div className='services-container grid-cols-3'>

        {services?.map((service) => (
          <Card key={service._id} className='mb-10'>
            {/* Preview */}
            <div className="">
              {service.imageUrls.map((url, idx) => (
                <img key={idx} src={url} alt="preview" width="80" />
              ))}
            </div>
            <CardHeader>
              <CardTitle>
                {service?.name}</CardTitle>
              <CardDescription>
                {service.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p>
                <strong>Time:</strong>{" "}
                {service?.duration} mins
              </p>
              <p>
                <strong>Price:</strong> &#8377;{service?.price}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-1">
              <Button
                onClick={() => startEditing(service)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(service._id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

    </div>
  );
};
export default ServiceManagement
