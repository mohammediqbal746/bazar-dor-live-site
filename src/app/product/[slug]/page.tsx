'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, TrendingUp } from 'lucide-react';

interface Product {
  _id: string;
  nameBn?: string;
  name?: string;
  title?: string;
  slug?: string;
  category?: { nameBn?: string; name?: string; slug?: string };
  unit?: string;
  lowestPrice?: number;
  highestPrice?: number;
  averagePrice?: number;
}

const toBnNum = (num: number | string) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/[0-9]/g, (w) => bnDigits[+w]);
};

const formatSlug = (slug: string) => {
  if (!slug) return 'প্রোডাক্ট';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const fallbackData: Record<string, { name: string; category: string; unit: string; icon: string }> = {
  'batam-size-chal': { name: 'বাটাম সাইজ চাল', category: 'চাল', unit: 'কেজি', icon: '🍚' },
  'nazir-chal': { name: 'নাজির চাল', category: 'চাল', unit: 'কেজি', icon: '🍚' },
  'goru-r-mangsho': { name: 'গরুর মাংস', category: 'মাংস', unit: 'কেজি', icon: '🥩' },
  'murgir-mangsho': { name: 'মুরগির মাংস', category: 'মাংস', unit: 'কেজি', icon: '🍗' },
  'rui-mach': { name: 'রুই মাছ', category: 'মাছ', unit: 'কেজি', icon: '🐟' },
  'ilish-mach': { name: 'ইলিশ মাছ', category: 'মাছ', unit: 'কেজি', icon: '🐟' },
  'moshur-dal': { name: 'মসুর ডাল', category: 'ডাল', unit: 'কেজি', icon: '🥣' },
  'chola': { name: 'ছোলা', category: 'ডাল', unit: 'কেজি', icon: '🥣' },
  'alu': { name: 'আলু', category: 'সবজি', unit: 'কেজি', icon: '🥔' },
  'piyaj': { name: 'পেঁয়াজ', category: 'মসলা', unit: 'কেজি', icon: '🧅' },
  'dim': { name: 'ডিম', category: 'ডিম-দুধ', unit: 'হালি', icon: '🥚' },
  'kacha-morich': { name: 'কাঁচা মরিচ', category: 'সবজি', unit: 'কেজি', icon: '🌶️' }
};

function ProductDetailsContent() {
  const params = useParams();
  const slugString = (params?.slug as string) || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugString) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://openapi.programming-hero.com/api/bazardor/products');
        const data = await res.json();
        const productsList = data.data || data;

        if (Array.isArray(productsList)) {
          const matchedProduct = productsList.find((p: Product) =>
            p.slug === slugString ||
            p._id === slugString ||
            (p.name && p.name.toLowerCase().replace(/ /g, '-') === slugString)
          );
          setProduct(matchedProduct || null);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slugString]);

  if (loading || !slugString) {
    return null; // Suspense এর fallback লোডিং দেখাবে
  }

  const fallback = fallbackData[slugString];
  const productName = product?.nameBn || fallback?.name || product?.name || product?.title || formatSlug(slugString);
  const categoryName = product?.category?.nameBn || fallback?.category || product?.category?.name || 'ক্যাটাগরি';
  const categorySlug = product?.category?.slug || 'all';
  
  const safeLowest = product?.lowestPrice || 59;
  const safeHighest = product?.highestPrice || 73;
  const safeAverage = product?.averagePrice || 66;
  const safeUnit = product?.unit || fallback?.unit || 'কেজি';
  const icon = fallback?.icon || '🛒';

  const dummyMarkets = [
    { marketName: 'টঙ্গী বাজার', location: 'ময়মনসিংহ', lowest: safeLowest, highest: safeHighest - 2, average: safeAverage - 1 },
    { marketName: 'বনানী বাজার', location: 'রাজশাহী', lowest: safeLowest + 2, highest: safeHighest - 1, average: safeAverage + 1 },
    { marketName: 'কারওয়ান বাজার', location: 'ঢাকা', lowest: safeLowest + 5, highest: safeHighest, average: safeAverage + 3 },
    { marketName: 'মহাখালী বাজার', location: 'রাজশাহী', lowest: safeLowest + 1, highest: safeHighest - 3, average: safeAverage - 2 },
    { marketName: 'মিরপুর ১, ঢাকা', location: 'ঢাকা', lowest: safeLowest, highest: safeHighest - 4, average: safeAverage - 3 },
  ];

  return (
    <div className="bg-[#F8FAF9] min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        <div className="flex items-center text-[15px] text-gray-500 mb-8 gap-2">
          <Link href="/" className="hover:text-green-600">হোম</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/category/${categorySlug}`} className="hover:text-green-600">
            {categoryName}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{productName}</span>
        </div>

        <div className="bg-white rounded-[24px] border border-gray-100 p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
          <div className="flex items-center gap-8">
            <div className="w-[120px] h-[120px] bg-[#F4F6F5] rounded-[32px] flex items-center justify-center p-4">
              <span className="text-[64px] drop-shadow-sm">{icon}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <h1 className="text-[40px] leading-none font-bold text-gray-900 tracking-tight">{productName}</h1>
              <p className="text-gray-500 text-[18px]">প্রতি {safeUnit} · {categoryName}</p>
              <p className="text-gray-800 text-[18px] mt-1">গতকালের তুলনায় আজ দাম বেড়েছে · ২ টাকা</p>
            </div>
          </div>

          <div className="bg-[#F9FAFB] border border-gray-100 p-6 rounded-[20px] text-center min-w-[160px]">
            <p className="text-gray-500 text-[15px] mb-1.5">আজকের দাম</p>
            <p className="text-[40px] font-bold text-gray-900 leading-none mb-1">{toBnNum(Math.round(safeAverage))}</p>
            <p className="text-gray-500 text-[15px] mb-3">টাকা / {safeUnit}</p>
            <div className="inline-flex items-center gap-1 text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-md">
              <TrendingUp className="w-4 h-4" />
              <span>০.২%</span>
            </div>
          </div>
        </div>

        <h3 className="text-[22px] font-bold text-gray-900 mb-6">দামের সারসংক্ষেপ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm">
            <p className="text-gray-800 text-[17px] font-medium mb-3">সর্বনিম্ন দাম</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[40px] font-bold text-[#10B981] leading-none">{toBnNum(Math.round(safeLowest))}</span>
              <span className="text-[22px] font-bold text-[#10B981]">টাকা</span>
            </div>
            <p className="text-[#10B981] text-[15px] mt-2">সবচেয়ে কম দামের বাজার</p>
          </div>
          
          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm">
            <p className="text-gray-800 text-[17px] font-medium mb-3">গড় দাম</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[40px] font-bold text-[#3B82F6] leading-none">{toBnNum(Math.round(safeAverage))}</span>
              <span className="text-[22px] font-bold text-[#3B82F6]">টাকা</span>
            </div>
            <p className="text-gray-400 text-[15px] mt-2">ঢাকার অধিকাংশ বাজারের দাম</p>
          </div>
          
          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm">
            <p className="text-gray-800 text-[17px] font-medium mb-3">সর্বোচ্চ দাম</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[40px] font-bold text-[#EF4444] leading-none">{toBnNum(Math.round(safeHighest))}</span>
              <span className="text-[22px] font-bold text-[#EF4444]">টাকা</span>
            </div>
            <p className="text-gray-400 text-[15px] mt-2">প্রতি {safeUnit}-এর হিসাবে</p>
          </div>
        </div>

        <h3 className="text-[22px] font-bold text-gray-900 mb-6">বাজারভিত্তিক আজকের দাম</h3>
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[16px] text-gray-500 border-b border-gray-100 bg-white">
                <tr>
                  <th className="px-8 py-5 font-normal">বাজার</th>
                  <th className="px-8 py-5 font-normal">অবস্থান</th>
                  <th className="px-8 py-5 font-normal text-center">সর্বনিম্ন</th>
                  <th className="px-8 py-5 font-normal text-center">সর্বোচ্চ</th>
                  <th className="px-8 py-5 font-normal text-right">গড়</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-[16px]">
                {dummyMarkets.map((market, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-8 py-5">{market.marketName}</td>
                    <td className="px-8 py-5 text-gray-500">{market.location}</td>
                    <td className="px-8 py-5 text-center text-[#10B981] font-medium">{toBnNum(Math.round(market.lowest))} টাকা</td>
                    <td className="px-8 py-5 text-center text-[#EF4444] font-medium">{toBnNum(Math.round(market.highest))} টাকা</td>
                    <td className="px-8 py-5 text-right font-medium">{toBnNum(Math.round(market.average))} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// 🟢 পুরো কম্পোনেন্টটিকে Suspense দিয়ে মুড়িয়ে দেওয়া হলো
export default function ProductDetails() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex justify-center items-center text-green-600 font-medium">লোড হচ্ছে...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}