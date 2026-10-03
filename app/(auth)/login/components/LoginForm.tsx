'use client';

import React, { useState } from 'react';
import { authService } from '@/services/authService';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah reload halaman bawaan HTML
    setError('');

    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login({
        username: username.trim(),
        password,
      });

      if (res.success || authService.getToken()) {
        window.location.href = '/'; // Pindah ke halaman utama
      } else {
        setError(res.message || 'Username atau password salah!');
      }
    } catch (err: any) {
      const message =
        err?.message || 'Gagal terhubung ke server backend atau akun salah!';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        />
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </div>
    </form>
  );
}