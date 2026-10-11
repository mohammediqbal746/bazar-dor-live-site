import Link from 'next/link';
import { Product } from '../lib/types';

// ইংরেজি সংখ্যাকে বাংলায় কনভার্ট করার ফাংশন
const toBengaliNumber = (num: number | string) => {
  const benNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/[0-9]/g, (w) => benNums[w as unknown as number]);
};

export default function ProductCard({ product }: { product: Product }) {
  // দামের পরিবর্তন লজিক
  const isUp = product.change?.dir === 'up';
  const isDown = product.change?.dir === 'down';
  const pct = product.change?.pct || 0;
  
  // ইউনিট বাংলায় কনভার্ট
  const unitBn = product.unit === 'kg' ? 'কেজি' : product.unit === 'liter' ? 'লিটার' : product.unit === 'hali' ? 'হালি' : product.unit;

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="card bg-white shadow-sm hover:shadow-xl transition-shadow border border-gray-100 cursor-pointer h-full">
        <div className="card-body p-5">
          <div className="text-5xl mb-3 text-center">{product.image}</div>
          <h2 className="card-title text-lg justify-center text-gray-800 text-center">{product.nameBn}</h2>
          <p className="text-center text-gray-500 text-sm mb-4">প্রতি {unitBn}</p>
          
          <div className="flex flex-col items-center justify-center bg-green-50/50 border border-green-50 rounded-xl p-3">
            <span className="text-xs text-gray-500 mb-1">আজকের দাম</span>
            <div className="text-xl font-bold text-green-700">
              {toBengaliNumber(product.today)} টাকা
            </div>
            
            <div className={`text-sm font-bold mt-1 flex items-center gap-1 ${isUp ? 'text-red-500' : isDown ? 'text-green-500' : 'text-gray-400'}`}>
              {isUp ? '▲' : isDown ? '▼' : '—'} {toBengaliNumber(pct)}%
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}