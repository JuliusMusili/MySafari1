import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function BookingForm({ onSuccess }) {
  const [routes, setRoutes] = useState([]);
  const [routeId, setRouteId] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(()=> {
    const fetchRoutes = async () => {
      try {
        const res = await api.get('/routes');
        setRoutes(res.data);
      } catch (err) {
        console.warn('Could not fetch routes', err);
      }
    };
    fetchRoutes();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setMsg('');
      await api.post('/bookings', { routeId, shiftEnd });
      setMsg('Booking requested — admin will assign vehicle.');
      onSuccess && onSuccess();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to book');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Route</span>
        <select required value={routeId} onChange={e=>setRouteId(e.target.value)} className="w-full p-2 border rounded mt-1">
          <option value="">-- select route --</option>
          {routes.map(r=> <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Shift End (date & time)</span>
        <input required type="datetime-local" value={shiftEnd} onChange={e=>setShiftEnd(e.target.value)} className="w-full p-2 border rounded mt-1" />
      </label>

      <button className="px-4 py-2 bg-green-600 text-white rounded">Request Ride</button>
      {msg && <div className="text-sm text-green-700 mt-2">{msg}</div>}
    </form>
  );
}
