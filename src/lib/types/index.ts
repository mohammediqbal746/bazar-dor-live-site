export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  name?: string;
  icon?: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: string;
    pct: number;
  };
  markets?: Market[]; // <--- এখানে any[] এর বদলে Market[] দেওয়া হলো
}

export interface Category {
 id?: string | number;
  name?: string;
  nameBn?: string; // এটি যোগ করা হলো
  slug: string;
  icon?: string
}