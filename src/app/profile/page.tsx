'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // লগিন চেক এবং নাম সেট করা
  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/signin'); // লগিন না থাকলে সাইন ইন পেজে পাঠিয়ে দেবে
      } else if (session.user) {
        setName(session.user.name || '');
      }
    }
  }, [session, isPending, router]);

  // লগ আউট ফাংশন
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
        }
      }
    });
  };

  // নাম আপডেট ফাংশন
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    await authClient.updateUser({
      name: name
    }, {
      onSuccess: () => {
        alert('আপনার নাম সফলভাবে আপডেট হয়েছে!');
        setIsUpdating(false);
        router.refresh();
      },
      onError: (ctx) => {
        alert(ctx.error.message);
        setIsUpdating(false);
      }
    });
  };

  if (isPending || !session) {
    return <div className="min-h-[60vh] flex justify-center items-center">লোড হচ্ছে...</div>;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* পেজ হেডার */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-gray-500 text-sm mt-1">আপনার অ্যাকাউন্টের তথ্য এখান থেকে দেখুন</p>
        </div>

        {/* প্রোফাইল কার্ড */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative">
              <Image 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=16a34a&color=fff&size=128`} 
                alt={user.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            লগ আউট
          </button>
        </div>

        {/* তথ্য আপডেট ফর্ম */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">তথ্য</h3>
          
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">নাম</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white text-gray-900"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isUpdating || name === user.name}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isUpdating ? 'আপডেট হচ্ছে...' : 'আপডেট'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}