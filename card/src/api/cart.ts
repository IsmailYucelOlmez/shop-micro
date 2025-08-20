let currentCartId: number | null = null;
const FAKESTORE_BASE = 'https://fakestoreapi.com';
const DEFAULT_USER_ID = 1;

type ApiCartProduct = { productId: number; quantity: number };

async function getLatestUserCartId(userId: number): Promise<number | null> {
  try {
    const res = await fetch(`${FAKESTORE_BASE}/carts/user/${userId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    type ApiCart = { id: number; date: string };
    const carts: ApiCart[] = await res.json();
    if (!Array.isArray(carts) || carts.length === 0) return null;
    carts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latest = carts[carts.length - 1];
    return typeof latest?.id === 'number' ? latest.id : null;
  } catch {
    return null;
  }
}

async function createCart(userId: number): Promise<number | null> {
  try {
    const res = await fetch(`${FAKESTORE_BASE}/carts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        date: new Date().toISOString(),
        products: [] as ApiCartProduct[],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.id === 'number' ? data.id : null;
  } catch {
    return null;
  }
}

async function ensureCartId(): Promise<number | null> {
  if (currentCartId) return currentCartId;
  const existing = await getLatestUserCartId(DEFAULT_USER_ID);
  if (existing) {
    currentCartId = existing;
    return currentCartId;
  }
  const created = await createCart(DEFAULT_USER_ID);
  if (created) {
    currentCartId = created;
    return currentCartId;
  }
  return null;
}

export async function syncCartProducts(products: ApiCartProduct[]): Promise<boolean> {
  try {
    const cartId = await ensureCartId();
    if (!cartId) return false;
    const res = await fetch(`${FAKESTORE_BASE}/carts/${cartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: DEFAULT_USER_ID,
        date: new Date().toISOString(),
        products,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function clearCartOnServer(): Promise<boolean> {
  try {
    const cartId = await ensureCartId();
    if (!cartId) return false;
    const res = await fetch(`${FAKESTORE_BASE}/carts/${cartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: DEFAULT_USER_ID,
        date: new Date().toISOString(),
        products: [] as ApiCartProduct[],
      }),
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export type { ApiCartProduct };

export async function fetchLatestCartProducts(): Promise<ApiCartProduct[]> {
  const latestId = await getLatestUserCartId(DEFAULT_USER_ID);
  if (!latestId) return [];
  try {
    const res = await fetch(`${FAKESTORE_BASE}/carts/${latestId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: { products?: ApiCartProduct[] } = await res.json();
    const products = Array.isArray(data?.products) ? data.products : [];
    return products as ApiCartProduct[];
  } catch {
    return [];
  }
}


