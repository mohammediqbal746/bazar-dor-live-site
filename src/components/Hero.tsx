import Image from "next/image";

export default function Hero() {
  return (
    <div className="hero bg-green-50 rounded-2xl p-6 md:p-12 my-6">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8 w-full justify-between">
        <Image
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
          alt="বাজারের ছবি"
          width={600}
          height={450}
          unoptimized
          className="max-w-xs md:max-w-sm rounded-lg shadow-xl w-full object-cover aspect-[4/3]"
        />
        
        <div className="text-center lg:text-left flex-1">
          <p className="text-green-600 font-bold mb-2">🌿 বাজারের সেরা দাম</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            প্রতিদিনের বাজার দর <br className="hidden md:block" />
            <span className="text-green-600">এক নজরে</span>
          </h1>
          <p className="py-6 text-gray-600 text-lg max-w-lg mx-auto lg:mx-0">
            চাল, ডাল, তেল থেকে শুরু করে সবজি ও মাছ-মাংসের সর্বশেষ খুচরা মূল্য জেনে নিন খুব সহজেই। আপনার প্রতিদিনের বাজারের হিসাব হোক আরও সহজ।
          </p>
          <a 
            href="#all-products" 
            className="btn btn-primary bg-green-600 hover:bg-green-700 border-none text-white px-8"
          >
            আজকের দাম দেখুন
          </a>
        </div>
      </div>
    </div>
  );
}