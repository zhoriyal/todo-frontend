import React from "react";
import Link from "next/link";

function LoginForm() {
  return (
    <form className="space-y-4" method="post">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Masuk
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <header className="mb-6 border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke akun Anda.</p>
        </header>

        {/* Form Komponen */}
        <LoginForm />

        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}