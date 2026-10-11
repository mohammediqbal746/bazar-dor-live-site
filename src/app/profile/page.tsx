'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [name, setName] = useState('');
  const [initialName, setInitialName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (session?.user?.name && session.user.name !== initialName) {
    setInitialName(session.user.name);
    setName(session.user.name);
  }

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/signin');
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await authClient.updateUser({ name: name });
      alert('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  const userImage = session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=16a34a&color=fff`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-green-50/50 px-8 py-10 border-b border-gray-100 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image 
              src={userImage} 
              alt="Profile" 
              fill 
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{session.user.name}</h1>
            <p className="text-gray-500 mt-1">{session.user.email}</p>
          </div>
        </div>
        
        <div className="p-8 md:p-12">
          <div className="max-w-md mx-auto md:mx-0">
            <h2 className="text-xl font-bold text-gray-900 mb-6">প্রোফাইল আপডেট করুন</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">আপনার নাম</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ইমেইল অ্যাড্রেস</label>
                <input 
                  type="email" 
                  value={session.user.email}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
              </div>
              <button 
                type="submit" 
                disabled={isUpdating || name === session.user.name}
                className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
              >
                {isUpdating ? 'আপডেট হচ্ছে...' : 'প্রোফাইল আপডেট করুন'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}