// app/register/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../store/auth';
import getBackendUrl from '@/utils/get_be';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();

  const handleRegister = async () => {
    // Replace with your actual registration API call

    const response = await fetch(getBackendUrl() + '/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.access_token, new Date().getTime() + 3600 * 1000); // Token expires in 1 hour
      setUser(email);
      router.push('/');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterPage;