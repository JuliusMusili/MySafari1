import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setErr(null);
      await api.post('/auth/register', { name, email, password, phone });
      nav('/login');
    } catch (err) {
      setErr(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full p-3 border rounded" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full p-3 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full p-3 border rounded" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input className="w-full p-3 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button className="w-full bg-green-600 text-white py-3 rounded">Create account</button>
        </form>
      </div>
    </div>
  );
}
