'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import PriceTicker from './PriceTicker';
import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/api';
import { Category } from '@/types';
import { ChevronDown, ShoppingCart, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  
  const { data: session, isPending } = authClient.useSession();
  
  const isLoggedIn = !!session?.user; 
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image || `https://ui-avatars.com/api/?name=${userName}&background=16a34a&color=fff`;

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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-green-700 text-white p-2 rounded-lg transition-transform duration-200 group-hover:scale-105">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 leading-tight">বাজার দর</span>
            <span className="text-xs text-gray-500">{today}</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition-all duration-200 border border-transparent hover:border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                  <Image 
                    src={userImage} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{userName}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110" 
                title="লগ আউট"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin" className="font-medium text-gray-600 hover:text-green-600 px-3 py-1.5 rounded-lg transition-colors text-sm md:text-base">সাইন ইন</Link>
              <Link href="/signup" className="btn btn-primary btn-sm bg-green-600 hover:bg-green-700 border-none text-white transition-transform duration-200 hover:scale-105">সাইন আপ</Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 border-t border-gray-50">
        <style jsx global>{`
          .hide-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <nav className="flex overflow-x-auto gap-8 pt-3 pb-0 text-sm whitespace-nowrap hide-scroll items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/category/${cat.slug}`}
              className={`font-medium transition-all duration-200 flex items-center gap-1.5 pb-3 border-b-2 ${
                pathname === `/category/${cat.slug}` 
                ? 'text-green-600 border-green-600' 
                : 'text-gray-600 border-transparent hover:text-green-600 hover:border-green-200'
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