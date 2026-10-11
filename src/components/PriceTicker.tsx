'use client';

import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { getAllProducts } from '../lib/api';
import { Product } from '../lib/types';

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(data => {
        setProducts(Array.isArray(data) ? data : data?.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ticker API Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-8 bg-green-50 animate-pulse w-full"></div>;

  return (
    <div className="bg-green-100 text-green-900 flex items-center border-b border-green-200">
      <span className="bg-green-600 text-white px-4 py-1 text-sm font-bold whitespace-nowrap z-10 hidden md:block">
        লাইভ বাজার দর
      </span>
      
      <Marquee pauseOnHover={true} speed={50} className="py-1">
        {products.map((p, index) => {
          // API এর সঠিক ফিল্ড অনুযায়ী লজিক
          const isUp = p.change?.dir === 'up';
          const isDown = p.change?.dir === 'down';
          const pct = p.change?.pct || 0;
          
          // ইউনিটের বাংলা কনভার্শন (kg -> কেজি ইত্যাদি)
          const unitBn = p.unit === 'kg' ? 'কেজি' : p.unit === 'liter' ? 'লিটার' : p.unit === 'hali' ? 'হালি' : p.unit;

          return (
            <span key={index} className="mx-6 text-sm font-medium flex items-center gap-1">
              {p.image} {p.nameBn} <span className="text-gray-400 px-1">|</span> 
              {p.today} টাকা / {unitBn}
              
              <span className={`ml-1 font-bold ${isUp ? 'text-red-600' : isDown ? 'text-green-600' : 'text-gray-500'}`}>
                {isUp ? '▲' : isDown ? '▼' : '—'} {pct}%
              </span>
            </span>
          );
        })}
      </Marquee>
    </div>
  );
}