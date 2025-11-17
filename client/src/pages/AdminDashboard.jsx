import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import ReportsChart from '../components/ReportsChart';

export default function AdminDashboard(){
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [driverName, setDriverName] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [contact, setContact] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const nav = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('mysafari_token');
    if (!token) { nav('/login'); return; }
    setAuthToken(token);
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const b = await api.get('/admin/bookings');
      setBookings(b.data);
      const an = await api.get('/admin/analytics');
      setAnalytics(an.data);
    } catch (err) {
      console.error(err);
    }
  };

  const assignDriver = async (bookingId) => {
    try {
      await api.put(`/admin/booking/${bookingId}/assign`, {
        driverName, vehicleReg, contact, status: 'confirmed'
      });
      setDriverName(''); setVehicleReg(''); setContact('');
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = async () => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/export/bookings.csv`, '_blank');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={()=>{
            localStorage.removeItem('mysafari_token'); localStorage.removeItem('mysafari_user'); setAuthToken(null); nav('/login');
          }}>Logout</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Total bookings</h3>
          <div className="text-2xl">{analytics?.totalBookings ?? '—'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Confirmed</h3>
          <div className="text-2xl">{analytics?.confirmed ?? '—'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Pending</h3>
          <div className="text-2xl">{analytics?.pending ?? '—'}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Bookings</h2>
            <button onClick={exportCSV} className="px-3 py-1 border rounded">Export CSV</button>
          </div>
          <ul className="space-y-3 max-h-[60vh] overflow-auto">
            {bookings.map(b => (
              <li key={b._id} className="p-3 border rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{b.route?.name}</div>
                    <div className="text-sm">User: {b.user?.name} ({b.user?.email})</div>
                    <div className="text-sm">Shift end: {new Date(b.shiftEnd).toLocaleString()}</div>
                    <div className="text-sm">Status: {b.status}</div>
                    {b.driver?.name && <div className="text-sm">Driver: {b.driver.name}</div>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={()=>setSelectedBooking(b)}>Assign</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Assign Driver</h2>
          {selectedBooking ? (
            <>
              <div className="mb-2">Booking for: <strong>{selectedBooking.user?.name}</strong> — {selectedBooking.route?.name}</div>
              <input className="w-full p-2 border rounded mb-2" placeholder="Driver name" value={driverName} onChange={e=>setDriverName(e.target.value)} />
              <input className="w-full p-2 border rounded mb-2" placeholder="Vehicle reg" value={vehicleReg} onChange={e=>setVehicleReg(e.target.value)} />
              <input className="w-full p-2 border rounded mb-2" placeholder="Contact" value={contact} onChange={e=>setContact(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={()=>assignDriver(selectedBooking._id)} className="px-4 py-2 bg-green-600 text-white rounded">Assign & Confirm</button>
                <button onClick={()=>setSelectedBooking(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600">Select a booking to assign driver</div>
          )}

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Usage by route</h3>
            <ReportsChart data={analytics?.byRoute || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
