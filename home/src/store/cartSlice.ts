import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cartStateManager, type CartItem, type CartState } from '@shop-micro/shared';

// Re-export types from shared
export type { CartItem, CartState } from '@shop-micro/shared';

const initialState: CartState = cartStateManager.getState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      cartStateManager.addToCart(action.payload);
      const newState = cartStateManager.getState();
      state.items = newState.items;
      state.total = newState.total;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      cartStateManager.removeFromCart(action.payload);
      const newState = cartStateManager.getState();
      state.items = newState.items;
      state.total = newState.total;
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      cartStateManager.updateQuantity(action.payload.id, action.payload.quantity);
      const newState = cartStateManager.getState();
      state.items = newState.items;
      state.total = newState.total;
    },
    clearCart: (state) => {
      cartStateManager.clearCart();
      state.items = [];
      state.total = 0;
    },
    syncCart: (state) => {
      const newState = cartStateManager.getState();
      state.items = newState.items;
      state.total = newState.total;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, syncCart } = cartSlice.actions;
export default cartSlice.reducer;
