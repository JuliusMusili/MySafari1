import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(){
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">MySafari</Link>
        <div className="space-x-3">
          <Link to="/login" className="text-sm">Login</Link>
          <Link to="/register" className="text-sm">Register</Link>
        </div>
      </div>
    </nav>
  );
}
