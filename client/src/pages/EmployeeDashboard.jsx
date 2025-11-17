import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard(){
  const [bookings, setBookings] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('mysafari_token');
    if (!token) { nav('/login'); return; }
    setAuthToken(token);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/me');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <div>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={()=>{
            localStorage.removeItem('mysafari_token'); localStorage.removeItem('mysafari_user'); setAuthToken(null); nav('/login');
          }}>Logout</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">Book a Ride</h3>
          <BookingForm onSuccess={fetchBookings} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">Your Bookings</h3>
          <BookingList bookings={bookings} refresh={fetchBookings} />
        </div>
      </div>
    </div>
  );
}
