const BASE_URL = 'https://openapi.programming-hero.com/api/bazardor';

export async function getAllProducts() {
  const res = await fetch(`${BASE_URL}/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(`${BASE_URL}/products/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function getProductsByCategory(category: string) {
  const res = await fetch(`${BASE_URL}/products?category=${category}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}