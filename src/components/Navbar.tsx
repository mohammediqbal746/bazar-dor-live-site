'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/types';
import { ShoppingCart, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image || `https://ui-avatars.com/api/?name=${userName}&background=16a34a&color=fff`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(Array.isArray(data) ? data : data?.data || []);
      })
      .catch(err => console.error(err));
  }, []);

  const currentDate = mounted ? new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(new Date()) : '';

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
        },
      },
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-none mb-1">বাজার দর</h1>
            <p className="text-xs text-gray-500">{currentDate || 'লোড হচ্ছে...'}</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {!isPending && (
            isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <Image 
                    src={userImage} 
                    alt="Profile" 
                    width={32} 
                    height={32} 
                    className="rounded-full border border-gray-200"
                    unoptimized
                  />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 p-2 rounded-lg transition-colors"
                  title="লগ আউট"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
             <div className="flex items-center gap-2">
                <Link href="/signin" className="text-gray-700 hover:text-green-600 font-medium px-4 py-2 text-sm transition-colors">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  সাইন আপ
                </Link>
              </div>
            )
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 py-3 whitespace-nowrap text-sm font-medium">
            {categories.map((category) => {
              const isActive = pathname === `/category/${category.slug}`;
              return (
                <Link 
                  key={category.id || category.slug} 
                  href={`/category/${category.slug}`}
                  className={`flex items-center gap-2 pb-1 transition-colors ${
                    isActive 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-600 hover:text-green-600 border-b-2 border-transparent'
                  }`}
                >
                  {category.icon && <span>{category.icon}</span>}
                  {category.nameBn || category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-[100px]"></header>}>
      <NavbarContent />
    </Suspense>
  );
}