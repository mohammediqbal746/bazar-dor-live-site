import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-4xl font-bold text-red-500 mb-4">৪০৪ - পেজটি পাওয়া যায়নি</h2>
      <p className="text-gray-600 mb-6">আপনি যে পেজটি খুঁজছেন সেটি হয়তো ডিলিট হয়ে গেছে অথবা লিংকটি ভুল।</p>
      <Link href="/">
        <button className="btn btn-primary">হোম পেজে ফিরে যান</button>
      </Link>
    </div>
  );
}