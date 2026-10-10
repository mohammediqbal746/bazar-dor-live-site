'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts } from '@/lib/api';
import { Product, Market } from '@/types'; // <-- এখানে Market ইমপোর্ট করা হয়েছে

// ইংরেজি সংখ্যাকে বাংলায় কনভার্ট করার ফাংশন
const toBengaliNumber = (num: number | string) => {
  if (!num) return '০';
  const benNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/[0-9]/g, (w) => benNums[w as unknown as number]);
};

export default function ProductDetails() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(data => {
        const products = Array.isArray(data) ? data : data?.data || [];
        const foundProduct = products.find((p: Product) => p.slug === slug);
        setProduct(foundProduct || null);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="pt-20 text-center text-xl animate-pulse text-green-600">লোড হচ্ছে...</div>;
  }

  if (!product) {
    return (
      <div className="pt-20 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">প্রোডাক্ট পাওয়া যায়নি!</h2>
        <Link href="/" className="btn btn-primary">হোম পেজে ফিরে যান</Link>
      </div>
    );
  }

  let minPrice = Number(product.today);
  let maxPrice = Number(product.today);
  
  if (product.markets && product.markets.length > 0) {
    // <-- এখানে any এর বদলে Market ব্যবহার করা হয়েছে
    const minPrices = product.markets.map((m: Market) => Number(m.min));
    const maxPrices = product.markets.map((m: Market) => Number(m.max));
    minPrice = Math.min(...minPrices);
    maxPrice = Math.max(...maxPrices);
  }
  const avgPrice = Math.round((minPrice + maxPrice) / 2);

  const unitBn = product.unit === 'kg' ? 'কেজি' : product.unit === 'liter' ? 'লিটার' : product.unit === 'hali' ? 'হালি' : product.unit;

  return (
    <div className="max-w-4xl mx-auto pt-8">
      {/* Top - Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
        <div className="text-8xl bg-green-50 p-6 rounded-full">{product.image}</div>
        <div>
          <div className="flex gap-2 justify-center md:justify-start mb-3">
            <span className="badge badge-success badge-outline">{product.categoryNameBn}</span>
            <span className="badge badge-ghost">প্রতি {unitBn}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.nameBn}</h1>
          <p className="text-gray-500 text-lg">বাজারের সর্বশেষ আপডেট অনুযায়ী {product.nameBn}-এর দামের বিস্তারিত তথ্য।</p>
        </div>
      </div>

      {/* Price - Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center">
          <p className="text-orange-600 font-medium mb-1">সর্বনিম্ন দাম</p>
          <h3 className="text-3xl font-bold text-orange-700">{toBengaliNumber(minPrice)} ৳</h3>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <p className="text-green-600 font-medium mb-1">গড় দাম</p>
          <h3 className="text-4xl font-bold text-green-700">{toBengaliNumber(avgPrice)} ৳</h3>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium mb-1">সর্বোচ্চ দাম</p>
          <h3 className="text-3xl font-bold text-red-700">{toBengaliNumber(maxPrice)} ৳</h3>
        </div>
      </div>

      {/* বাজারভিত্তিক আজকের দাম */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">বাজারভিত্তিক আজকের দাম</h2>
      
      {product.markets && product.markets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* <-- এখানেও any এর বদলে Market ব্যবহার করা হয়েছে */}
          {product.markets.map((market: Market, index: number) => (
            <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{market.market}</h4>
                <p className="text-sm text-gray-500">{market.division}</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-bold text-xl">{toBengaliNumber(market.min)} ৳ - {toBengaliNumber(market.max)} ৳</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <p className="text-gray-500">এই প্রোডাক্টটির বাজারভিত্তিক কোনো তথ্য পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}