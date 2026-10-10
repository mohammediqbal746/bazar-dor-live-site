'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import PriceTicker from './PriceTicker';
import { useEffect, useState } from 'react';
import { getCategories } from '../lib/api';
import { Category } from '../types';

export default function Navbar() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  
  const isLoggedIn = false; 

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link href="/" className="flex flex-col">
          <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
            <span className="text-2xl">🛒</span>
            <span>বাজার দর</span>
          </div>
          <span className="text-xs text-gray-500 mt-1">{today}</span>
        </Link>

        <nav className="hidden md:flex gap-5">
          <Link 
            href="/"
            className={`font-medium transition-colors hover:text-green-600 ${
              pathname === '/' ? 'text-green-600 border-b-2 border-green-600 pb-1' : 'text-gray-600'
            }`}
          >
            সব পণ্য
          </Link>
          {categories.slice(0, 5).map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/category/${cat.slug}`}
              className={`font-medium transition-colors hover:text-green-600 ${
                pathname === `/category/${cat.slug}` ? 'text-green-600 border-b-2 border-green-600 pb-1' : 'text-gray-600'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link href="/profile" className="btn btn-outline btn-sm btn-success">
              <User className="w-4 h-4" /> প্রোফাইল
            </Link>
          ) : (
            <>
              <Link href="/signin" className="btn btn-ghost btn-sm">সাইন ইন</Link>
              <Link href="/signup" className="btn btn-primary btn-sm bg-green-600 hover:bg-green-700 border-none text-white">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>
      
      <div className="md:hidden flex overflow-x-auto gap-4 px-4 pb-3 text-sm border-b whitespace-nowrap overflow-y-hidden">
        <Link 
            href="/"
            className={`${pathname === '/' ? 'text-green-600 font-bold' : 'text-gray-600'}`}
        >
            সব পণ্য
        </Link>
        {categories.map((cat) => (
            <Link 
                key={cat.slug} 
                href={`/category/${cat.slug}`}
                className={`${pathname === `/category/${cat.slug}` ? 'text-green-600 font-bold' : 'text-gray-600'}`}
            >
                {cat.name}
            </Link>
        ))}
      </div>

      <PriceTicker />
    </header>
  );
}