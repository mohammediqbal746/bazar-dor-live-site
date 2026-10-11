'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await authClient.signIn.email({
        email,
        password,
    }, {
        onSuccess: () => {
          alert("সফলভাবে লগিন হয়েছে!");
          router.push('/'); // লগিন সফল হলে হোম পেজে নিয়ে যাবে
          router.refresh(); // Navbar-এর স্টেট আপডেট করার জন্য
        },
        onError: (ctx) => {
          alert(ctx.error.message || "লগিন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড চেক করুন।");
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
          <h2 className="text-3xl font-bold text-gray-900">স্বাগতম!</h2>
          <p className="text-gray-500 mt-2">আপনার অ্যাকাউন্টে লগ ইন করুন</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-sm checkbox-success" />
              <span className="text-gray-600">মনে রাখুন</span>
            </label>
            <a href="#" className="text-green-600 hover:underline font-medium">পাসওয়ার্ড ভুলে গেছেন?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full bg-green-600 hover:bg-green-700 border-none text-white text-lg disabled:bg-gray-400"
          >
            {loading ? 'লগ ইন হচ্ছে...' : 'লগ ইন করুন'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          অ্যাকাউন্ট নেই? <Link href="/signup" className="text-green-600 font-bold hover:underline">নতুন অ্যাকাউন্ট খুলুন</Link>
        </p>
      </div>
    </div>
  );
}