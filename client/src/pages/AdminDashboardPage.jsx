import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { getAllAppointments } from '../services/appointment.service';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import AvailabilityManagement from '../components/AvailabilityManagement';
import ServiceManagement from '../components/ServiceManagement';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const AdminDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllAppointments();

        const sortedData = data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        setAppointments(sortedData);
      } catch (err) {
        setError(err.message || 'Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    }
    fetchAllAppointments();
  }, []);


  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    const now = new Date();

    switch (filter) {
      case 'day':
        return appointments.filter(appt => isToday(new Date(appt.startTime)));
      case 'week':
        return appointments.filter(appt => isThisWeek(new Date(appt.startTime)));
      case 'month':
        return appointments.filter(appt => isThisMonth(new Date(appt.startTime)));
      case 'all':
      default:
        return appointments;
    }
  }, [appointments, filter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className='scroll-m-20 text-xl font-semibold tracking-tight justify-center align-center items-center flex mb-10'>
        Admin Dashboard
      </h2>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className='w-full'>
          <TabsTrigger value="appointments">All Appointments</TabsTrigger>
          <TabsTrigger value="service">Services</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        <DropdownMenuSeparator />
        <TabsContent value="appointments">
          <h3 className='scroll-m-20 text-md font-semibold tracking-tight justify-center align-center items-center flex mt-10'>
            All Appointments</h3>
          <div className='flex justify-center gap-2 m-5'>
            <h3 className='scroll-m-20 text-md font-semibold tracking-tight justify-center align-center items-center flex'>
              Filters: </h3>
            {['all', 'day', 'week', 'month'].map((period) => (
              <Button
                key={period}
                onClick={() => setFilter(period)}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  border: '1px solid #007bff',
                  borderRadius: '5px',
                  textTransform: 'capitalize',
                  backgroundColor: filter === period ? '#007bff' : 'white',
                  color: filter === period ? 'white' : '#007bff',
                  fontWeight: filter === period ? 'bold' : 'normal',
                }}
              >
                {period === 'all' ? 'All Time' : `This ${period}`}
              </Button>
            ))}
          </div>

          {filteredAppointments.length === 0 ? (
            <p>No appointments match the current filter.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-base">
                  <TableHead className="w-[100px]">Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appt, index) => (
                  <TableRow key={index} className="text-base">
                    <TableCell className="font-medium">{appt.client.name}</TableCell>
                    <TableCell>{appt.service.name}</TableCell>
                    <TableCell>{format(new Date(appt.startTime), 'MMMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">{format(new Date(appt.startTime), 'p')}</TableCell>
                    <TableCell className="text-right">{appt.status}</TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>

          )}
        </TabsContent>
        <TabsContent value="service">
          <ServiceManagement />
        </TabsContent>
        <TabsContent value="availability">
          <AvailabilityManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;