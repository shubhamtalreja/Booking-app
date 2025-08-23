import React, { useEffect, useState } from 'react'
import { getAllServices, createService, updateService, deleteService } from '../services/service'


const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', duration: '', price: '' });


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
    },[]);

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles the form submission for both creating and updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        // --- UPDATE LOGIC ---
        const updated = await updateService(editingService._id, formData);
        // Find the index of the old service and replace it with the updated one.
        setServices(services.map((s) => (s._id === updated._id ? updated : s)));
      } else {
        // --- CREATE LOGIC ---
        const newService = await createService(formData);
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
  };

  // Resets the form and exits "edit mode"
  const resetForm = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', duration: '', price: '' });
  };

  if (loading) return <p>Loading services...</p>;
  
  return (
    <div style={{ marginTop: '40px' }}>
      <h3>Manage Services</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* --- The Create/Edit Form --- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h4>{editingService ? 'Edit Service' : 'Add a New Service'}</h4>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Service Name" required style={{ marginRight: '10px', padding: '8px' }}/>
        <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required style={{ marginRight: '10px', padding: '8px' }}/>
        <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Duration (mins)" required style={{ marginRight: '10px', padding: '8px' }}/>
        <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" required style={{ marginRight: '10px', padding: '8px' }}/>
        <button type="submit" style={{ padding: '8px 12px', cursor: 'pointer' }}>{editingService ? 'Update Service' : 'Add Service'}</button>
        {editingService && <button type="button" onClick={resetForm} style={{ marginLeft: '10px', padding: '8px 12px', cursor: 'pointer' }}>Cancel</button>}
      </form>

      {/* --- The List of Existing Services --- */}
      <div>
        {services.map((service) => (
          <div key={service._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #ddd', marginBottom: '10px' }}>
            <div>
              <strong>{service.name}</strong> ({service.duration} mins) - ${service.price}
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>{service.description}</p>
            </div>
            <div>
              <button onClick={() => startEditing(service)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(service._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ServiceManagement
