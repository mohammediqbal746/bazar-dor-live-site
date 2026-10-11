import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-7xl md:text-9xl font-bold text-green-600 mb-4">৪০৪</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        পেজটি খুঁজে পাওয়া যায়নি
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
        আপনি যে পেজটি খুঁজছেন তা হয়তো সরিয়ে ফেলা হয়েছে অথবা লিংকটি ভুল। দয়া করে সঠিক লিংক চেক করুন।
      </p>
      <Link 
        href="/" 
        className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}