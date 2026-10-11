import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';

const toBnNum = (num: number | string | undefined) => {
  if (num === undefined || num === null) return '০';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d)]);
};

const getUnitBn = (unit: string) => {
  const units: Record<string, string> = {
    'kg': 'প্রতি কেজি',
    'l': 'প্রতি লিটার',
    'dozen': 'প্রতি ডজন',
    'hali': 'প্রতি হালি',
    'piece': 'প্রতি পিস',
    'gm': 'প্রতি গ্রাম'
  };
  return units[unit?.toLowerCase()] || `প্রতি ${unit}`;
};

const ProductCard = ({ product }: { product: Product }) => {
  const isUp = product.change?.dir === 'up';
  const isDown = product.change?.dir === 'down';
  const changeColor = isUp ? 'text-green-600 bg-green-50' : isDown ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50';
  const changeIcon = isUp ? '▲' : isDown ? '▼' : '—';
  const pct = product.change?.pct || 0;

  return (
    <Link href={`/product/${product.slug}`} className="block bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-green-200 group">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-gray-50 flex items-center justify-center rounded-xl text-3xl group-hover:scale-110 transition-transform">
          {product.image || product.categoryIcon || '🛒'}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{product.nameBn || product.name}</h3>
          <span className="text-sm text-gray-500">{getUnitBn(product.unit)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <div>
          <p className="text-xs text-gray-400 mb-1">আজকের দাম</p>
          <p className="font-bold text-lg text-gray-900">{toBnNum(product.today)} টাকা</p>
        </div>
        <div className={`px-2.5 py-1 rounded-lg font-semibold text-sm flex items-center gap-1 ${changeColor}`}>
          {changeIcon} {toBnNum(pct)}%
        </div>
      </div>
    </Link>
  );
};

export default async function Home() {
  let products = [];
  try {
    const res = await fetch('https://openapi.programming-hero.com/api/bazardor/products', { next: { revalidate: 60 } });
    const data = await res.json();
    products = Array.isArray(data) ? data : (data?.data || []);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  const risers = [...products]
    .filter(p => p.change?.dir === 'up')
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);
    
  const fallers = [...products]
    .filter(p => p.change?.dir === 'down')
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-gray-50/50">
      <section className="bg-green-50/50 py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">
              <span className="mr-2">🌱</span>বাজারের সেরা দাম
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              প্রতিদিনের বাজার দর <br/> <span className="text-green-600">এক নজরে</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed">
              চাল, ডাল, তেল থেকে শুরু করে সবজি ও মাছ-মাংসের সর্বশেষ খুচরা মূল্য জেনে নিন খুব সহজেই। আপনার প্রতিদিনের বাজারের হিসাব হোক আরও সহজ।
            </p>
            <div className="pt-4">
              <a href="#all-products" className="btn bg-green-600 hover:bg-green-700 text-white border-none rounded-xl px-8 text-lg inline-flex h-12 items-center justify-center">
                আজকের দাম দেখুন
              </a>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <Image 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" 
              alt="Bazar Dor" 
              fill 
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        
        {risers.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">আজ দাম বেড়েছে</h2>
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm font-bold">▲</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {risers.map(product => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          </section>
        )}

        {fallers.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">আজ দাম কমেছে</h2>
              <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-sm font-bold">▼</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallers.map(product => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          </section>
        )}

        <section id="all-products" className="scroll-mt-24 pt-8 border-t border-gray-100">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">সব পণ্য</h2>
            <p className="text-gray-500">আপনার প্রয়োজনীয় সকল বাজারের তালিকা ও আজকের আপডেট মূল্য</p>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              কোনো প্রোডাক্ট পাওয়া যায়নি।
            </div>
          )}
        </section>

      </div>
    </main>
  );
}