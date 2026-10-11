'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
    }, {
        onSuccess: () => {
          alert("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
          router.push('/signin'); // সফল হলে লগিন পেজে নিয়ে যাবে
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          setLoading(false);
        }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex bg-green-700 text-white p-3 rounded-xl mb-4">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">নতুন অ্যাকাউন্ট</h2>
          <p className="text-gray-500 mt-2">বাজার দর-এ যুক্ত হতে তথ্য দিন</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পুরো নাম" 
              className="input input-bordered w-full focus:outline-none focus:border-green-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল অ্যাড্রেস</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল দিন" 
              className="input input-bordered w-full focus:outline-none focus:border-green-500 bg-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="input input-bordered w-full focus:outline-none focus:border-green-500 bg-white"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full bg-green-600 hover:bg-green-700 border-none text-white text-lg disabled:bg-gray-400"
          >
            {loading ? 'প্রসেস হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          ইতোমধ্যে অ্যাকাউন্ট আছে? <Link href="/signin" className="text-green-600 font-bold hover:underline">লগ ইন করুন</Link>
        </p>
      </div>
    </div>
  );
}