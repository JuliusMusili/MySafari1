import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function App(){
  return (
    <div>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold mb-4">MySafari</h1>
          <p className="mb-6">Safe, organised transport bookings for employees leaving after late shifts.</p>
          <div className="space-x-4">
            <Link to="/login" className="px-6 py-3 bg-green-600 text-white rounded-lg">Login</Link>
            <Link to="/register" className="px-6 py-3 border rounded-lg">Register</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
