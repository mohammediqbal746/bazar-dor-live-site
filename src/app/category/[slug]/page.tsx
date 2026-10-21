'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product, Category } from '@/lib/types';

const toBnNum = (num: number | string | undefined) => {
  if (num === undefined || num === null) return '০';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d)]);
};

const getUnitBn = (unit: string | undefined) => {
  if (!unit) return '';
  const units: Record<string, string> = {
    'kg': 'প্রতি কেজি',
    'l': 'প্রতি লিটার',
    'dozen': 'প্রতি ডজন',
    'hali': 'প্রতি হালি',
    'piece': 'প্রতি পিস',
    'gm': 'প্রতি গ্রাম'
  };
  return units[unit.toLowerCase()] || `প্রতি ${unit}`;
};

const categoryMapping: Record<string, string[]> = {
  'chal': ['চাল', 'chal', 'rice'],
  'dal': ['ডাল', 'dal', 'lentil'],
  'tel': ['তেল', 'tel', 'oil'],
  'sobji': ['সবজি', 'sobji', 'vegetable'],
  'mach': ['মাছ', 'mach', 'fish'],
  'mangsho': ['মাংস', 'mangsho', 'meat', 'beef', 'chicken', 'mutton', 'গরু', 'মুরগি'],
  'dim-dudh': ['ডিম', 'দুধ', 'dim', 'dudh', 'egg', 'milk'],
  'dim-dui': ['ডিম', 'দুধ', 'dim', 'dudh', 'egg', 'milk'],
  'mosla': ['মসলা', 'মশলা', 'mosla', 'moshla', 'spice'],
  'moshla': ['মসলা', 'মশলা', 'mosla', 'moshla', 'spice']
};

type ExtendedProduct = Product & { _id?: string; averagePrice?: number; lowestPrice?: number };

const ProductCard = ({ product }: { product: ExtendedProduct }) => {
  const isUp = product.change?.dir === 'up';
  const isDown = product.change?.dir === 'down';
  const changeColor = isUp ? 'text-green-600 bg-green-50' : isDown ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50';
  const changeIcon = isUp ? '▲' : isDown ? '▼' : '—';
  const pct = product.change?.pct || 0;
  const currentPrice = product.today || product.averagePrice || product.lowestPrice;

  return (
    <Link href={`/product/${product.slug || product.id || product._id}`} className="block bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-green-200 group">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-gray-50 flex items-center justify-center rounded-xl text-3xl group-hover:scale-110 transition-transform">
          {product.icon || product.image || product.categoryIcon || '🛒'}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{product.nameBn || product.name}</h3>
          <span className="text-sm text-gray-500">{getUnitBn(product.unit)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <div>
          <p className="text-xs text-gray-400 mb-1">আজকের দাম</p>
          <p className="font-bold text-lg text-gray-900">{toBnNum(currentPrice)} টাকা</p>
        </div>
        <div className={`px-2.5 py-1 rounded-lg font-semibold text-sm flex items-center gap-1 ${changeColor}`}>
          {changeIcon} {toBnNum(pct)}%
        </div>
      </div>
    </Link>
  );
};

function CategoryPageContent() {
  const params = useParams();
  const slug = (params?.slug as string)?.toLowerCase() || '';

  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://openapi.programming-hero.com/api/bazardor/products');
        const data = await res.json();
        
        const dataValues = [data, data?.data, data?.products, ...(typeof data === 'object' ? Object.values(data) : [])];
        const allItems = dataValues.find(Array.isArray) || [];

        const searchKeywords = categoryMapping[slug] || [slug];

        const categoryProducts = allItems.filter((p: any) => {
          if (!p) return false;
          return searchKeywords.some(keyword => JSON.stringify(p).toLowerCase().includes(keyword));
        });

        setProducts(categoryProducts);

        if (categoryProducts.length > 0) {
          const firstItem = categoryProducts[0];
          const defaultBnNames: Record<string, string> = {
            dim: 'ডিম-দুধ', mach: 'মাছ', chal: 'চাল', dal: 'ডাল', tel: 'তেল', sobji: 'সবজি', mangsho: 'মাংস', mosla: 'মসলা'
          };
          
          const matchedKey = Object.keys(defaultBnNames).find(key => slug.includes(key));
          
          setCategoryInfo({
            id: slug,
            slug: slug,
            name: slug,
            nameBn: firstItem.categoryNameBn || firstItem.category?.nameBn || (matchedKey ? defaultBnNames[matchedKey] : slug),
            icon: firstItem.categoryIcon || firstItem.icon || firstItem.category?.icon || '🛒'
          });
        } else {
          setCategoryInfo(null);
        }
      } catch (error) {
        console.error("Data fetching error:", error);
        setProducts([]);
        setCategoryInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    const getPrice = (item: ExtendedProduct) => item.today || item.averagePrice || item.lowestPrice || 0;
    if (sortOrder === 'asc') return getPrice(a) - getPrice(b);
    if (sortOrder === 'desc') return getPrice(b) - getPrice(a);
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 h-40 animate-pulse flex flex-col justify-between">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                <div className="space-y-2 flex-1 pt-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-4">
                <div className="space-y-1 w-24">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-7 w-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length || !categoryInfo) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">কোনো প্রোডাক্ট পাওয়া যায়নি</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">আপনি যে ক্যাটাগরিটি খুঁজছেন তাতে আপাতত কোনো প্রোডাক্ট নেই অথবা লিংকটি ভুল।</p>
        <Link href="/" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <span className="text-4xl">{categoryInfo.icon || '🛒'}</span> 
          {categoryInfo.nameBn || categoryInfo.name}
        </h1>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-medium text-gray-600 whitespace-nowrap">সাজান:</label>
          <div className="relative">
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:border-green-500 text-sm font-medium cursor-pointer shadow-sm"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id || product.slug || product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center text-green-600 font-medium">লোড হচ্ছে...</div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}