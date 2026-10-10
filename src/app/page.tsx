import Hero from "@/components/Hero"; // পাথ আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী ঠিক করে নিবেন

export default function Home() {
  return (
    <div>
      <Hero />
      
      {/* এই সেকশনে আমরা প্রোডাক্টগুলো দেখাবো */}
      <div id="all-products" className="pt-10 mt-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">সব পণ্য</h2>
        <p className="text-gray-500">প্রোডাক্ট কার্ডগুলো এখানে বসবে...</p>
      </div>
    </div>
  );
}