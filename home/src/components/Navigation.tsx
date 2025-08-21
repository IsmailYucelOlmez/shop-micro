"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('navigation');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Shop Micro
          </Link>
          
          <div className="flex items-center space-x-6">
            <LanguageSwitcher />
            <Link 
              href="/products" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('products')}
            </Link>
            
                         <a 
               href="http://localhost:3001" 
               target="_blank"
               rel="noopener noreferrer"
               className="relative text-gray-600 hover:text-gray-900 transition-colors"
             >
               <ShoppingCart className="h-6 w-6" />
               {itemCount > 0 && (
                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                   {itemCount}
                 </span>
               )}
             </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
