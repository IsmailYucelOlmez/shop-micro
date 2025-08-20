import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { cartStateManager, type CartItem, type CartState, getCartSessionId, saveCartForSession, loadCartForSession, clearCartForSession } from '@shop-micro/shared';
import { deleteCartItemForSession } from '@shop-micro/shared/lib/supabaseCart';
import { syncCartProducts, clearCartOnServer, fetchLatestCartProducts } from '@/api/cart';
import { fetchProductById } from '@/api/products';

// Helpers to map local items to API format
function toApiProducts(items: CartItem[]) {
  return items.map((i) => ({ productId: i.id, quantity: i.quantity }));
}

// Thunks to keep FakeStore in sync (best-effort)
export const syncServerCart = createAsyncThunk('cart/syncServer', async (_, { getState }) => {
  const state = getState() as { cart: CartState };
  // FakeStore best-effort
  await syncCartProducts(toApiProducts(state.cart.items));
  // Persist to Supabase
  const sessionId = getCartSessionId();
  await saveCartForSession(sessionId, state.cart.items);
});

export const clearServerCart = createAsyncThunk('cart/clearServer', async () => {
  await clearCartOnServer();
  const sessionId = getCartSessionId();
  await clearCartForSession(sessionId);
});

export const loadServerCart = createAsyncThunk('cart/loadServer', async (_, thunkAPI) => {
  const sessionId = getCartSessionId();
  const items = await loadCartForSession(sessionId);
  // If Supabase is not configured or returns no items, do not wipe local cart
  if (!items || items.length === 0) {
    return;
  }
  // Clear current cart and load from Supabase
  thunkAPI.dispatch(clearCart());
  for (const item of items) {
    thunkAPI.dispatch(addToCart({ id: item.id, title: item.title, price: item.price, image: item.image }));
    if (item.quantity > 1) {
      thunkAPI.dispatch(updateQuantity({ id: item.id, quantity: item.quantity }));
    }
  }
});

// Remove single item from Supabase when user removes it locally
export const removeServerCartItem = createAsyncThunk('cart/removeItemServer', async (productId: number) => {
  const sessionId = getCartSessionId();
  await deleteCartItemForSession(sessionId, productId);
});

// Re-export types from shared
export type { CartItem, CartState } from '@shop-micro/shared';

const initialState: CartState = { items: [], total: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id);
        }
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    syncCart: (state) => {
      // No-op: Redux state is the source of truth
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncServerCart.fulfilled, (state) => {
        // No-op: Redux state is the source of truth
      })
      .addCase(clearServerCart.fulfilled, (state) => {
        // No-op: Redux state is the source of truth
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, syncCart } = cartSlice.actions;
export default cartSlice.reducer;
