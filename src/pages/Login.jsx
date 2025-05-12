import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
export default function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd]   = useState('');
  const { signIn } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">Login</h2>
        <form onSubmit={e => { e.preventDefault(); signIn(email,pwd); }} className="w-full">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-2 rounded text-black border border-gray-300" />
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Password" className="w-full p-2 mb-4 rounded text-black border border-gray-300" />
          <button type="submit" className="w-full px-4 py-2 bg-purple-700 text-white rounded">Login</button>
          <p className="mt-4 text-sm"><a href="/signup" className="underline text-purple-700">Create an account</a></p>
        </form>
      </div>
    </div>
  );
}