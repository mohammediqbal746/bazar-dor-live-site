'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import PriceTicker from './PriceTicker';
import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/api';
import { Category } from '@/types';
// LogOut আইকনটি ইমপোর্ট করা হলো
import { ChevronDown, ShoppingCart, LogOut } from 'lucide-react';
// BetterAuth ক্লায়েন্ট ইমপোর্ট করা হলো
import { authClient } from '@/lib/auth-client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  
  // BetterAuth থেকে ইউজারের সেশন/লগিন স্টেট আনা হচ্ছে
  const { data: session, isPending } = authClient.useSession();
  
  // ডাইনামিক ইউজার ডাটা
  const isLoggedIn = !!session?.user; 
  const userName = session?.user?.name || "User";

  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(Array.isArray(data) ? data : data?.data || []);
      })
      .catch(err => console.error(err));
  }, []);

  const today = new Intl.DateTimeFormat('bn-BD', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long' 
  }).format(new Date());

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between border-b border-gray-100">
        
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-green-700 text-white p-2 rounded-lg">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 leading-tight">বাজার দর</span>
            <span className="text-xs text-gray-500">{today}</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* লোডিং অবস্থায় থাকলে কিছুই দেখাবে না বা একটি ছোট লোডার দেখাবে */}
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                  <Image 
                    src={`https://ui-avatars.com/api/?name=${userName}&background=16a34a&color=fff`} 
                    alt="Profile" 
                    width={32}
                    height={32}
                    unoptimized
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{userName}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Link>
              
              {/* লগ আউট বাটন */}
              <button 
                onClick={handleLogout} 
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" 
                title="লগ আউট"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/signin" className="font-medium text-gray-600 hover:text-green-600 px-2 text-sm md:text-base">সাইন ইন</Link>
              <Link href="/signup" className="btn btn-primary btn-sm bg-green-600 hover:bg-green-700 border-none text-white">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex overflow-x-auto gap-8 py-3 text-sm whitespace-nowrap scrollbar-hide items-center">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/category/${cat.slug}`}
              className={`font-medium transition-colors flex items-center gap-1.5 ${
                pathname === `/category/${cat.slug}` ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <span className="text-base">{cat.icon}</span> {cat.nameBn || cat.name}
            </Link>
          ))}
        </nav>
      </div>

      <PriceTicker />
    </header>
  );
}