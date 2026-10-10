'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory, getCategories } from '@/lib/api';
import { Product, Category } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    setLoading(true);
    
    // ক্যাটাগরির প্রোডাক্ট ফেচ করা
    getProductsByCategory(slug)
      .then(data => {
         const fetchedProducts = Array.isArray(data) ? data : data?.data || [];
         setProducts(fetchedProducts);
      })
      .catch(err => console.error(err));

    // টাইটেল এবং আইকনের জন্য ক্যাটাগরি ডিটেইলস ফেচ করা
    getCategories()
      .then(data => {
        const cats = Array.isArray(data) ? data : data?.data || [];
        const currentCat = cats.find((c: Category) => c.slug === slug);
        if (currentCat) setCategory(currentCat);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-10">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // রিকোয়ারমেন্ট: Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-4xl font-bold text-gray-400 mb-4">দুঃখিত!</h2>
        <p className="text-gray-600 mb-6">এই ক্যাটাগরিতে আপাতত কোনো পণ্য পাওয়া যায়নি।</p>
        <Link href="/">
          <button className="btn btn-primary bg-green-600 hover:bg-green-700 border-none text-white">হোম পেজে ফিরে যান</button>
        </Link>
      </div>
    );
  }

  // রিকোয়ারমেন্ট: Challenge 1 (Sort Control)
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'low-to-high') return Number(a.today) - Number(b.today);
    if (sortOption === 'high-to-low') return Number(b.today) - Number(a.today);
    return 0; 
  });

  return (
    <div className="pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {category?.icon || '🛒'} {category?.name || 'ক্যাটাগরি'}
        </h1>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600 whitespace-nowrap">সাজান:</label>
          <select 
            className="select select-bordered select-sm w-full max-w-xs focus:outline-none focus:border-green-500 bg-white"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}