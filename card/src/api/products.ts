type FakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export async function fetchProductById(productId: number): Promise<FakeStoreProduct> {
  const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}


