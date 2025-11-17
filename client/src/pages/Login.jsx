import React, { useState } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setErr(null);
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('mysafari_token', token);
      localStorage.setItem('mysafari_user', JSON.stringify(user));
      setAuthToken(token);
      if (user.role === 'admin') nav('/admin');
      else nav('/employee');
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign in to MySafari</h2>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full p-3 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full p-3 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button className="w-full bg-green-600 text-white py-3 rounded">Sign in</button>
        </form>
      </div>
    </div>
  );
}
