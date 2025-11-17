import React from 'react';
import api from '../api/api';

export default function BookingList({ bookings, refresh }) {
  const cancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {!bookings?.length && <div className="text-sm text-gray-600">No bookings yet</div>}
      <ul className="space-y-3">
        {bookings.map(b => (
          <li key={b._id} className="p-3 border rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{b.route?.name || 'Route'}</div>
                <div className="text-sm text-gray-600">Shift end: {new Date(b.shiftEnd).toLocaleString()}</div>
                <div className="text-sm">Status: {b.status}</div>
                {b.driver?.name && <div className="text-sm">Driver: {b.driver.name} ({b.driver.vehicleReg})</div>}
              </div>
              <div>
                {b.status === 'pending' && <button onClick={()=>cancel(b._id)} className="px-3 py-1 bg-red-500 text-white rounded">Cancel</button>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
