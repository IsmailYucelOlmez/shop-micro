"use client";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "../store";
import { removeFromCart, updateQuantity, clearCart, syncServerCart, clearServerCart, loadServerCart, removeServerCartItem } from "../store/cartSlice";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function CartPage() {
  const t = useTranslations('cart');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.total);
  const dispatch = useDispatch<AppDispatch>();

  // Load cart data from Supabase when page loads
  useEffect(() => {
    dispatch(loadServerCart());
  }, [dispatch]);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
    dispatch(syncServerCart());
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
    dispatch(removeServerCartItem(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(clearServerCart());
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold">{t('title')}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors"
              >
                {t('backToShop')}
              </a>
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-lg transition-colors"
                >
                  {t('clearCart')}
                </button>
              )}
            </div>
          </div>

          {cartItems.length === 0 ? (
                      <div className="text-center py-20">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">{t('emptyCart.title')}</h2>
            <p className="text-gray-500 mb-6">{t('emptyCart.description')}</p>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('emptyCart.continueShopping')}
            </a>
          </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill 
                          className="object-contain"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                        <p className="text-lg font-semibold text-blue-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded border hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white text-black p-6 rounded-lg shadow-sm border sticky top-4">
                  <h2 className="text-xl font-semibold mb-4">{t('orderSummary.title')}</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>{t('orderSummary.subtotal', { count: cartItems.reduce((sum, item) => sum + item.quantity, 0) })}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('orderSummary.shipping')}</span>
                      <span>{t('orderSummary.free')}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>{t('orderSummary.total')}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    {t('orderSummary.proceedToCheckout')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
